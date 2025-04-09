"use server";

import { authActionClient } from "./safe-action";
import { z } from "zod";
import { db } from "@comp/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export const changeOrganizationAction = authActionClient
	.schema(
		z.object({
			organizationId: z.string(),
		}),
	)
	.metadata({
		name: "change-organization",
		track: {
			event: "create-employee",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { organizationId } = parsedInput;
		const { user } = ctx;

		const organizationMember = await db.member.findFirst({
			where: {
				userId: user.id,
				organizationId,
			},
		});

		if (!organizationMember) {
			return {
				success: false,
				error: "Unauthorized",
			};
		}

		try {
			const organization = await db.organization.findUnique({
				where: {
					id: organizationId,
				},
			});

			if (!organization) {
				return {
					success: false,
					error: "Organization not found",
				};
			}

			auth.api.setActiveOrganization({
				headers: await headers(),
				body: {
					organizationId: organizationId,
				},
			});

			revalidatePath(`/${organization.id}`, "layout");

			return {
				success: true,
				data: organization,
			};
		} catch (error) {
			console.error("Error changing organization:", error);

			return {
				success: false,
				error: "Failed to change organization",
			};
		}
	});
