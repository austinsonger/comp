"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UPLOAD_TYPE } from "@/actions/types";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	throw new Error("AWS credentials are not set");
}

if (!process.env.AWS_BUCKET_NAME) {
	throw new Error("AWS bucket name is not set");
}

if (!process.env.AWS_REGION) {
	throw new Error("AWS region is not set");
}

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

function extractS3KeyFromUrl(url: string): string {
	const fullUrlMatch = url.match(/amazonaws\.com\/(.+)$/);
	if (fullUrlMatch?.[1]) {
		return decodeURIComponent(fullUrlMatch[1]);
	}

	if (!url.includes("amazonaws.com")) {
		return url;
	}

	throw new Error("Invalid S3 URL format");
}

export const getFileUrl = authActionClient
	.schema(
		z.discriminatedUnion("uploadType", [
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
		]),
	)
	.metadata({
		name: "get-file-url",
		track: {
			event: "get-file-url",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { session } = ctx;
		const { uploadType, fileUrl } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			} as const;
		}

		try {
			if (uploadType === UPLOAD_TYPE.evidence) {
				const evidence = await db.evidence.findFirst({
					where: {
						id: parsedInput.evidenceId,
						organizationId: session.activeOrganizationId,
					},
				});

				if (!evidence) {
					throw new Error("Evidence or file not found");
				}

				const key = extractS3KeyFromUrl(fileUrl);

				const command = new GetObjectCommand({
					Bucket: process.env.AWS_BUCKET_NAME,
					Key: key,
				});

				const signedUrl = await getSignedUrl(s3Client, command, {
					expiresIn: 3600,
				});

				if (!signedUrl) {
					throw new Error("Failed to generate signed URL");
				}

				return { signedUrl };
			}
		} catch (error) {
			console.error("Server Error:", error);
			throw error instanceof Error
				? error
				: new Error("Failed to generate signed URL");
		}
	});
