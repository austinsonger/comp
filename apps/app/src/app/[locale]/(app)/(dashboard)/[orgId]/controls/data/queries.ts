import "server-only";

import { db } from "@comp/db";
import { auth } from "@/utils/auth";
import type { GetControlSchema } from "./validations";
import { cache } from "react";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

export async function getControls(input: GetControlSchema) {
	return await cache(async () => {
		try {
			const session = await auth.api.getSession({ headers: await headers() });
			const organizationId = session?.session.activeOrganizationId;

			if (!organizationId) {
				throw new Error("Organization not found");
			}

			const orderBy = input.sort.map((sort) => ({
				[sort.id]: sort.desc ? "desc" : "asc",
			}));

			const where: Prisma.ControlWhereInput = {
				organizationId,
				...(input.name && {
					name: {
						contains: input.name,
						mode: Prisma.QueryMode.insensitive,
					},
				}),
				...(input.lastUpdated.length > 0 && {
					lastUpdated: {
						in: input.lastUpdated,
					},
				}),
			};

			const controls = await db.control.findMany({
				where,
				orderBy: orderBy.length > 0 ? orderBy : [{ name: "asc" }],
				skip: (input.page - 1) * input.perPage,
				take: input.perPage,
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
					requirementsMapped: {
						include: {
							frameworkInstance: true,
						},
					},
				},
			});

			const total = await db.control.count({
				where,
			});

			const pageCount = Math.ceil(total / input.perPage);
			return { data: controls, pageCount };
		} catch (_err) {
			return { data: [], pageCount: 0 };
		}
	})();
}
