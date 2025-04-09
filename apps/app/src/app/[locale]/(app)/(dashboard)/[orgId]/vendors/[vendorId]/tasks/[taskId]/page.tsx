"use server";

import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import SecondaryFields from "./components/secondary-fields/secondary-fields";
import Title from "./components/title/title";

interface PageProps {
	params: Promise<{
		locale: string;
		orgId: string;
		taskId: string;
	}>;
}

export default async function TaskPage({ params }: PageProps) {
	const { locale, orgId, taskId } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth/signin");
	}

	// Fetch the task
	const task = await db.task.findUnique({
		where: {
			id: taskId,
			organizationId: orgId,
		},
		include: {
			assignee: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!task) {
		notFound();
	}

	const getAssignees = async () => {
		const assignees = await db.member.findMany({
			where: {
				organizationId: orgId,
				role: {
					notIn: ["employee"],
				},
			},
			include: {
				user: true,
			},
		});

		return assignees;
	};

	const assignees = await getAssignees();

	return (
		<div className="space-y-8">
			<Title task={task} assignees={assignees} />
			<SecondaryFields task={task} assignees={assignees} />
		</div>
	);
}
