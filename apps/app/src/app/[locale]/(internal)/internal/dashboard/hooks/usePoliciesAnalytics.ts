"use client";

import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useAnalyticsSWRKeyWithSecret } from "./useAnalyticsSWRKeyWithSecret";
import { chartConfig } from "../config";

interface PoliciesAnalyticsData {
	allTimeTotal: number;
	allTimePublished: number;
	allTimeDraft: number;
	last30DaysTotal: number;
	last30DaysPublished: number;
	last30DaysDraft: number;
	last30DaysTotalByDay: Array<{
		date: string; // YYYY-MM-DD format
		count: number;
	}>;
	percentageChangeLast30Days: number | null;
}

const API_ENDPOINT = "/internal/dashboard/api/policies";

export function usePoliciesAnalytics() {
	const key = useAnalyticsSWRKeyWithSecret(API_ENDPOINT);

	const { data, error, isLoading } = useSWR<PoliciesAnalyticsData>(
		key,
		fetcher,
		{
			refreshInterval: chartConfig.refreshIntervals.policies,
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
