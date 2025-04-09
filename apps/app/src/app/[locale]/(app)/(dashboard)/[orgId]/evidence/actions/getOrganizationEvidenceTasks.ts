"use server";

import { authActionClient } from "@/actions/safe-action";
import { Departments, EvidenceStatus, Frequency } from "@comp/db/types";
import type { Evidence, Prisma } from "@comp/db/types";
import { db } from "@comp/db";

import { z } from "zod";

// Define the response types for better type safety
export interface PaginationMetadata {
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface EvidenceTasksData {
	data: Evidence[];
	pagination: PaginationMetadata;
}

export const getOrganizationEvidenceTasks = authActionClient
	.schema(
		z.object({
			search: z.string().optional().nullable(),
			status: z.nativeEnum(EvidenceStatus).optional().nullable(),
			frequency: z.nativeEnum(Frequency).optional().nullable(),
			department: z.nativeEnum(Departments).optional().nullable(),
			assigneeId: z.string().optional().nullable(),
			page: z.number().int().positive().optional().default(1),
			pageSize: z.number().int().positive().optional().default(10),
		}),
	)
	.metadata({
		name: "getOrganizationEvidenceTasks",
		track: {
			event: "get-organization-evidence-tasks",
			channel: "server",
		},
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		const {
			search,
			status,
			frequency,
			department,
			assigneeId,
			page,
			pageSize,
		} = parsedInput;

		if (!session.activeOrganizationId) {
			console.error("Not authorized - no organization found");
			return {
				success: false,
				error: "Not authorized - no organization found",
			};
		}

		try {
			// Create the where clause for both count and data queries
			const whereClause: Prisma.EvidenceWhereInput = {
				organizationId: session.activeOrganizationId,
				// Status filter - if no status is selected, filter out not_relevant items
				...(status === "published"
					? { status: "published" }
					: status === "draft"
						? { status: "draft" }
						: status === "not_relevant"
							? { status: "not_relevant" }
							: { status: { not: "not_relevant" } }),
				// Frequency filter
				...(frequency ? { frequency } : {}),
				// Department filter
				...(department ? { department } : {}),
				// Assignee filter
				...(assigneeId ? { assigneeId } : {}),
				// Search filter
				...(search
					? {
							OR: [
								{
									name: {
										contains: search,
										mode: "insensitive" as Prisma.QueryMode,
									},
								},
								{
									description: {
										contains: search,
										mode: "insensitive" as Prisma.QueryMode,
									},
								},
							],
						}
					: {}),
			};

			// Get total count for pagination
			const totalCount = await db.evidence.count({
				where: whereClause,
			});

			// Calculate pagination values
			const skip = (page - 1) * pageSize;
			const totalPages = Math.ceil(totalCount / pageSize);

			// Get paginated data
			const evidenceTasks = await db.evidence.findMany({
				where: whereClause,
				include: {
					assignee: {
						select: {
							id: true,
							user: {
								select: {
									name: true,
									email: true,
									image: true,
								},
							},
						},
					},
				},
				skip,
				take: pageSize,
				orderBy: {
					updatedAt: "desc", // Most recently updated first
				},
			});

			return {
				success: true,
				data: {
					data: evidenceTasks,
					pagination: {
						page,
						pageSize,
						totalCount,
						totalPages,
						hasNextPage: page < totalPages,
						hasPreviousPage: page > 1,
					},
				},
			};
		} catch (error) {
			console.error("Error fetching evidence tasks:", error);
			return {
				success: false,
				error: "Failed to fetch evidence tasks",
			};
		}
	});
