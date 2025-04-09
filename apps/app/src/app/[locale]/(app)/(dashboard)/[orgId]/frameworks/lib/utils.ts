import type { OrganizationControlType } from "../[frameworkInstanceId]/components/table/FrameworkControlsTableColumns";
import type { StatusType } from "@/components/frameworks/framework-status";

// Function to determine control status based on artifacts
export function getControlStatus(
	artifacts: OrganizationControlType["artifacts"],
): StatusType {
	if (!artifacts || artifacts.length === 0) return "not_started";

	const totalArtifacts = artifacts.length;
	const completedArtifacts = artifacts.filter((artifact) => {
		switch (artifact.type) {
			case "policy":
				return artifact.policy?.status === "published";
			case "evidence":
				return artifact.evidence?.published === true;
			default:
				return false;
		}
	}).length;

	if (completedArtifacts === 0) return "not_started";
	if (completedArtifacts === totalArtifacts) return "completed";
	return "in_progress";
}
