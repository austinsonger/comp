"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import * as React from "react";
import type { CSSProperties } from "react";

// Use correct types from the database
import { TrainingVideo } from "@comp/data";
import {
	EmployeeTrainingVideoCompletion,
	Member,
	Policy,
	User,
} from "@comp/db/types";

interface EmployeeCompletionChartProps {
	employees: (Member & {
		user: User;
	})[];
	policies: Policy[];
	trainingVideos: (EmployeeTrainingVideoCompletion & {
		metadata: TrainingVideo;
	})[];
}

// Define colors for the chart
const taskColors = {
	completed: "bg-primary", // Green/Blue
	incomplete: "bg-[var(--chart-open)]", // Yellow
};

interface EmployeeTaskStats {
	id: string;
	name: string;
	email: string;
	totalTasks: number;
	policiesCompleted: number;
	trainingsCompleted: number;
	policiesTotal: number;
	trainingsTotal: number;
	policyPercentage: number;
	trainingPercentage: number;
	overallPercentage: number;
}

export function EmployeeCompletionChart({
	employees,
	policies,
	trainingVideos,
}: EmployeeCompletionChartProps) {
	const t = useI18n();

	// Calculate completion data for each employee
	const employeeStats: EmployeeTaskStats[] = React.useMemo(() => {
		return employees.map((employee) => {
			// Count policies completed by this employee
			const policiesCompletedCount = policies.filter((policy) =>
				policy.signedBy.includes(employee.id),
			).length;

			// Calculate policy completion percentage
			const policyCompletionPercentage = policies.length
				? Math.round((policiesCompletedCount / policies.length) * 100)
				: 0;

			// Count training videos completed by this employee
			const employeeTrainingVideos = trainingVideos.filter(
				(video) => video.memberId === employee.id && video.completedAt !== null,
			);
			const trainingsCompletedCount = employeeTrainingVideos.length;

			// Get the total unique training videos available
			const uniqueTrainingVideosIds = [
				...new Set(trainingVideos.map((video) => video.metadata.id)),
			];
			const trainingVideosTotal = uniqueTrainingVideosIds.length;

			// Calculate training completion percentage
			const trainingCompletionPercentage = trainingVideosTotal
				? Math.round((trainingsCompletedCount / trainingVideosTotal) * 100)
				: 0;

			// Calculate total completion percentage
			const totalItems = policies.length + trainingVideosTotal;
			const totalCompletedItems =
				policiesCompletedCount + trainingsCompletedCount;

			const overallPercentage = totalItems
				? Math.round((totalCompletedItems / totalItems) * 100)
				: 0;

			return {
				id: employee.id,
				name: employee.user.name || employee.user.email.split("@")[0],
				email: employee.user.email,
				totalTasks: totalItems,
				policiesCompleted: policiesCompletedCount,
				trainingsCompleted: trainingsCompletedCount,
				policiesTotal: policies.length,
				trainingsTotal: trainingVideosTotal,
				policyPercentage: policyCompletionPercentage,
				trainingPercentage: trainingCompletionPercentage,
				overallPercentage,
			};
		});
	}, [employees, policies, trainingVideos]);

	// Check for empty data scenarios
	if (!employees.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("people.dashboard.employee_task_completion")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center h-[300px]">
					<p className="text-center text-sm text-muted-foreground">
						{t("people.dashboard.no_data")}
					</p>
				</CardContent>
			</Card>
		);
	}

	// Check if there are any tasks to complete
	if (policies.length === 0 && !trainingVideos.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("people.dashboard.employee_task_completion")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center h-[300px]">
					<p className="text-center text-sm text-muted-foreground">
						{t("people.dashboard.no_tasks_available")}
					</p>
				</CardContent>
			</Card>
		);
	}

	// Sort by completion percentage and limit to top 5
	const sortedStats = [...employeeStats]
		.sort((a, b) => b.overallPercentage - a.overallPercentage)
		.slice(0, 5);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("people.dashboard.employee_task_completion")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{sortedStats.map((stat) => (
						<div key={stat.id} className="space-y-2">
							<div className="flex justify-between items-center text-sm">
								<p>{stat.name}</p>
								<span className="text-muted-foreground">
									{stat.policiesCompleted + stat.trainingsCompleted} /{" "}
									{stat.totalTasks} {t("common.tasks")}
								</span>
							</div>

							<TaskBarChart stat={stat} />

							<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
								<div className="flex items-center gap-1">
									<div className="size-2 bg-primary" />
									<span>{t("people.dashboard.completed")}</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-2 bg-[var(--chart-open)]" />
									<span>{t("people.dashboard.not_completed")}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function TaskBarChart({ stat }: { stat: EmployeeTaskStats }) {
	const totalCompleted = stat.policiesCompleted + stat.trainingsCompleted;
	const totalIncomplete = stat.totalTasks - totalCompleted;
	const barHeight = 12;

	// Empty chart for no tasks
	if (stat.totalTasks === 0) {
		return <div className="h-3 bg-muted" />;
	}

	return (
		<div
			className="relative h-[var(--height)]"
			style={{ "--height": `${barHeight}px` } as CSSProperties}
		>
			<div className="absolute inset-0 h-full w-full overflow-visible">
				{/* Completed segment */}
				{totalCompleted > 0 && (
					<div
						className="absolute"
						style={{
							width: `${(totalCompleted / stat.totalTasks) * 100}%`,
							height: `${barHeight}px`,
							left: "0%",
						}}
					>
						<div
							className={taskColors.completed}
							style={{
								width: "100%",
								height: "100%",
							}}
							title={`Completed: ${totalCompleted}`}
						/>
					</div>
				)}

				{/* Incomplete segment */}
				{totalIncomplete > 0 && (
					<div
						className="absolute"
						style={{
							width: `${(totalIncomplete / stat.totalTasks) * 100}%`,
							height: `${barHeight}px`,
							left: `${(totalCompleted / stat.totalTasks) * 100}%`,
						}}
					>
						<div
							className={taskColors.incomplete}
							style={{
								width: "100%",
								height: "100%",
							}}
							title={`Incomplete: ${totalIncomplete}`}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
