"use server";

import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";
import { cache } from "react";

export const getAllOrganizationControls = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		throw new Error("Unauthorized");
	}

	const controls = await db.control.findMany({
		where: {
			organizationId: session.session.activeOrganizationId,
		},
		include: {
			artifacts: {
				include: {
					policy: {
						select: {
							status: true,
						},
					},
					evidence: {
						select: {
							published: true,
						},
					},
				},
			},
			requirementsMapped: true,
		},
	});

	return controls;
});
