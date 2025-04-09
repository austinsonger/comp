"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { Departments, Frequency } from "@comp/db/types";
import { Evidence, EvidenceStatus, Role } from "@prisma/client";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types";

const schema = z.object({
	id: z.string(),
	department: z.nativeEnum(Departments),
	frequency: z.nativeEnum(Frequency).nullable(),
	assigneeId: z.string().nullable(),
	status: z.nativeEnum(EvidenceStatus).nullable(),
});

export const updateEvidenceDetails = authActionClient
	.schema(schema)
	.metadata({
		name: "updateEvidenceDetails",
		track: {
			event: "update-evidence-details",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }): Promise<ActionResponse> => {
		const { session } = ctx;
		const { id, department, frequency, assigneeId, status } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Verify the evidence exists and belongs to the organization
			const evidence = await db.evidence.findFirst({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
			});

			if (!evidence) {
				return {
					success: false,
					error: "Evidence not found",
				};
			}

			const payload: Pick<
				Evidence,
				"department" | "frequency" | "assigneeId" | "status" | "lastPublishedAt"
			> = {
				department,
				frequency,
				assigneeId,
				lastPublishedAt: new Date(),
				status,
			};

			// Update all evidence details in a single operation
			const updatedEvidence = await db.evidence.update({
				where: {
					id,
				},
				data: payload,
			});

			return {
				success: true,
				data: updatedEvidence,
			};
		} catch (error) {
			console.error("Error updating evidence details:", error);
			return {
				success: false,
				error: "Failed to update evidence details",
			};
		}
	});
