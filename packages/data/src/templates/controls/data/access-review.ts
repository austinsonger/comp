import type { TemplateControl as Control } from "../types";

export const accessReview: Control = {
	id: "access_review",
	name: "Access Review",
	description:
		"The organization evaluates and manages access to protected information assets on a periodic basis.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "access_control_policy",
		},
		{
			type: "evidence",
			evidenceId: "access_review_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
