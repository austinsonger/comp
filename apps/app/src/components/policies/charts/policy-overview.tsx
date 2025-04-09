"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@comp/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface PolicyOverviewProps {
	data: {
		policies: number;
		draftPolicies: number;
		publishedPolicies: number;
		needsReviewPolicies: number;
	};
}

export function PolicyOverview({ data }: PolicyOverviewProps) {
	const t = useI18n();

	const config: ChartConfig = {
		draft: {
			label: t("policies.status.draft"),
			color: "hsl(var(--chart-1))",
		},
		published: {
			label: t("policies.status.published"),
			color: "hsl(var(--chart-2))",
		},
		review: {
			label: t("policies.status.needs_review"),
			color: "hsl(var(--chart-3))",
		},
	};

	const chartData = [
		{
			name: config.draft.label,
			value: data.draftPolicies,
			status: "draft",
		},
		{
			name: config.published.label,
			value: data.publishedPolicies,
			status: "published",
		},
		{
			name: config.review.label,
			value: data.needsReviewPolicies,
			status: "review",
		},
	].filter((item) => item.value > 0);

	if (chartData.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t("policies.dashboard.policy_status")}</CardTitle>
				</CardHeader>
				<CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
					No data
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("policies.dashboard.policy_status")}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<PieChart
						margin={{
							top: 20,
							right: 80,
							bottom: 20,
							left: 80,
						}}
						width={400}
						height={300}
					>
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={50}
							outerRadius={70}
							paddingAngle={4}
							label={({ name, value, x, y, cx, cy }) => (
								<text
									x={x}
									y={y}
									dy={y > cy ? 15 : -5}
									fill="currentColor"
									textAnchor={x > cx ? "start" : "end"}
									className="text-xs"
									dx={x > cx ? 5 : -5}
								>
									{`${name}: ${value}`}
								</text>
							)}
							labelLine={{
								strokeWidth: 1,
							}}
						>
							{chartData.map((entry) => (
								<Cell
									key={entry.status}
									fill={config[entry.status as keyof typeof config].color}
									radius={8}
								/>
							))}
						</Pie>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
