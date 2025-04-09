"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { Role } from "@prisma/client";
import { z } from "zod";

export const assignEvidence = authActionClient
	.schema(
		z.object({
			id: z.string(),
			assigneeId: z.string().nullable(),
		}),
	)
	.metadata({
		name: "assignEvidence",
		track: {
			event: "assign-evidence",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { id, assigneeId } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Verify the evidence exists and belongs to the organization
			const evidence = await db.evidence.findFirst({
				where: {
					id,
					organizationId: session.activeOrganizationId,
				},
			});

			if (!evidence) {
				return {
					success: false,
					error: "Evidence not found",
				};
			}

			// If assigneeId is provided, verify the user exists and has admin privileges
			if (assigneeId) {
				const adminMember = await db.member.findFirst({
					where: {
						userId: assigneeId,
						organizationId: session.activeOrganizationId,
						role: {
							in: [Role.admin],
						},
					},
				});

				if (!adminMember) {
					return {
						success: false,
						error: "User not found or does not have admin privileges",
					};
				}
			}

			// Update the evidence with the new assignee
			const updatedEvidence = await db.evidence.update({
				where: {
					id,
				},
				data: {
					assigneeId,
					updatedAt: new Date(),
				},
			});

			return {
				success: true,
				data: updatedEvidence,
			};
		} catch (error) {
			console.error("Error assigning evidence:", error);
			return {
				success: false,
				error: "Failed to assign evidence",
			};
		}
	});
