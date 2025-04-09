"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

const schema = z.object({
	evidenceId: z.string(),
	fileUrl: z.string(),
});

interface SuccessResponse {
	success: true;
}

interface ErrorResponse {
	success: false;
	error: string;
}

type ActionResponse = SuccessResponse | ErrorResponse;

export const deleteEvidenceFile = authActionClient
	.schema(schema)
	.metadata({
		name: "deleteEvidenceFile",
		track: {
			event: "delete-evidence-file",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }): Promise<ActionResponse> => {
		const { session } = ctx;
		const { evidenceId, fileUrl } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			const evidence = await db.evidence.findFirst({
				where: {
					id: evidenceId,
					organizationId: session.activeOrganizationId,
					fileUrls: {
						has: fileUrl,
					},
				},
			});

			if (!evidence) {
				return {
					success: false,
					error: "Evidence or file not found",
				};
			}

			await db.evidence.update({
				where: { id: evidenceId },
				data: {
					fileUrls: {
						set: evidence.fileUrls.filter((url) => url !== fileUrl),
					},
				},
			});

			return {
				success: true,
			};
		} catch (error) {
			console.error("Error deleting file:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to delete file",
			};
		}
	});
