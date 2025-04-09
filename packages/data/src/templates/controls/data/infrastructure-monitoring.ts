import type { TemplateControl as Control } from "../types";

export const infrastructureMonitoring: Control = {
	id: "infrastructure_monitoring",
	name: "Infrastructure Monitoring",
	description:
		"To detect and act upon security events in a timely manner, the organization monitors system capacity, security threats, and vulnerabilities.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "infrastructure_monitoring_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC7",
		},
	],
};
