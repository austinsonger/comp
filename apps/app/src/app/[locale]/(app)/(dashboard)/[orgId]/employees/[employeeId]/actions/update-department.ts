"use server";

import { db } from "@comp/db";
import type { Departments } from "@comp/db/types";
import { authActionClient } from "@/actions/safe-action";
import { revalidatePath } from "next/cache";
import {
	type AppError,
	updateEmployeeDepartmentSchema,
	appErrors,
} from "../types";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export type ActionResponse<T = any> = Promise<
	{ success: true; data: T } | { success: false; error: AppError }
>;

export const updateEmployeeDepartment = authActionClient
	.schema(updateEmployeeDepartmentSchema)
	.metadata({
		name: "update-employee-department",
		track: {
			event: "update-employee-department",
			channel: "server",
		},
	})
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		const { employeeId, department } = parsedInput;

		const session = await auth.api.getSession({
			headers: await headers(),
		});

		const organizationId = session?.session.activeOrganizationId;

		if (!organizationId) {
			return {
				success: false,
				error: appErrors.UNAUTHORIZED,
			};
		}

		try {
			const employee = await db.member.findUnique({
				where: {
					id: employeeId,
					organizationId,
				},
			});

			if (!employee) {
				return {
					success: false,
					error: appErrors.NOT_FOUND,
				};
			}

			const updatedEmployee = await db.member.update({
				where: {
					id: employeeId,
					organizationId,
				},
				data: {
					department: department as Departments,
				},
			});

			// Revalidate related paths
			revalidatePath(`/${organizationId}/employees/${employeeId}`);
			revalidatePath(`/${organizationId}/employees`);

			return {
				success: true,
				data: updatedEmployee,
			};
		} catch (error) {
			console.error("Error updating employee department:", error);
			return {
				success: false,
				error: appErrors.UNEXPECTED_ERROR,
			};
		}
	});
