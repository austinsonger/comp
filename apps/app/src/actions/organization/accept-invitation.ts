"use server";

import { db } from "@comp/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import type { ActionResponse } from "../types";

async function validateInviteCode(inviteCode: string, invitedEmail: string) {
	const pendingInvitation = await db.invitation.findFirst({
		where: {
			status: "pending",
			email: invitedEmail,
			id: inviteCode,
		},
		include: {
			organization: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	return pendingInvitation;
}

const completeInvitationSchema = z.object({
	inviteCode: z.string(),
});

export const completeInvitation = authActionClient
	.metadata({
		name: "complete-invitation",
		track: {
			event: "complete_invitation",
			channel: "organization",
		},
	})
	.schema(completeInvitationSchema)
	.action(
		async ({
			parsedInput,
			ctx,
		}): Promise<
			ActionResponse<{
				accepted: boolean;
				organizationId: string;
			}>
		> => {
			const { inviteCode } = parsedInput;
			const user = ctx.user;

			if (!user || !user.email) {
				throw new Error("Unauthorized");
			}

			try {
				const invitation = await validateInviteCode(inviteCode, user.email);

				if (!invitation) {
					throw new Error("Invitation either used or expired");
				}

				const existingMembership = await db.member.findFirst({
					where: {
						userId: user.id,
						organizationId: invitation.organizationId,
					},
				});

				if (existingMembership) {
					if (ctx.session.activeOrganizationId !== invitation.organizationId) {
						await db.session.update({
							where: { id: ctx.session.id },
							data: {
								activeOrganizationId: invitation.organizationId,
							},
						});
					}

					await db.invitation.update({
						where: { id: invitation.id },
						data: {
							status: "accepted",
						},
					});

					return {
						success: true,
						data: {
							accepted: true,
							organizationId: invitation.organizationId,
						},
					};
				}

				if (!invitation.role) {
					throw new Error("Invitation role is required");
				}

				await db.member.create({
					data: {
						userId: user.id,
						organizationId: invitation.organizationId,
						role: invitation.role,
						department: "none",
					},
				});

				await db.invitation.update({
					where: {
						id: invitation.id,
					},
					data: {
						status: "accepted",
					},
				});

				await db.session.update({
					where: {
						id: ctx.session.id,
					},
					data: {
						activeOrganizationId: invitation.organizationId,
					},
				});

				revalidatePath(`/${invitation.organization.id}`);
				revalidatePath(`/${invitation.organization.id}/settings/members`);
				revalidateTag(`user_${user.id}`);

				return {
					success: true,
					data: {
						accepted: true,
						organizationId: invitation.organizationId,
					},
				};
			} catch (error) {
				console.error("Error accepting invitation:", error);
				throw new Error(error as string);
			}
		},
	);
