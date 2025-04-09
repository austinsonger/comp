import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";
import { EvidenceDetails } from "./components/EvidenceDetails";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
interface EvidencePageProps {
	params: Promise<{
		evidenceId: string;
		orgId: string;
	}>;
}

export default async function EvidencePage({ params }: EvidencePageProps) {
	const { evidenceId, orgId } = await params;

	const assignees = await getAssignees();
	const evidence = await getEvidence(evidenceId);

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{ label: "Evidence", href: `/${orgId}/evidence/all` },
				{ label: evidence.name, current: true },
			]}
		>
			<EvidenceDetails assignees={assignees} evidence={evidence} />
		</PageWithBreadcrumb>
	);
}

const getAssignees = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	if (!orgId) {
		return [];
	}

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

const getEvidence = async (id: string) => {
	const evidence = await db.evidence.findUnique({
		where: {
			id,
		},
		include: {
			assignee: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!evidence) {
		throw new Error("Evidence not found");
	}

	return evidence;
};
