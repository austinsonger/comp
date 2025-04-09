"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";

export const getAllOrganizationControlRequirements = authActionClient
	.schema(
		z.object({
			search: z.string().optional().nullable(),
		}),
	)
	.metadata({
		name: "getAllOrganizationControlRequirements",
		track: {
			event: "get-all-organization-control-requirements",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;

		if (!session.activeOrganizationId) {
			return {
				error: "Not authorized - no organization found",
			};
		}

		try {
			const organizationControlRequirements = await db.control.findMany({
				where: {
					organizationId: session.activeOrganizationId,
				},
				include: {
					organization: {
						include: {
							policy: true,
						},
					},
				},
			});

			if (!organizationControlRequirements) {
				return {
					error: "Organization control requirements not found",
				};
			}

			return {
				data: {
					organizationControlRequirements,
				},
			};
		} catch (error) {
			console.error("Error fetching organization control requirements:", error);
			return {
				error: "Failed to fetch organization control requirements",
			};
		}
	});
