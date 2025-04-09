import { db } from "@comp/db";
import { cache } from "react";
import { headers } from "next/headers";
import { getServersideSession } from "@/lib/get-session";

export const useUsers = cache(async () => {
	const session = await getServersideSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return [];
	}

	const users = await db.member.findMany({
		where: { organizationId: session.session.activeOrganizationId },
		include: {
			user: true,
		},
	});

	return users.map((user) => user.user);
});
