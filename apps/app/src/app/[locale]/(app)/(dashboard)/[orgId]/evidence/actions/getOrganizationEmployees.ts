"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { Role } from "@prisma/client";

export const getOrganizationEmployees = authActionClient
	.metadata({
		name: "getOrganizationEmployees",
		track: {
			event: "get-organization-employees",
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
						in: [Role.employee],
					},
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
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
