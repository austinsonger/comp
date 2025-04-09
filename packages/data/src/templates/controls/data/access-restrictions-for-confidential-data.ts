import type { TemplateControl as Control } from "../types";

export const accessRestrictionsForConfidentialData: Control = {
	id: "access_restrictions_for_confidential_data",
	name: "Access Restrictions for Confidential Data",
	description:
		"The entity restricts access to confidential information on a need-to-know basis.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "classification_policy",
		},
		{
			type: "evidence",
			evidenceId: "access_logs",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "C1",
		},
	],
};
