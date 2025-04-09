"use client";

import useSWR from "swr";
import { getOrganizationEvidenceTasks } from "../actions/getOrganizationEvidenceTasks";
import type { PaginationMetadata } from "../actions/getOrganizationEvidenceTasks";
import type {
	Frequency,
	Evidence,
	Departments,
	EvidenceStatus,
} from "@comp/db/types";

// Define the props interface with clear types
interface UseOrganizationEvidenceTasksProps {
	search?: string | null;
	status?: EvidenceStatus | null;
	frequency?: Frequency | null;
	department?: Departments | null;
	assigneeId?: string | null;
	page?: number;
	pageSize?: number;
}

// Define the hook result type
interface UseOrganizationEvidenceTasksResult {
	data: Evidence[] | undefined;
	pagination: PaginationMetadata | undefined;
	isLoading: boolean;
	error: Error | undefined;
	mutate: () => void;
}

async function fetchEvidenceTasks(props: UseOrganizationEvidenceTasksProps) {
	await new Promise((resolve) => setTimeout(resolve, 1));

	try {
		const result = await getOrganizationEvidenceTasks(props);

		if (!result) {
			throw new Error("No result received");
		}

		if (result.serverError) {
			throw new Error(result.serverError);
		}

		if (result.validationErrors) {
			throw new Error(
				result.validationErrors._errors?.join(", ") ?? "Unknown error",
			);
		}

		// Log the result to help debug
		console.log("Evidence tasks result:", result);

		// Return the data property from the result
		return result.data?.data;
	} catch (error) {
		console.error("Error fetching evidence tasks:", error);
		throw error;
	}
}

export function useOrganizationEvidenceTasks(
	props: UseOrganizationEvidenceTasksProps = {},
): UseOrganizationEvidenceTasksResult {
	const {
		search,
		status,
		frequency,
		department,
		assigneeId,
		page = 1,
		pageSize = 10,
	} = props;

	const { data, error, isLoading, mutate } = useSWR(
		[
			"organization-evidence-tasks",
			search,
			status,
			frequency,
			department,
			assigneeId,
			page,
			pageSize,
		],
		() =>
			fetchEvidenceTasks({
				search,
				status,
				frequency,
				department,
				assigneeId,
				page,
				pageSize,
			}),
	);

	return {
		data: data?.data ?? [],
		pagination: data?.pagination,
		isLoading,
		error,
		mutate,
	};
}
