"use client";

import { Badge } from "@comp/ui/badge";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@comp/ui/chart";
import { Skeleton } from "@comp/ui/skeleton";
import { TrendingUp, BarChart2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useOrganizationsAnalytics } from "../hooks/useOrganizationsAnalytics";
import { ValidatingSpinner } from "./ValidatingSpinner";

const chartConfig = {
	organizations: {
		label: "Organizations",
		color: "hsl(151, 100%, 45%)",
	},
} satisfies ChartConfig;

export function OrganizationsCard() {
	const {
		data: orgsData,
		isLoading: isOrgsLoading,
		isError: isOrgsError,
		isValidating: isOrgsValidating,
	} = useOrganizationsAnalytics();

	const chartData = orgsData?.byDateLast30Days ?? [];
	const totalCountLast30Days = orgsData?.countLast30Days ?? 0;
	const trendPercentage = orgsData?.changeLast30Days ?? 0;
	const dateRange = "Last 30 days";

	// Format the total count with thousands separators
	const formattedTotalCount = new Intl.NumberFormat().format(
		totalCountLast30Days,
	);

	if (isOrgsError) {
		return (
			<div className="bg-[#121212] text-white border border-[#333] overflow-hidden">
				<div className="p-6">
					<h3 className="text-lg font-semibold">Organizations</h3>
					<p className="text-sm text-gray-400">
						Daily trend over the last 30 days
					</p>
				</div>
				<div className="px-6 pb-6">
					<p className="text-sm text-destructive">Error loading data.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#121212] text-white border border-[#333] overflow-hidden">
			{/* Header */}
			<div className="p-6 pb-2 flex flex-row items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-green-900/50">
						<BarChart2 className="h-8 w-8 text-green-400" />
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-0">Organizations</h3>
						<p className="text-sm text-gray-400">
							Daily trend over the last 30 days
						</p>
					</div>
				</div>
				<ValidatingSpinner isValidating={isOrgsValidating} />
			</div>

			{/* Chart */}
			<div className="pr-6 py-6">
				{isOrgsLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-[200px] w-full" />
						<Skeleton className="h-4 w-[150px]" />
					</div>
				) : (
					<ChartContainer config={chartConfig} className="h-[200px] w-full">
						<AreaChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 0,
								right: 0,
								top: 5,
								bottom: 5,
							}}
						>
							<YAxis
								domain={["dataMin", "dataMax"]}
								axisLine={false}
								tickLine={true}
								tickCount={6}
								tickFormatter={(value) => value.toFixed(0)}
							/>
							<CartesianGrid vertical={false} stroke="#333" />
							<XAxis
								dataKey="date"
								tickLine={true}
								axisLine={false}
								tickMargin={8}
								stroke="#666"
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString("en-US", {
										month: "2-digit",
										day: "2-digit",
									});
								}}
								tickCount={10}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										indicator="line"
										nameKey="count"
										hideLabel
									/>
								}
							/>
							<Area
								dataKey="count"
								type="linear"
								fill="rgba(16, 185, 129, 0.3)"
								fillOpacity={0.3}
								stroke="rgb(16, 185, 129)"
								strokeWidth={2}
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</div>

			{/* Footer */}
			<div className="px-6 py-6 bg-background border-t border-border">
				{isOrgsLoading ? (
					<Skeleton className="h-12 w-[250px]" />
				) : (
					<div className="flex items-center gap-4">
						<div className="text-5xl font-bold tracking-tight">
							{formattedTotalCount}
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-sm text-gray-400">{dateRange}</div>
							{trendPercentage !== undefined && (
								<Badge
									variant="outline"
									className="bg-transparent border-green-500 text-green-500 px-2 py-0.5 rounded-none"
								>
									<TrendingUp className="mr-1 h-3.5 w-3.5" />
									<span>
										{trendPercentage >= 0 ? "+" : ""}
										{trendPercentage.toFixed(1)}%
									</span>
								</Badge>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
