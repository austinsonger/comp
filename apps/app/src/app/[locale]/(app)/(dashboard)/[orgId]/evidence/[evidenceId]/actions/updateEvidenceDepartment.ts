"use server";

import { z } from "zod";
import { db } from "@comp/db";
import { Departments } from "@comp/db/types";
import { authActionClient } from "@/actions/safe-action";

const schema = z.object({
	id: z.string(),
	department: z
		.enum([...Object.values(Departments)] as [string, ...string[]])
		.nullable(),
});

export const updateEvidenceDepartment = authActionClient
	.schema(schema)
	.metadata({
		name: "Update Evidence Department",
		track: {
			event: "update-evidence-department",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const { id, department } = parsedInput;

		if (!session.activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			const evidence = await db.evidence.findUnique({
				where: { id },
				select: { organizationId: true },
			});

			if (!evidence) {
				return {
					success: false,
					error: "Evidence not found",
				};
			}

			// Verify the user has access to this organization's evidence
			if (evidence.organizationId !== session.activeOrganizationId) {
				return {
					success: false,
					error: "Not authorized to update this evidence",
				};
			}

			// Update the evidence with the new department
			await db.evidence.update({
				where: { id },
				data: {
					department: department as Departments,
				},
			});

			return { success: true };
		} catch (error) {
			console.error("Failed to update evidence department:", error);
			return {
				success: false,
				error: "An unexpected error occurred",
			};
		}
	});
