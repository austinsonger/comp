import type { TemplateControl as Control } from "../types";

export const accessRemoval: Control = {
	id: "access_removal",
	name: "Access Removal",
	description:
		"The organization removes access to protected information assets when appropriate.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "access_control_policy",
		},
		{
			type: "evidence",
			evidenceId: "access_removal_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
