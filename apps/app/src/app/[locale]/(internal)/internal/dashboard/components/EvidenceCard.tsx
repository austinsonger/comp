"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Progress } from "@comp/ui/progress";
import { Skeleton } from "@comp/ui/skeleton";
import { Calendar, Clock, FileText, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useEvidenceAnalytics } from "../hooks/useEvidenceAnalytics";

// Helper function for formatting numbers (assuming it exists or can be added)
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

export function EvidenceCard() {
	const {
		data: evidenceData,
		isLoading: isEvidenceLoading,
		isError: isEvidenceError,
	} = useEvidenceAnalytics();

	// Calculate chart data from the API data - use last 30 days daily data
	const chartData = useMemo(() => {
		if (!evidenceData?.last30DaysTotalByDay) {
			return [];
		}
		// Ensure data is sorted chronologically if not already guaranteed by API
		return [...evidenceData.last30DaysTotalByDay]
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.map((item) => ({
				date: item.date,
				value: item.count,
			}));
	}, [evidenceData?.last30DaysTotalByDay]);

	// Calculate published percentage using all-time data
	const evidencePublishedPercent = useMemo(() => {
		if (
			evidenceData?.allTimePublished != null &&
			evidenceData?.allTimeTotal != null &&
			evidenceData.allTimeTotal > 0
		) {
			return (
				(evidenceData.allTimePublished / evidenceData.allTimeTotal) *
				100
			).toFixed(1);
		}
		return "0.0";
	}, [evidenceData?.allTimePublished, evidenceData?.allTimeTotal]);

	// Format growth percentage from API data
	const growthPercentFormatted = useMemo(() => {
		return formatPercentage(evidenceData?.percentageChangeLast30Days);
	}, [evidenceData?.percentageChangeLast30Days]);

	const growthColor = useMemo(() => {
		if (evidenceData?.percentageChangeLast30Days == null)
			return "text-gray-400";
		return evidenceData.percentageChangeLast30Days >= 0
			? "text-green-400"
			: "text-red-400";
	}, [evidenceData?.percentageChangeLast30Days]);

	if (isEvidenceError) {
		return (
			<Card className="bg-[#121212] text-white border-[#333] overflow-hidden rounded-none">
				<CardHeader className="pb-2 flex flex-row items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-1.5 bg-purple-900/50">
							<FileText className="h-5 w-5 text-purple-400" />
						</div>
						<CardTitle className="text-lg">Evidence</CardTitle>
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
					<div className="p-1.5 bg-purple-900/50">
						<FileText className="h-5 w-5 text-purple-400" />
					</div>
					<CardTitle className="text-lg">Evidence</CardTitle>
				</div>
				<div className={`flex items-center text-xs ${growthColor} font-medium`}>
					<TrendingUp className="h-3.5 w-3.5 mr-1" />
					{isEvidenceLoading ? (
						<Skeleton className="h-3 w-10" />
					) : (
						growthPercentFormatted
					)}
				</div>
			</CardHeader>
			<CardContent>
				{isEvidenceLoading ? (
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
									<AreaChart
										data={chartData}
										margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
									>
										<defs>
											<linearGradient
												id="evidenceGradient"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#9333ea"
													stopOpacity={0.3}
												/>
												<stop
													offset="95%"
													stopColor="#9333ea"
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<Area
											type="linear"
											dataKey="value"
											stroke="#9333ea"
											strokeWidth={2}
											fill="url(#evidenceGradient)"
											isAnimationActive={false}
										/>
									</AreaChart>
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
									{formatNumber(evidenceData?.last30DaysTotal)}
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
										{formatNumber(evidenceData?.allTimeTotal) ?? "N/A"}
									</span>
								</div>
							</div>

							<div>
								<div className="flex justify-between mb-1">
									<span className="text-gray-400 text-sm">Published</span>
									<span className="text-sm font-medium">
										{formatNumber(evidenceData?.allTimePublished) ?? "N/A"}
									</span>
								</div>
								<Progress
									value={Number.parseFloat(evidencePublishedPercent)}
									className="h-1.5 bg-gray-800 rounded-none [&>div]:bg-purple-500"
								/>
								<div className="text-xs text-gray-500 mt-1">
									{evidencePublishedPercent}% of total
								</div>
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
