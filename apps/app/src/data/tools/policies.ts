import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { tool } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

export function getPolicyTools() {
	return {
		getPolicies,
		getPolicyContent,
	};
}

export const getPolicies = tool({
	description: "Get all policies for the organization",
	parameters: z.object({
		status: z.enum(["draft", "published"]).optional(),
	}),
	execute: async ({ status }) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.session.activeOrganizationId) {
			return { error: "Unauthorized" };
		}

		const policies = await db.policy.findMany({
			where: { organizationId: session.session.activeOrganizationId, status },
			select: {
				id: true,
				name: true,
				description: true,
				department: true,
			},
		});

		if (policies.length === 0) {
			return {
				policies: [],
				message: "No policies found",
			};
		}

		return {
			policies,
		};
	},
});

export const getPolicyContent = tool({
	description:
		"Get the content of a specific policy by id. We can only acquire the policy id by running the getPolicies tool first.",
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

		const policy = await db.policy.findUnique({
			where: { id, organizationId: session.session.activeOrganizationId },
			select: {
				content: true,
			},
		});

		if (!policy) {
			return {
				content: null,
				message: "Policy not found",
			};
		}

		return {
			content: policy?.content,
		};
	},
});
