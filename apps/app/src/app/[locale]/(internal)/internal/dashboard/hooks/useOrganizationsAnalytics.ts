"use client";

import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useSearchParams } from "next/navigation";
import { chartConfig } from "../config";

interface OrganizationsAnalyticsData {
	countLast30Days: number;
	count30To60DaysAgo: number;
	changeLast30Days: number;
	allTimeTotal: number;
	byDateLast30Days: Array<{
		date: string; // YYYY-MM-DD format
		count: number;
	}>;
}

const API_ENDPOINT = "/internal/dashboard/api/organizations";

export function useOrganizationsAnalytics() {
	const searchParams = useSearchParams();
	const secret = searchParams.get("secret");

	// Construct the key: null if secret is missing, otherwise the URL with secret
	const key = secret
		? `${API_ENDPOINT}?secret=${encodeURIComponent(secret)}`
		: null;

	const { data, error, isLoading, isValidating } =
		useSWR<OrganizationsAnalyticsData>(
			key, // Use the conditional key
			fetcher,
			{
				refreshInterval: chartConfig.refreshIntervals.organizations,
				revalidateOnFocus: true,
				revalidateOnReconnect: true,
			},
		);

	return {
		data,
		isLoading,
		isError: error,
		isValidating,
	};
}
