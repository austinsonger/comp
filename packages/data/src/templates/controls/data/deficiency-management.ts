import type { TemplateControl as Control } from "../types";

export const deficiencyManagement: Control = {
	id: "deficiency_management",
	name: "Deficiency Management",
	description:
		"The organization evaluates and communicates internal control deficiencies in a timely manner to those responsible for taking corrective action, including senior management and the board of directors, as appropriate.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "risk_management_policy",
		},
		{
			type: "evidence",
			evidenceId: "deficiency_management_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC4",
		},
	],
};
