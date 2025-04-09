import type { TemplateControl as Control } from "../types";

export const securityEventCommunication: Control = {
	id: "security_event_communication",
	name: "Security Event Communication",
	description:
		"The organization identifies, develops, and implements activities to communicate security incidents to affected parties.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "incident_response_policy",
		},
		{
			type: "evidence",
			evidenceId: "incident_communication_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC7",
		},
	],
};
