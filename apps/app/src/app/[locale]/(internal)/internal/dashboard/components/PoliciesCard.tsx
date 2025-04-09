"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";
import { usePoliciesAnalytics } from "../hooks/usePoliciesAnalytics";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ShieldCheck, TrendingUp, Clock, Calendar } from "lucide-react";
import { Progress } from "@comp/ui/progress";
import { useMemo } from "react";

// Helper function for formatting numbers
function formatNumber(value: number | null | undefined): string {
	if (value == null) return "N/A";
	return value.toLocaleString();
}

// Helper function for formatting percentages
function formatPercentage(value: number | null | undefined): string {
	if (value == null) return "N/A";
	const sign = value >= 0 ? "+" : "";
	return `${sign}${value.toFixed(1)}%`;
}

export function PoliciesCard() {
	const {
		data: policiesData,
		isLoading: isPoliciesLoading,
		isError: isPoliciesError,
	} = usePoliciesAnalytics();

	// Calculate chart data from the API data - use last 30 days daily data
	const chartData = useMemo(() => {
		if (!policiesData?.last30DaysTotalByDay) {
			return [];
		}
		// Ensure data is sorted chronologically if not already guaranteed by API
		return [...policiesData.last30DaysTotalByDay]
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.map((item) => ({
				date: item.date,
				value: item.count,
			}));
	}, [policiesData?.last30DaysTotalByDay]);

	// Calculate published percentage using all-time data
	const policiesPublishedPercent = useMemo(() => {
		if (
			policiesData?.allTimePublished != null &&
			policiesData?.allTimeTotal != null &&
			policiesData.allTimeTotal > 0
		) {
			return (
				(policiesData.allTimePublished / policiesData.allTimeTotal) *
				100
			).toFixed(1);
		}
		return "0.0";
	}, [policiesData?.allTimePublished, policiesData?.allTimeTotal]);

	// Format growth percentage from API data
	const growthPercentFormatted = useMemo(() => {
		return formatPercentage(policiesData?.percentageChangeLast30Days);
	}, [policiesData?.percentageChangeLast30Days]);

	const growthColor = useMemo(() => {
		if (policiesData?.percentageChangeLast30Days == null)
			return "text-gray-400";
		return policiesData.percentageChangeLast30Days >= 0
			? "text-green-400"
			: "text-red-400";
	}, [policiesData?.percentageChangeLast30Days]);

	if (isPoliciesError) {
		return (
			<Card className="bg-[#121212] text-white border-[#333] overflow-hidden rounded-none">
				<CardHeader className="pb-2 flex flex-row items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-1.5 bg-blue-900/50">
							<ShieldCheck className="h-5 w-5 text-blue-400" />
						</div>
						<CardTitle className="text-lg">Policies</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-destructive">Error loading data.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[#121212] text-white border-[#333] overflow-hidden rounded-none">
			<CardHeader className="pb-2 flex flex-row items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-blue-900/50">
						<ShieldCheck className="h-5 w-5 text-blue-400" />
					</div>
					<CardTitle className="text-lg">Policies</CardTitle>
				</div>
				<div className={`flex items-center text-xs ${growthColor} font-medium`}>
					<TrendingUp className="h-3.5 w-3.5 mr-1" />
					{isPoliciesLoading ? (
						<Skeleton className="h-3 w-10" />
					) : (
						growthPercentFormatted
					)}
				</div>
			</CardHeader>
			<CardContent>
				{isPoliciesLoading ? (
					<div className="space-y-4 mt-2">
						<Skeleton className="h-10 w-full" /> {/* Chart Placeholder */}
						{/* Last 30 days Placeholder */}
						<div className="bg-[#1a1a1a] p-3 space-y-2">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</div>
						{/* All Time Placeholder */}
						<div className="space-y-3">
							<Skeleton className="h-4 w-1/4 mb-1" />
							<Skeleton className="h-6 w-full mb-2" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-1.5 w-full mb-1" />
							<Skeleton className="h-3 w-1/2 mb-2" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				) : (
					<>
						<div className="mt-1 mb-4">
							<div className="h-[40px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={chartData}
										margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
									>
										<Line
											type="linear"
											dataKey="value"
											stroke="#3b82f6"
											strokeWidth={2}
											dot={false}
											isAnimationActive={false}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Last 30 Days Section */}
						<div className="bg-[#1a1a1a] p-3 mb-4">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="h-4 w-4 text-gray-400" />
								<span className="text-sm font-medium text-gray-300">
									Last 30 Days
								</span>
							</div>
							<div className="flex justify-between mb-1">
								<span className="text-gray-400 text-sm">New</span>
								<span className="text-sm font-medium">
									{formatNumber(policiesData?.last30DaysTotal)}
								</span>
							</div>
						</div>

						{/* All Time Section */}
						<div className="bg-[#1a1a1a] p-3 mb-4">
							<div className="flex items-center gap-2 mb-2">
								<Calendar className="h-4 w-4 text-gray-400" />
								<span className="text-sm font-medium text-gray-300">
									All Time
								</span>
							</div>
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-gray-400 text-sm">Total</span>
									<span className="text-xl font-bold">
										{formatNumber(policiesData?.allTimeTotal) ?? "N/A"}
									</span>
								</div>
							</div>

							<div>
								<div className="flex justify-between mb-1">
									<span className="text-gray-400 text-sm">Published</span>
									<span className="text-sm font-medium">
										{formatNumber(policiesData?.allTimePublished) ?? "N/A"}
									</span>
								</div>
								<Progress
									value={Number.parseFloat(policiesPublishedPercent)}
									className="h-1.5 bg-gray-800 rounded-none [&>div]:bg-blue-500"
								/>
								<div className="text-xs text-gray-500 mt-1">
									{policiesPublishedPercent}% of total
								</div>
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
