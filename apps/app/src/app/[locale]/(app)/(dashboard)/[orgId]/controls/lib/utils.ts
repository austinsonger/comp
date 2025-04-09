import type { Control } from "@comp/db/types";
import type { StatusType } from "@/components/frameworks/framework-status";

export function getControlStatus(
	control: Control & {
		artifacts: {
			policy: { status: string } | null;
			evidence: { published: boolean } | null;
		}[];
	},
): StatusType {
	if (!control.artifacts.length) {
		return "not_started";
	}

	const hasUnpublishedArtifacts = control.artifacts.some(
		(artifact) =>
			(artifact.policy && artifact.policy.status !== "published") ||
			(artifact.evidence && !artifact.evidence.published),
	);

	if (hasUnpublishedArtifacts) {
		return "in_progress";
	}

	return "completed";
}
