import type { TemplateControl as Control } from "../types";

export const confidentialInformationClassification: Control = {
	id: "confidential_information_classification",
	name: "Confidential Information Classification",
	description:
		"The entity classifies information to identify and protect confidential information.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "classification_policy",
		},
		{
			type: "evidence",
			evidenceId: "data_classification_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "C1",
		},
	],
};
