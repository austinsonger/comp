"use server";

import { db } from "@comp/db";
import { Departments, Frequency } from "@comp/db/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { authActionClient } from "../safe-action";
import { createPolicySchema } from "../schema";

export const createPolicyAction = authActionClient
	.schema(createPolicySchema)
	.metadata({
		name: "create-policy",
		track: {
			event: "create-policy",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { title, description, frameworkIds, controlIds } = parsedInput;
		const { activeOrganizationId } = ctx.session;
		const { user } = ctx;

		if (!activeOrganizationId) {
			return {
				success: false,
				error: "Not authorized",
			};
		}

		if (!user) {
			return {
				success: false,
				error: "Not authorized",
			};
		}

		// Find member id in the organization
		const member = await db.member.findFirst({
			where: {
				userId: user.id,
				organizationId: activeOrganizationId,
			},
		});

		if (!member) {
			return {
				success: false,
				error: "Not authorized",
			};
		}

		try {
			// Create the policy
			const policy = await db.policy.create({
				data: {
					name: title,
					description,
					organizationId: activeOrganizationId,
					assigneeId: member.id,
					department: Departments.none,
					frequency: Frequency.monthly,
					content: [
						{ type: "paragraph", content: [{ type: "text", text: "" }] },
					],
				},
			});

			// Create artifacts for each control
			if (controlIds && controlIds.length > 0) {
				// Create artifacts that link the policy to controls
				await Promise.all(
					controlIds.map(async (controlId) => {
						// Create the artifact
						const artifact = await db.artifact.create({
							data: {
								type: "policy",
								policyId: policy.id,
								organizationId: activeOrganizationId,
							},
						});

						// Connect the artifact to the control
						await db.control.update({
							where: { id: controlId },
							data: {
								artifacts: {
									connect: { id: artifact.id },
								},
							},
						});

						return artifact;
					}),
				);
			}

			revalidatePath(`/${activeOrganizationId}/policies/all`);
			revalidatePath(`/${activeOrganizationId}/policies`);
			revalidateTag("policies");

			return {
				success: true,
				policyId: policy.id,
			};
		} catch (error) {
			console.error(error);

			return {
				success: false,
				error: "Failed to create policy",
			};
		}
	});
