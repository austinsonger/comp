"use client";

import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useSearchParams } from "next/navigation";
import { chartConfig } from "../config";

interface UsersAnalyticsData {
	allTimeTotal: number;
	last30DaysTotal: number;
	last30DaysByDay: Array<{
		date: string; // YYYY-MM-DD format
		count: number;
	}>;
	activeSessionTotal: number;
	percentageChangeLast30Days: number | null;
}

const API_ENDPOINT = "/internal/dashboard/api/users";

export function useUsersAnalytics() {
	const searchParams = useSearchParams();
	const secret = searchParams.get("secret");

	// Construct the key: null if secret is missing, otherwise the URL with secret
	const key = secret
		? `${API_ENDPOINT}?secret=${encodeURIComponent(secret)}`
		: null;

	const { data, error, isLoading } = useSWR<UsersAnalyticsData>(
		key, // Use the conditional key
		fetcher,
		{
			refreshInterval: chartConfig.refreshIntervals.users,
			revalidateOnFocus: true,
			revalidateOnReconnect: true,
		},
	);

	return {
		data,
		isLoading,
		isError: error,
	};
}
