import { cache } from "react";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { EmployeeCompletionChart } from "./EmployeeCompletionChart";
import { headers } from "next/headers";
import { Member } from "@comp/db/types";
import { trainingVideos as trainingVideosData } from "@comp/data";

export async function EmployeesOverview() {
	const employees = await getEmployees();
	const policies = await getEmployeePolicies();

	const trainingVideos = await getTrainingVideos(employees);

	return (
		<div className="grid gap-6">
			<EmployeeCompletionChart
				employees={employees}
				policies={policies}
				trainingVideos={trainingVideos}
			/>
		</div>
	);
}

const getEmployees = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const employees = await db.member.findMany({
		where: {
			organizationId: orgId,
			role: "employee",
		},
		include: {
			user: true,
		},
	});

	return employees;
});

const getEmployeePolicies = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

	const policies = await db.policy.findMany({
		where: {
			organizationId: orgId,
			isRequiredToSign: true,
		},
	});

	return policies;
});

const getTrainingVideos = cache(async (employees: Member[]) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId || !employees.length) {
		return [];
	}

	// Get all completed training videos for the employees
	const employeeTrainingVideos =
		await db.employeeTrainingVideoCompletion.findMany({
			where: {
				memberId: {
					in: employees.map((employee) => employee.id),
				},
			},
		});

	// Process the videos to include metadata
	const processedVideos = [];

	for (const dbVideo of employeeTrainingVideos) {
		// Find the training video metadata with the matching ID
		const videoMetadata = trainingVideosData.find(
			(metadataVideo) => metadataVideo.id === dbVideo.videoId,
		);

		if (videoMetadata) {
			processedVideos.push({
				...dbVideo,
				metadata: videoMetadata,
			});
		}
	}

	return processedVideos;
});
