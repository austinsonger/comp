import type { TemplateControl as Control } from "../types";

export const controlMonitoring: Control = {
	id: "control_monitoring",
	name: "Control Monitoring",
	description:
		"The organization selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "control_testing_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC4",
		},
	],
};
