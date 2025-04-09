import type { TemplateControl as Control } from "../types";

export const maliciousSoftwarePrevention: Control = {
	id: "malicious_software_prevention",
	name: "Malicious Software Prevention",
	description:
		"The organization implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "malware_prevention_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
