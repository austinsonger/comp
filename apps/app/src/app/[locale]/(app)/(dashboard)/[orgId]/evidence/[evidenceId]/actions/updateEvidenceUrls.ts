"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

export const updateEvidenceUrls = authActionClient
	.schema(
		z.object({
			evidenceId: z.string(),
			urls: z.array(z.string().url()),
		}),
	)
	.metadata({
		name: "updateEvidenceUrls",
		track: {
			event: "update-evidence-urls",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { evidenceId, urls } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			} as const;
		}

		try {
			const evidence = await db.evidence.findFirst({
				where: {
					id: evidenceId,
					organizationId: session.activeOrganizationId,
				},
			});

			if (!evidence) {
				return {
					success: false,
					error: "Evidence not found",
				} as const;
			}

			const updatedEvidence = await db.evidence.update({
				where: { id: evidenceId },
				data: {
					additionalUrls: urls,
				},
			});

			return {
				success: true,
				data: updatedEvidence,
			} as const;
		} catch (error) {
			console.error("Error updating evidence URLs:", error);
			return {
				success: false,
				error: "Failed to update evidence URLs",
			} as const;
		}
	});
