import type { TemplateControl as Control } from "../types";

export const personnelPolicies: Control = {
	id: "personnel_policies",
	name: "Personnel Policies",
	description:
		"The organization holds individuals accountable for their internal control responsibilities in the pursuit of objectives.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "human_resources_policy",
		},
		{
			type: "evidence",
			evidenceId: "personnel_compliance_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC1",
		},
	],
};
