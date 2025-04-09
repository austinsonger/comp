import type { TemplateControl as Control } from "../types";

export const confidentialDataDisposal: Control = {
	id: "confidential_data_disposal",
	name: "Confidential Data Disposal",
	description:
		"The entity securely disposes of confidential information when no longer needed.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "classification_policy",
		},
		{
			type: "evidence",
			evidenceId: "disposal_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "C1",
		},
	],
};
