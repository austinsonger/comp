"use server";

import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import {
  createFrameworkInstance,
  getRelevantControls,
  createOrganizationPolicies,
  createOrganizationEvidence,
  createControlArtifacts,
} from "./lib/utils";
import { createStripeCustomer } from "./lib/create-stripe-customer";
import { db } from "@comp/db";
import { performance } from "node:perf_hooks";

export const createOrganizationAction = authActionClient
  .schema(organizationSchema)
  .metadata({
    name: "create-organization",
    track: {
      event: "create-organization",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { name, frameworks } = parsedInput;
    const { id: userId } = ctx.user;

    if (!name) {
      console.log("Invalid input detected:", { name });
      throw new Error("Invalid user input");
    }

    const timings = {
      getAuthSession: 0,
      createStripeCustomer: 0,
      updateOrganizationWithStripeId: 0,
      transaction: 0, // Timing for the whole transaction
      getRelevantControls: 0,
      createFrameworkInstances: 0,
      createPoliciesAndEvidenceParallel: 0,
      createControlArtifacts: 0,
      total: 0,
    };
    const totalStart = performance.now();
    let start = performance.now();

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      timings.getAuthSession = (performance.now() - start) / 1000;

      if (!session?.session.activeOrganizationId) {
        throw new Error("User is not part of an organization");
      }

      const organizationId = session.session.activeOrganizationId;

      // --- External API Call + Initial Org Update (Outside Transaction) ---
      start = performance.now();
      const stripeCustomerId = await createStripeCustomer({
        name,
        email: session.user.email,
        organizationId,
      });
      timings.createStripeCustomer = (performance.now() - start) / 1000;

      if (!stripeCustomerId) {
        throw new Error("Failed to create Stripe customer");
      }

      start = performance.now();
      await db.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId },
      });
      timings.updateOrganizationWithStripeId =
        (performance.now() - start) / 1000;

      // --- Main Creation Logic (Inside Transaction) ---
      const transactionStart = performance.now();
      const result = await db.$transaction(
        async (tx) => {
          // REVISIT: Consider if more granular error handling/logging is needed within the transaction

          start = performance.now();
          const relevantControls = getRelevantControls(frameworks);
          const getRelevantControlsTime = (performance.now() - start) / 1000;

          start = performance.now();
          // Pass the transaction client `tx` to the helper
          const organizationFrameworks = await Promise.all(
            frameworks.map(
              (frameworkId) =>
                createFrameworkInstance(organizationId, frameworkId, tx) // Pass tx
            )
          );
          const createFrameworkInstancesTime =
            (performance.now() - start) / 1000;

          // Run policy and evidence creation in parallel
          start = performance.now();
          // Pass the transaction client `tx` to the helpers
          const [policiesForFrameworks, evidenceForFrameworks] =
            await Promise.all([
              createOrganizationPolicies(
                organizationId,
                relevantControls,
                userId,
                tx
              ), // Pass tx
              createOrganizationEvidence(
                organizationId,
                relevantControls,
                userId,
                tx
              ), // Pass tx
            ]);
          const createPoliciesAndEvidenceParallelTime =
            (performance.now() - start) / 1000;

          start = performance.now();
          // Pass the transaction client `tx` to the helper
          await createControlArtifacts(
            organizationId,
            organizationFrameworks.map((framework) => framework.id),
            relevantControls,
            policiesForFrameworks,
            evidenceForFrameworks,
            tx // Pass tx
          );
          const createControlArtifactsTime = (performance.now() - start) / 1000;

          // Return timings calculated inside the transaction scope
          return {
            getRelevantControlsTime,
            createFrameworkInstancesTime,
            createPoliciesAndEvidenceParallelTime,
            createControlArtifactsTime,
            organizationFrameworks, // Need this for the final return value potentially
          };
        },
        {
          maxWait: 15000,
          timeout: 40000,
        }
      );
      timings.transaction = (performance.now() - transactionStart) / 1000;

      // Assign timings from the transaction result
      timings.getRelevantControls = result.getRelevantControlsTime;
      timings.createFrameworkInstances = result.createFrameworkInstancesTime;
      timings.createPoliciesAndEvidenceParallel =
        result.createPoliciesAndEvidenceParallelTime;
      timings.createControlArtifacts = result.createControlArtifactsTime;

      timings.total = (performance.now() - totalStart) / 1000;
      console.log("createOrganizationAction timings (s):", timings);
      console.warn(
        "NOTE: Transactionality currently relies on global 'db' client within helpers. Refactor helpers to accept 'tx' for true atomicity."
      );

      return {
        success: true,
        organizationId: session.session.activeOrganizationId,
      };
    } catch (error) {
      console.error("Error during organization creation/update:", error);
      timings.total = (performance.now() - totalStart) / 1000;
      console.log("createOrganizationAction timings on error (s):", timings);

      // More specific error handling could be added here
      throw new Error("Failed to create or update organization structure");
    }
  });
