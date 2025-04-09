// update-risk-action.ts

"use server";

import { db } from "@comp/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "@/actions/safe-action";
import { updateVendorSchema } from "./schema";

export const updateVendorAction = authActionClient
	.schema(updateVendorSchema)
	.metadata({
		name: "update-vendor",
		track: {
			event: "update-vendor",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { id, name, description, category, assigneeId, status } = parsedInput;
		const { session } = ctx;

		if (!session.activeOrganizationId) {
			throw new Error("Invalid user input");
		}

		console.log({
			id,
			name,
			description,
			category,
			assigneeId,
			status,
		});

		try {
			await db.vendor.update({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
				data: {
					name,
					description,
					assigneeId,
					category,
					status,
				},
			});

			revalidatePath(`/${session.activeOrganizationId}/vendors`);
			revalidatePath(`/${session.activeOrganizationId}/vendors/register`);
			revalidatePath(`/${session.activeOrganizationId}/vendors/${id}`);
			revalidateTag("vendors");

			return {
				success: true,
			};
		} catch (error) {
			console.error("Error updating vendor:", error);

			return {
				success: false,
			};
		}
	});
