import "server-only";

import { db } from "@comp/db";
import { auth } from "@/utils/auth";
import type { GetEvidenceSchema } from "./validations";
import { cache } from "react";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

export async function getEvidence(input: GetEvidenceSchema) {
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

			const where: Prisma.EvidenceWhereInput = {
				organizationId,
			};

			const evidence = await db.evidence.findMany({
				where,
				orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
				skip: (input.page - 1) * input.perPage,
				take: input.perPage,
			});

			const total = await db.evidence.count({
				where,
			});

			const pageCount = Math.ceil(total / input.perPage);
			return { data: evidence, pageCount };
		} catch (_err) {
			return { data: [], pageCount: 0 };
		}
	})();
}
