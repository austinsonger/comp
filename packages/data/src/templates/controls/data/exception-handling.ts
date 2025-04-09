import type { TemplateControl as Control } from "../types";

export const exceptionHandling: Control = {
	id: "exception_handling",
	name: "Exception Handling",
	description:
		"The entity identifies and resolves processing exceptions in a timely manner.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "exception_logs",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "PI1",
		},
	],
};
