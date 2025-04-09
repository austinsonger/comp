"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { Role } from "@prisma/client";

export const getOrganizationAdmins = authActionClient
	.metadata({
		name: "getOrganizationAdmins",
		track: {
			event: "get-organization-admins",
			channel: "server",
		},
	})
	.action(async ({ ctx }) => {
		const { session } = ctx;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Find organization members with admin or owner roles
			const adminMembers = await db.member.findMany({
				where: {
					organizationId: session.activeOrganizationId,
					role: {
						in: [Role.admin],
					},
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
				orderBy: {
					user: {
						name: "asc",
					},
				},
			});

			// Transform the data to a simpler format
			const admins = adminMembers.map((member) => ({
				id: member.userId,
				name: member.user.name || "Unknown",
				email: member.user.email || "",
				image: member.user.image || null,
				role: member.role,
			}));

			return {
				success: true,
				data: admins,
			};
		} catch (error) {
			console.error("Error fetching organization admins:", error);
			return {
				success: false,
				error: "Failed to fetch organization admins",
			};
		}
	});
