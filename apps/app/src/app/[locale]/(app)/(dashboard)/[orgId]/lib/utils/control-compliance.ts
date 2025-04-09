import type { Artifact, Evidence, Policy } from "@comp/db/types";

/**
 * Checks if a specific artifact is completed based on its type and associated data
 * @param artifact - The artifact to check
 * @returns boolean indicating if the artifact is completed
 */
export function isArtifactCompleted(
	artifact: Artifact & {
		policy: Policy | null;
		evidence: Evidence | null;
	},
): boolean {
	if (!artifact) return false;

	switch (artifact.type) {
		case "policy":
			return artifact.policy?.status === "published";
		case "evidence":
			return artifact.evidence?.published === true;
		case "procedure":
		case "training":
			// For other types, consider them complete if they exist
			return true;
		default:
			return false;
	}
}

/**
 * Determines if a control is compliant based on its artifacts
 * @param artifacts - The control's artifacts
 * @returns boolean indicating if the control is compliant
 */
export function isControlCompliant(
	artifacts: (Artifact & {
		policy: Policy | null;
		evidence: Evidence | null;
	})[],
): boolean {
	// If there are no artifacts, the control is not compliant
	if (!artifacts || artifacts.length === 0) {
		return false;
	}

	const totalArtifacts = artifacts.length;
	const completedArtifacts = artifacts.filter(isArtifactCompleted).length;

	return completedArtifacts === totalArtifacts;
}

/**
 * Calculate control status based on its artifacts
 * @param artifacts - The control's artifacts
 * @returns Control status as "not_started", "in_progress", or "compliant"
 */
export function calculateControlStatus(
	artifacts: (Artifact & {
		policy: Policy | null;
		evidence: Evidence | null;
	})[],
): "not_started" | "in_progress" | "compliant" {
	if (!artifacts || artifacts.length === 0) return "not_started";

	const totalArtifacts = artifacts.length;
	const completedArtifacts = artifacts.filter(isArtifactCompleted).length;

	if (completedArtifacts === 0) return "not_started";
	if (completedArtifacts === totalArtifacts) return "compliant";
	return "in_progress";
}
