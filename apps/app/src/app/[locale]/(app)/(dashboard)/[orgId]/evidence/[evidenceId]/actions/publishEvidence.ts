"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

const schema = z.object({
	id: z.string(),
});

interface SuccessResponse {
	success: true;
}

interface ErrorResponse {
	success: false;
	error: string;
}

type ActionResponse = SuccessResponse | ErrorResponse;

export const publishEvidence = authActionClient
	.schema(schema)
	.metadata({
		name: "publishEvidence",
		track: {
			event: "publish-evidence",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }): Promise<ActionResponse> => {
		const { session } = ctx;
		const { id } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Check if evidence exists and belongs to organization
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

			// Update the evidence to mark it as published
			await db.evidence.update({
				where: { id },
				data: {
					published: true,
					lastPublishedAt: new Date(),
				},
			});

			return {
				success: true,
			};
		} catch (error) {
			console.error("Error publishing evidence:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to publish evidence",
			};
		}
	});
