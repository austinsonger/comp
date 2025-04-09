import type { TemplateControl as Control } from "../types";

export const riskIdentification: Control = {
	id: "risk_identification",
	name: "Risk Identification",
	description:
		"The organization identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "risk_management_policy",
		},
		{
			type: "evidence",
			evidenceId: "risk_identification_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC3",
		},
	],
};
