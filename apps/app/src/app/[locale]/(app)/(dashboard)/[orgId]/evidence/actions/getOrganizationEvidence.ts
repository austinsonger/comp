"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

export const getOrganizationEvidenceById = authActionClient
	.schema(
		z.object({
			id: z.string(),
		}),
	)
	.metadata({
		name: "getOrganizationEvidenceById",
		track: {
			event: "get-organization-evidence-by-id",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { id } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			const evidence = await db.evidence.findFirst({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
				include: {
					assignee: true,
				},
			});

			if (!evidence) {
				return {
					success: false,
					error: "Evidence not found",
				};
			}

			return {
				success: true,
				data: evidence,
			};
		} catch (error) {
			console.error("Error fetching evidence:", error);
			return {
				success: false,
				error: "Failed to fetch evidence",
			};
		}
	});
