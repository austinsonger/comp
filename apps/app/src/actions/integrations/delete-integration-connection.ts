// delete-integration-connection.ts

"use server";

import { db } from "@comp/db";
import { revalidatePath } from "next/cache";
import { authActionClient } from "../safe-action";
import { deleteIntegrationConnectionSchema } from "../schema";

export const deleteIntegrationConnectionAction = authActionClient
	.schema(deleteIntegrationConnectionSchema)
	.metadata({
		name: "delete-integration-connection",
		track: {
			event: "delete-integration-connection",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { integrationId } = parsedInput;
		const { session } = ctx;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Unauthorized",
			};
		}

		const integration = await db.integration.findUnique({
			where: {
				name: integrationId.toLowerCase(),
				organizationId: session.activeOrganizationId,
			},
		});

		if (!integration) {
			return {
				success: false,
				error: "Integration not found",
			};
		}

		await db.integration.delete({
			where: {
				id: integration.id,
			},
		});

		revalidatePath("/integrations");

		return {
			success: true,
		};
	});
