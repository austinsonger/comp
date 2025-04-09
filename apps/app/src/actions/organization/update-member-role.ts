"use server";

import { db } from "@comp/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import { Departments, Role } from "@prisma/client";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";
import { authClient } from "@/utils/auth-client";

const updateMemberRoleSchema = z.object({
	memberId: z.string(),
	role: z.nativeEnum(Role),
	department: z.nativeEnum(Departments).optional(),
});

export const updateMemberRole = authActionClient
	.metadata({
		name: "update-member-role",
		track: {
			event: "update_member_role",
			channel: "organization",
		},
	})
	.schema(updateMemberRoleSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<ActionResponse<{ updated: boolean }>> => {
			if (!ctx.session.activeOrganizationId) {
				return {
					success: false,
					error: "User does not have an organization",
				};
			}

			const { memberId, role, department } = parsedInput;

			try {
				// Check if user has admin permissions
				const currentUserMember = await db.member.findFirst({
					where: {
						organizationId: ctx.session.activeOrganizationId,
						userId: ctx.user.id,
					},
				});

				if (!currentUserMember || currentUserMember.role !== Role.admin) {
					return {
						success: false,
						error: "You don't have permission to update member roles",
					};
				}

				// Check if the target member exists in the organization
				const targetMember = await db.member.findFirst({
					where: {
						id: memberId ?? "",
						organizationId: ctx.session.activeOrganizationId,
					},
				});

				if (!targetMember) {
					return {
						success: false,
						error: "Member not found in this organization",
					};
				}

				if (!role) {
					throw new Error("Role is required");
				}

				// Convert role to a valid role type for the authClient
				const validRole = role === "auditor" ? "member" : role;

				await authClient.organization.updateMemberRole({
					memberId: targetMember.userId,
					role: validRole as "owner" | "admin" | "member",
					organizationId: ctx.session.activeOrganizationId ?? "",
				});

				revalidatePath("/settings/members");
				revalidateTag(`user_${ctx.user.id}`);

				return {
					success: true,
					data: { updated: true },
				};
			} catch (error) {
				console.error("Error updating member role:", error);
				return {
					success: false,
					error: "Failed to update member role",
				};
			}
		},
	);
