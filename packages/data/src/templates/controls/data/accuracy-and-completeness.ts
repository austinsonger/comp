import type { TemplateControl as Control } from "../types";

export const accuracyAndCompleteness: Control = {
	id: "accuracy_and_completeness",
	name: "Accuracy and Completeness",
	description:
		"The entity ensures data is processed accurately and completely.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "data_validation_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "PI1",
		},
	],
};
