import { StatusType } from "@/components/status-policies";
import { useI18n } from "@/locales/client";

/**
 * Interface for the processed assignee data
 */
export interface AssigneeData {
	id: string;
	name: string;
	totalItems: number;
	items: any;
	statusCounts: Record<StatusType, number>;
}

/**
 * Custom hook for assignee evidence data processing
 */
export function useAssigneeData() {
	const t = useI18n();

	/**
	 * Transform raw assignee data into a format suitable for charts
	 */
	const prepareAssigneeData = (
		byAssignee?: Record<string, any[]>,
		unassigned: any[] = [],
	): AssigneeData[] => {
		const assigneeData: AssigneeData[] = [];

		// Process assigned evidence
		if (byAssignee) {
			for (const [assigneeId, items] of Object.entries(byAssignee)) {
				const statusCounts: Record<StatusType, number> = {
					draft: 0,
					published: 0,
					archived: 0,
					needs_review: 0,
					relevant: 0,
					"not-relevant": 0,
				};

				for (const item of items) {
					statusCounts[item.status as StatusType]++;
				}

				assigneeData.push({
					id: assigneeId,
					name: assigneeId || "Unassigned",
					totalItems: items.length,
					items,
					statusCounts,
				});
			}
		}

		// Process unassigned evidence
		if (unassigned.length > 0) {
			const statusCounts: Record<StatusType, number> = {
				draft: 0,
				needs_review: 0,
				relevant: 0,
				"not-relevant": 0,
				published: 0,
				archived: 0,
			};

			for (const item of unassigned) {
				statusCounts[item.status as StatusType]++;
			}

			assigneeData.push({
				id: "unassigned",
				name: "Unassigned",
				totalItems: unassigned.length,
				items: unassigned,
				statusCounts,
			});
		}

		// Sort by count in descending order
		return assigneeData.sort((a, b) => b.totalItems - a.totalItems);
	};

	return {
		prepareAssigneeData,
	};
}
