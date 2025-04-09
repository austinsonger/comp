"use server";

import { authActionClient } from "./safe-action";
import { z } from "zod";
import { db } from "@comp/db";
import { AppError, appErrors } from "@/lib/errors";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const addCommentAction = authActionClient
	.schema(
		z.object({
			content: z.string(),
			entityId: z.string(),
		}),
	)
	.metadata({
		name: "add-comment",
		track: {
			event: "add-comment",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { content, entityId } = parsedInput;
		const { user, session } = ctx;

		if (!session || !session.activeOrganizationId) {
			return {
				success: false,
				error: appErrors.UNAUTHORIZED,
			};
		}

		try {
			const member = await db.member.findFirst({
				where: {
					userId: session.userId,
					organizationId: session.activeOrganizationId,
				},
			});

			if (!member) {
				return {
					success: false,
					error: appErrors.UNAUTHORIZED,
				};
			}

			const comment = await db.comment.create({
				data: {
					content,
					entityId,
					organizationId: session.activeOrganizationId,
					authorId: member.id,
				},
			});

			const headersList = await headers();
			let path =
				headersList.get("x-pathname") || headersList.get("referer") || "";
			path = path.replace(/\/[a-z]{2}\//, "/");

			if (path) {
				revalidatePath(path);
			}

			return { success: true, data: comment };
		} catch (error) {
			return {
				success: false,
				error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
			};
		}
	});
