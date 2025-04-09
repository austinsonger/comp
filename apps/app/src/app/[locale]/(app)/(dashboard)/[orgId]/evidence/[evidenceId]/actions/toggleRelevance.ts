"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

export const toggleRelevance = authActionClient
	.schema(
		z.object({
			id: z.string(),
			isNotRelevant: z.boolean(),
		}),
	)
	.metadata({
		name: "toggleRelevance",
		track: {
			event: "toggle-evidence-relevance",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { id, isNotRelevant } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Check if the evidence exists
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

			// Update the evidence with the new relevance status
			// If marking as not relevant, also unpublish it
			const updatedEvidence = await db.evidence.update({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
				data: {
					isNotRelevant,
					// If marking as not relevant, also unpublish it
					...(isNotRelevant === true && {
						published: false,
						lastPublishedAt: null,
					}),
				},
			});

			return {
				success: true,
				data: updatedEvidence,
			};
		} catch (error) {
			console.error("Error toggling evidence relevance:", error);
			return {
				success: false,
				error: "Failed to update evidence relevance status",
			};
		}
	});
