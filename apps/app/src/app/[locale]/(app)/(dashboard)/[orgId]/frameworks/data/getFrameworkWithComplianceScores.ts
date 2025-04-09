"use server";

import type { Artifact, Evidence, Policy } from "@comp/db/types";
import { FrameworkInstanceWithControls } from "../types";
import { FrameworkInstanceWithComplianceScore } from "../components/types";

/**
 * Checks if a control is compliant based on its artifacts
 * @param artifacts - The artifacts to check
 * @returns boolean indicating if all artifacts are compliant
 */
const isControlCompliant = (
	artifacts: (Artifact & {
		policy: Policy | null;
		evidence: Evidence | null;
	})[],
) => {
	// If there are no artifacts, the control is not compliant
	if (!artifacts || artifacts.length === 0) {
		return false;
	}

	const totalArtifacts = artifacts.length;
	const completedArtifacts = artifacts.filter((artifact) => {
		if (!artifact) return false;

		switch (artifact.type) {
			case "policy":
				return artifact.policy?.status === "published";
			case "evidence":
				return artifact.evidence?.published === true;
			case "procedure":
			case "training":
				// For other types, check if there's an associated artifact at all
				return true;
			default:
				return false;
		}
	}).length;

	return completedArtifacts === totalArtifacts;
};

/**
 * Gets all framework instances for an organization with compliance calculations
 * @param organizationId - The ID of the organization
 * @returns Array of frameworks with compliance percentages
 */
export async function getFrameworkWithComplianceScores({
	frameworksWithControls,
}: {
	frameworksWithControls: FrameworkInstanceWithControls[];
}): Promise<FrameworkInstanceWithComplianceScore[]> {
	// Get all framework instances for the organization

	// Calculate compliance for each framework
	const frameworksWithComplianceScores = frameworksWithControls.map(
		(frameworkInstance) => {
			// Get all controls for this framework
			const controls = frameworkInstance.controls;

			// Calculate compliance percentage
			const totalControls = controls.length;
			const compliantControls = controls.filter((control) =>
				isControlCompliant(control.artifacts),
			).length;

			const compliance =
				totalControls > 0
					? Math.round((compliantControls / totalControls) * 100)
					: 0;

			return {
				frameworkInstance,
				complianceScore: compliance,
			};
		},
	);

	return frameworksWithComplianceScores;
}
