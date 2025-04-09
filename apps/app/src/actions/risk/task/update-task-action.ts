// update-task-action.ts

"use server";

import { db } from "@comp/db";
import type { TaskStatus } from "@comp/db/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "../../safe-action";
import { updateTaskSchema } from "../../schema";

export const updateTaskAction = authActionClient
	.schema(updateTaskSchema)
	.metadata({
		name: "update-task",
		track: {
			event: "update-task",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { id, dueDate, status, assigneeId, title, description } = parsedInput;
		const { session } = ctx;

		if (!session.activeOrganizationId) {
			throw new Error("Invalid user input");
		}

		try {
			const task = await db.task.findUnique({
				where: {
					id: id,
				},
			});

			if (!task) {
				throw new Error("Task not found");
			}

			await db.task.update({
				where: {
					id: id,
					organizationId: session.activeOrganizationId,
				},
				data: {
					dueDate: dueDate,
					status: status as TaskStatus,
					assigneeId,
					title: title,
					description: description,
				},
			});

			revalidatePath(`/${session.activeOrganizationId}/risk`);
			revalidatePath(`/${session.activeOrganizationId}/risk/${id}`);
			revalidatePath(`/${session.activeOrganizationId}/risk/${id}/tasks/${id}`);
			revalidateTag("risks");

			return { success: true };
		} catch (error) {
			console.error(error);
			return { success: false };
		}
	});
