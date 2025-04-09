import type { TemplateControl as Control } from "../types";

export const fraudRiskAssessment: Control = {
	id: "fraud_risk_assessment",
	name: "Fraud Risk Assessment",
	description:
		"The organization considers the potential for fraud in assessing risks to the achievement of objectives.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "risk_management_policy",
		},
		{
			type: "evidence",
			evidenceId: "fraud_risk_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC3",
		},
	],
};
