"use server";

import { authActionClient } from "@/actions/safe-action";
import { uploadTaskFileSchema } from "@/actions/schema";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export const revalidateUpload = authActionClient
	.schema(uploadTaskFileSchema)
	.metadata({
		name: "upload-task-file",
		track: {
			event: "upload-task-file",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { riskId, taskId } = parsedInput;
		const { session } = ctx;

		if (!session.activeOrganizationId) {
			throw new Error("Unauthorized");
		}

		revalidatePath(`/${session.activeOrganizationId}/risk/${riskId}`);
		revalidatePath(
			`/${session.activeOrganizationId}/risk/${riskId}/tasks/${taskId}`,
		);
		revalidateTag("risk-cache");

		return {
			riskId,
			taskId,
		};
	});
