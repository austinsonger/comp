"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";

export const markPolicyAsCompleted = authActionClient
  .schema(z.object({ policyId: z.string() }))
  .metadata({
    name: "markPolicyAsCompleted",
    track: {
      event: "markPolicyAsCompleted",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { policyId } = parsedInput;
    const { user } = ctx;

    logger("markPolicyAsCompleted action started", {
      policyId,
      userId: user?.id,
    });

    if (!user) {
      logger("Unauthorized attempt to mark policy as completed", { policyId });
      throw new Error("Unauthorized");
    }

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!member) {
      logger("Member not found", { userId: user.id });
      throw new Error("Member not found");
    }

    const policy = await db.policy.findUnique({
      where: {
        id: policyId,
      },
    });

    if (!policy) {
      logger("Policy not found", { policyId });
      throw new Error("Policy not found");
    }

    // Check if user has already signed this policy
    if (policy.signedBy.includes(member.id)) {
      logger("User has already signed this policy", {
        policyId,
        memberId: member.id,
      });
      return policy;
    }

    logger("Updating policy signature", { policyId, memberId: member.id });
    const completedPolicy = await db.policy.update({
      where: { id: policyId },
      data: {
        signedBy: [...policy.signedBy, member.id],
      },
    });

    logger("Policy successfully marked as completed", {
      policyId,
      memberId: member.id,
    });

    revalidatePath("/");

    return completedPolicy;
  });
