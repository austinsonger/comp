import type { TemplateControl as Control } from "../types";

export const internalCommunication: Control = {
	id: "internal_communication",
	name: "Internal Communication",
	description:
		"The organization internally communicates information, including objectives and responsibilities for internal control.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "corporate_governance_policy",
		},
		{
			type: "evidence",
			evidenceId: "communication_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC2",
		},
	],
};
