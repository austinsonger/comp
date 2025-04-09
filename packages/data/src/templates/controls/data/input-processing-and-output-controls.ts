import type { TemplateControl as Control } from "../types";

export const inputProcessingAndOutputControls: Control = {
	id: "input_processing_and_output_controls",
	name: "Input, Processing, and Output Controls",
	description:
		"The entity validates the completeness and accuracy of data throughout processing.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "data_processing_logs",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "PI1",
		},
	],
};
