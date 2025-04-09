import type { TemplateControl as Control } from "../types";

export const riskAssessmentProcess: Control = {
	id: "risk_assessment_process",
	name: "Risk Assessment Process",
	description:
		"The organization specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "risk_management_policy",
		},
		{
			type: "evidence",
			evidenceId: "risk_assessment_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC3",
		},
	],
};
