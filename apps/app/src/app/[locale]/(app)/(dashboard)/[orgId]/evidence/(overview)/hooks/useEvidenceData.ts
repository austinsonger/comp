import { useI18n } from "@/locales/client";
import type { Departments } from "@prisma/client";
import { DEPARTMENT_NAMES } from "../constants/departments";
import { StatusType } from "@/components/status-policies";

/**
 * Interface for the processed department data
 */
export interface DepartmentData {
	id: Departments;
	name: string;
	totalItems: number;
	statusCounts: Record<StatusType, number>;
}

/**
 * Custom hook for evidence data processing and translations
 */
export function useEvidenceData() {
	const t = useI18n();

	/**
	 * Transform raw department data into a format suitable for charts
	 */
	const prepareDepartmentData = (
		byDepartment: Record<Departments, any[]>,
	): DepartmentData[] => {
		return Object.entries(byDepartment)
			.filter(([_, items]) => items.length > 0)
			.map(([dept, items]) => {
				const department = dept as Departments;
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

				// Use predefined display name or fallback to department value
				const name = DEPARTMENT_NAMES[department] || department;

				return {
					id: department,
					name,
					totalItems: items.length,
					statusCounts,
				};
			})
			.sort((a, b) => b.totalItems - a.totalItems);
	};

	return {
		prepareDepartmentData,
	};
}
