"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

import { UPLOAD_TYPE } from "@/actions/types";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	throw new Error("AWS credentials are not set");
}

const schema = z.discriminatedUnion("uploadType", [
	z.object({
		uploadType: z.literal(UPLOAD_TYPE.evidence),
		evidenceId: z.string(),
		fileUrl: z.string(),
	}),
	z.object({
		uploadType: z.literal(UPLOAD_TYPE.riskTask),
		taskId: z.string(),
		fileUrl: z.string(),
	}),
	z.object({
		uploadType: z.literal(UPLOAD_TYPE.vendorTask),
		taskId: z.string(),
		fileUrl: z.string(),
	}),
]);

interface SuccessResponse {
	success: true;
}

interface ErrorResponse {
	success: false;
	error: string;
}

type ActionResponse = SuccessResponse | ErrorResponse;

export const deleteFile = authActionClient
	.schema(schema)
	.metadata({
		name: "deleteFile",
		track: {
			event: "delete-file",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }): Promise<ActionResponse> => {
		const { session } = ctx;
		const { uploadType, fileUrl } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			if (uploadType === UPLOAD_TYPE.evidence) {
				const evidenceId = parsedInput.evidenceId;

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
			}

			return {
				success: false,
				error: "Invalid upload type",
			};
		} catch (error) {
			console.error("Error deleting file:", error);
			return {
				success: false,
				error: "Failed to delete file",
			};
		}
	});
