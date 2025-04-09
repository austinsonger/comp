import type { TemplateControl as Control } from "../types";

export const dataRetentionAndDisposal: Control = {
	id: "data_retention_and_disposal",
	name: "Data Retention and Disposal",
	description:
		"The entity retains personal information for only as long as needed and disposes of it securely.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "privacy_policy",
		},
		{
			type: "evidence",
			evidenceId: "retention_schedules",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "P1",
		},
	],
};
