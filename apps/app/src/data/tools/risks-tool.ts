import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { Departments, RiskStatus, RiskCategory } from "@comp/db/types";
import { tool } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

export function getRiskTools() {
	return {
		getRisks,
		getRiskById,
	};
}

export const getRisks = tool({
	description: "Get risks for the organization",
	parameters: z.object({
		status: z
			.enum(Object.values(RiskStatus) as [RiskStatus, ...RiskStatus[]])
			.optional(),
		department: z
			.enum(Object.values(Departments) as [Departments, ...Departments[]])
			.optional(),
		category: z
			.enum(Object.values(RiskCategory) as [RiskCategory, ...RiskCategory[]])
			.optional(),
		owner: z.string().optional(),
	}),
	execute: async ({ status, department, category, owner }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.session.activeOrganizationId) {
			return { error: "Unauthorized" };
		}

		const risks = await db.risk.findMany({
			where: {
				organizationId: session.session.activeOrganizationId,
				status,
				department,
				category,
				assigneeId: owner,
			},
			select: {
				id: true,
				title: true,
				status: true,
			},
		});

		if (risks.length === 0) {
			return {
				risks: [],
				message: "No risks found",
			};
		}

		return {
			risks,
		};
	},
});

export const getRiskById = tool({
	description: "Get a risk by id",
	parameters: z.object({
		id: z.string(),
	}),
	execute: async ({ id }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.session.activeOrganizationId) {
			return { error: "Unauthorized" };
		}

		const risk = await db.risk.findUnique({
			where: { id, organizationId: session.session.activeOrganizationId },
		});

		if (!risk) {
			return {
				risk: null,
				message: "Risk not found",
			};
		}

		return {
			risk,
		};
	},
});
