"use client";

import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useAnalyticsSWRKeyWithSecret } from "./useAnalyticsSWRKeyWithSecret";
import { chartConfig } from "../config";

interface EvidenceAnalyticsData {
	allTimeTotal: number;
	allTimePublished: number;
	allTimeDraft: number;
	allTimeNotRelevant: number;
	last30DaysTotal: number;
	last30DaysPublished: number;
	last30DaysDraft: number;
	last30DaysNotRelevant: number;
	last30DaysTotalByDay: Array<{
		date: string;
		count: number;
	}>;
	percentageChangeLast30Days: number | null;
}

const API_ENDPOINT = "/internal/dashboard/api/evidence";

export function useEvidenceAnalytics() {
	const key = useAnalyticsSWRKeyWithSecret(API_ENDPOINT);

	const { data, error, isLoading } = useSWR<EvidenceAnalyticsData>(
		key,
		fetcher,
		{
			refreshInterval: chartConfig.refreshIntervals.evidence,
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
