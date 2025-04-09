import type {
	Departments,
	Evidence,
	EvidenceStatus,
	Member,
	User,
	Frequency,
} from "@comp/db/types";
import { db } from "@comp/db";
import { cache } from "react";

// Only define the dashboard-specific status which isn't in DB
type DashboardStatus = "empty" | "draft" | "needsReview" | "upToDate";

// Extend the Evidence type with only what's needed for the dashboard
interface EvidenceWithStatus extends Omit<Evidence, "status"> {
	status: DashboardStatus;
	assigneeEmail?: string;
	dbStatus?: EvidenceStatus | null;
}

export interface EvidenceDashboardData {
	byDepartment: Record<Departments, EvidenceWithStatus[]>;
	byAssignee: Record<string, EvidenceWithStatus[]>;
	byFramework: Record<string, EvidenceWithStatus[]>;
	unassigned: EvidenceWithStatus[];
	statusCounts: {
		totalCount: number;
		emptyCount: number;
		draftCount: number;
		needsReviewCount: number;
		upToDateCount: number;
	};
}

/**
 * Get the evidence dashboard data for a given organization
 * @param organizationId - The ID of the organization to get the evidence for
 * @returns The evidence dashboard data for the given organization
 */
export const getEvidenceDashboard = cache(
	async (organizationId: string): Promise<EvidenceDashboardData | null> => {
		const evidence = await db.evidence.findMany({
			where: {
				organizationId,
			},
			include: {
				assignee: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!evidence) {
			return null;
		}

		// Calculate status for each evidence item
		const now = new Date();
		let emptyCount = 0;
		let draftCount = 0;
		let needsReviewCount = 0;
		let upToDateCount = 0;
		const totalCount = evidence.length;

		const evidenceWithStatus: EvidenceWithStatus[] = evidence.map((item) => {
			// Check if task has files or links
			const hasContent =
				item.fileUrls.length > 0 || item.additionalUrls.length > 0;

			// Check if task is published
			const isPublished = item.published;

			// Check if task needs review (published and next review date is in the past)
			let nextReviewDate = null;

			if (item.lastPublishedAt && item.frequency) {
				// Calculate next review date based on last published date and frequency
				const lastPublished = new Date(item.lastPublishedAt);
				nextReviewDate = new Date(lastPublished);

				switch (item.frequency) {
					case "monthly":
						nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
						break;
					case "quarterly":
						nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
						break;
					case "yearly":
						nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
						break;
				}
			}

			const isPastDue = nextReviewDate && nextReviewDate < now;

			let status: DashboardStatus;

			if (!hasContent && !isPublished) {
				// No files or links
				status = "empty";
				emptyCount++;
			} else if (!isPublished) {
				// Has content but not published
				status = "draft";
				draftCount++;
			} else if (isPastDue) {
				// Published but needs review
				status = "needsReview";
				needsReviewCount++;
			} else {
				// Published and up to date
				status = "upToDate";
				upToDateCount++;
			}

			// Extract assignee email if available
			const assigneeEmail = item.assignee?.user?.email || undefined;

			return {
				...item,
				status,
				assigneeEmail,
				dbStatus: item.status,
			};
		});

		// Initialize with all department values from the enum
		const departmentValues: Departments[] = [
			"none",
			"admin",
			"gov",
			"hr",
			"it",
			"itsm",
			"qms",
		];

		// Initialize the byDepartment object with empty arrays for all departments
		const initialByDepartment = departmentValues.reduce<
			Record<Departments, EvidenceWithStatus[]>
		>(
			(acc, dept) => {
				acc[dept] = [];
				return acc;
			},
			{} as Record<Departments, EvidenceWithStatus[]>,
		);

		// Group evidence by department
		const byDepartment = evidenceWithStatus.reduce<
			Record<Departments, EvidenceWithStatus[]>
		>((acc, curr) => {
			// Use the department from the evidence, or default to 'none' if it's null/undefined
			const department = curr.department || "none";

			// Add the evidence to the appropriate department array
			acc[department].push(curr);
			return acc;
		}, initialByDepartment);

		// Collect unassigned evidence
		const unassigned = evidenceWithStatus.filter((item) => !item.assigneeId);

		// Group evidence by assignee
		const byAssignee = evidenceWithStatus.reduce<
			Record<string, EvidenceWithStatus[]>
		>((acc, curr) => {
			if (!curr.assigneeId || !curr.assigneeEmail) {
				return acc;
			}

			const email = curr.assigneeEmail;
			if (!acc[email]) {
				acc[email] = [];
			}
			acc[email].push(curr);
			return acc;
		}, {});

		// Sample the first assignee's data
		const firstAssigneeEmail = Object.keys(byAssignee)[0];
		if (firstAssigneeEmail) {
			const firstAssigneeItems = byAssignee[firstAssigneeEmail];
			// Count items by status for the first assignee
			const statusCounts: Record<DashboardStatus, number> = {
				empty: 0,
				draft: 0,
				needsReview: 0,
				upToDate: 0,
			};

			for (const item of firstAssigneeItems) {
				statusCounts[item.status]++;
			}
		}

		// Get all artifacts linking evidence to controls
		const artifacts = await db.artifact.findMany({
			where: {
				evidenceId: {
					in: evidence.map((item) => item.id),
				},
			},
			include: {
				controls: {
					include: {
						frameworkInstances: true,
					},
				},
			},
		});

		// Create a mapping of evidence ID to frameworks
		const evidenceToFrameworkMap = new Map<string, Set<string>>();

		// Populate the map based on the artifact relationships
		for (const artifact of artifacts) {
			if (!artifact.evidenceId) continue;

			// For each control linked to this artifact
			for (const control of artifact.controls) {
				// Handle the many-to-many relationship between controls and framework instances
				if (
					!control.frameworkInstances ||
					control.frameworkInstances.length === 0
				)
					continue;

				// Iterate through all framework instances associated with this control
				for (const frameworkInstance of control.frameworkInstances) {
					const frameworkId = frameworkInstance.frameworkId;

					if (!frameworkId) continue;

					// Add the framework ID to the set for this evidence
					if (!evidenceToFrameworkMap.has(artifact.evidenceId)) {
						evidenceToFrameworkMap.set(artifact.evidenceId, new Set<string>());
					}

					evidenceToFrameworkMap.get(artifact.evidenceId)?.add(frameworkId);
				}
			}
		}

		// Group evidence by framework using the mapping we created
		const byFramework = evidenceWithStatus.reduce<
			Record<string, EvidenceWithStatus[]>
		>((acc, curr) => {
			// Get the frameworks for this evidence
			const frameworkIds = evidenceToFrameworkMap.get(curr.id);

			if (!frameworkIds || frameworkIds.size === 0) {
				// If no frameworks, add to an "unassigned" framework
				if (!acc.unassigned) {
					acc.unassigned = [];
				}
				acc.unassigned.push(curr);
				return acc;
			}

			// Add the evidence to each framework it belongs to
			for (const frameworkId of frameworkIds) {
				if (!acc[frameworkId]) {
					acc[frameworkId] = [];
				}
				acc[frameworkId].push(curr);
			}

			return acc;
		}, {});

		return {
			byDepartment,
			byAssignee,
			byFramework,
			unassigned,
			statusCounts: {
				totalCount,
				emptyCount,
				draftCount,
				needsReviewCount,
				upToDateCount,
			},
		};
	},
);
