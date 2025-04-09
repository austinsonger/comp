"use server";

import { db } from "@comp/db";
import { authActionClient } from "../safe-action";
import { z } from "zod";
import { Role } from "@prisma/client";
import type { ActionResponse } from "../types";
import { revalidatePath, revalidateTag } from "next/cache";
import { authClient } from "@/utils/auth-client";
const removeMemberSchema = z.object({
	memberId: z.string(),
});

export const removeMember = authActionClient
	.metadata({
		name: "remove-member",
		track: {
			event: "remove_member",
			channel: "organization",
		},
	})
	.schema(removeMemberSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<ActionResponse<{ removed: boolean }>> => {
			if (!ctx.session.activeOrganizationId) {
				return {
					success: false,
					error: "User does not have an organization",
				};
			}

			const { memberId } = parsedInput;

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
						error: "You don't have permission to remove members",
					};
				}

				// Check if the target member exists in the organization
				const targetMember = await db.member.findFirst({
					where: {
						id: memberId,
						organizationId: ctx.session.activeOrganizationId,
					},
				});

				if (!targetMember) {
					return {
						success: false,
						error: "Member not found in this organization",
					};
				}

				// Prevent removing the owner
				if (targetMember.role === Role.admin) {
					return {
						success: false,
						error: "Cannot remove the organization owner",
					};
				}

				// Prevent self-removal
				if (targetMember.userId === ctx.user.id) {
					return {
						success: false,
						error: "You cannot remove yourself from the organization",
					};
				}

				// Remove the member
				await authClient.organization.removeMember({
					memberIdOrEmail: targetMember.userId, // this can also be the email of the member
					organizationId: ctx.session.activeOrganizationId ?? "", // optional, by default it will use the active organization
				});

				await db.session.deleteMany({
					where: {
						userId: targetMember.userId,
					},
				});

				revalidatePath(`/${ctx.session.activeOrganizationId}`);
				revalidateTag(`user_${ctx.user.id}`);

				return {
					success: true,
					data: { removed: true },
				};
			} catch (error) {
				console.error("Error removing member:", error);
				return {
					success: false,
					error: "Failed to remove member",
				};
			}
		},
	);
