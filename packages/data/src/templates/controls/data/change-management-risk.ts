import type { TemplateControl as Control } from "../types";

export const changeManagementRisk: Control = {
	id: "change_management_risk",
	name: "Change Management Risk",
	description:
		"The organization identifies and assesses changes that could significantly impact the system of internal control.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "change_management_policy",
		},
		{
			type: "evidence",
			evidenceId: "change_risk_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC3",
		},
	],
};
