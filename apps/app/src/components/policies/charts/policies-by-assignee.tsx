import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import { PolicyStatus } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import type { CSSProperties } from "react";

interface Props {
	organizationId: string;
}

interface UserPolicyStats {
	user: {
		id: string;
		name: string | null;
		image: string | null;
	};
	totalPolicies: number;
	publishedPolicies: number;
	draftPolicies: number;
	archivedPolicies: number;
	needsReviewPolicies: number;
}

const policyStatus = {
	published: "bg-primary",
	draft: "bg-[var(--chart-open)]",
	archived: "bg-[var(--chart-pending)]",
	needs_review: "bg-[hsl(var(--destructive))]",
} as const;

export async function PoliciesByAssignee({ organizationId }: Props) {
	const t = await getI18n();
	const [userStats, policies] = await Promise.all([
		userData(organizationId),
		policiesByUser(organizationId),
	]);

	const stats: UserPolicyStats[] = userStats.map((user) => {
		const userPolicies = policies.filter(
			(policy) => policy.assigneeId === user.id,
		);

		return {
			user: {
				id: user.id,
				name: user.name,
				image: user.image,
			},
			totalPolicies: userPolicies.length,
			publishedPolicies: userPolicies.filter(
				(policy) => policy.status === PolicyStatus.published,
			).length,
			draftPolicies: userPolicies.filter(
				(policy) => policy.status === PolicyStatus.draft,
			).length,
			archivedPolicies: userPolicies.filter((policy) => policy.isArchived)
				.length,
			needsReviewPolicies: userPolicies.filter(
				(policy) => policy.status === PolicyStatus.needs_review,
			).length,
		};
	});

	stats.sort((a, b) => b.totalPolicies - a.totalPolicies);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("policies.dashboard.policies_by_assignee")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{stats.map((stat) => (
						<div key={stat.user.id} className="space-y-2">
							<div className="flex justify-between items-center">
								<p className="text-sm">{stat.user.name || "Unknown User"}</p>
								<span className="text-sm text-muted-foreground">
									{stat.totalPolicies} {t("policies.policies")}
								</span>
							</div>

							<RiskBarChart stat={stat} t={t} />

							<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
								<div className="flex items-center gap-1">
									<div className="size-2 bg-primary" />
									<span>
										{t("common.status.published")} ({stat.publishedPolicies})
									</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-2 bg-[var(--chart-open)]" />
									<span>
										{t("common.status.draft")} ({stat.draftPolicies})
									</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-2 bg-[var(--chart-pending)]" />
									<span>
										{t("common.status.archived")} ({stat.archivedPolicies})
									</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-2 bg-[hsl(var(--destructive))]" />
									<span>
										{t("common.status.needs_review")} (
										{stat.needsReviewPolicies})
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function RiskBarChart({ stat, t }: { stat: UserPolicyStats; t: any }) {
	const data = [
		...(stat.publishedPolicies && stat.publishedPolicies > 0
			? [
					{
						key: "published",
						value: stat.publishedPolicies,
						color: policyStatus.published,
						label: t("common.status.published"),
					},
				]
			: []),
		...(stat.draftPolicies && stat.draftPolicies > 0
			? [
					{
						key: "draft",
						value: stat.draftPolicies,
						color: policyStatus.draft,
						label: t("common.status.draft"),
					},
				]
			: []),
		...(stat.archivedPolicies && stat.archivedPolicies > 0
			? [
					{
						key: "archived",
						value: stat.archivedPolicies,
						color: policyStatus.archived,
						label: t("common.status.archived"),
					},
				]
			: []),
	];

	const gap = 0.3;
	const totalValue = stat.totalPolicies;
	const barHeight = 12;
	const totalWidth = totalValue + gap * (data.length - 1);
	let cumulativeWidth = 0;
	const cornerRadius = 0;

	if (totalValue === 0) {
		return <div className="h-3 bg-muted" />;
	}

	return (
		<div
			className="relative h-[var(--height)]"
			style={
				{
					"--marginTop": "0px",
					"--marginRight": "0px",
					"--marginBottom": "0px",
					"--marginLeft": "0px",
					"--height": `${barHeight}px`,
				} as CSSProperties
			}
		>
			<div
				className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
			>
				{data.map((d, index) => {
					const barWidth = (d.value / totalWidth) * 100;
					const xPosition = cumulativeWidth;
					cumulativeWidth += barWidth + gap;

					return (
						<div
							key={d.key}
							className="relative"
							style={{
								width: `${barWidth}%`,
								height: `${barHeight}px`,
								left: `${xPosition}%`,
								position: "absolute",
							}}
						>
							<div
								className={`bg-gradient-to-b ${d.color}`}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: `${cornerRadius}px`,
								}}
								title={`${d.label}: ${d.value}`}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

const policiesByUser = async (organizationId: string) => {
	return await db.policy.findMany({
		where: {
			organizationId,
		},
		select: {
			assigneeId: true,
			status: true,
			isArchived: true,
		},
	});
};

const userData = async (organizationId: string) => {
	return await db.user.findMany({
		where: {
			members: {
				some: {
					organizationId,
				},
			},
		},
		select: {
			id: true,
			name: true,
			image: true,
		},
	});
};
