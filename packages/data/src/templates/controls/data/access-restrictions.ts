import type { TemplateControl as Control } from "../types";

export const accessRestrictions: Control = {
	id: "access_restrictions",
	name: "Access Restrictions",
	description:
		"The organization restricts physical access to facilities and protected information assets.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "access_control_policy",
		},
		{
			type: "evidence",
			evidenceId: "physical_access_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
