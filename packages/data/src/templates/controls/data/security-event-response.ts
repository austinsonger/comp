import type { TemplateControl as Control } from "../types";

export const securityEventResponse: Control = {
	id: "security_event_response",
	name: "Security Event Response",
	description:
		"The organization designs, develops, and implements policies and procedures to respond to security incidents and breaches.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "incident_response_policy",
		},
		{
			type: "evidence",
			evidenceId: "incident_response_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC7",
		},
	],
};
