import type { TemplateControl as Control } from "../types";

export const securityEventAnalysis: Control = {
	id: "security_event_analysis",
	name: "Security Event Analysis",
	description:
		"The organization implements incident response activities to identify root causes of security incidents and develop remediation plans.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "incident_response_policy",
		},
		{
			type: "evidence",
			evidenceId: "incident_analysis_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC7",
		},
	],
};
