import type { TemplateControl as Control } from "../types";

export const externalCommunication: Control = {
	id: "external_communication",
	name: "External Communication",
	description:
		"The organization communicates with external parties regarding matters affecting the functioning of internal control.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "corporate_governance_policy",
		},
		{
			type: "evidence",
			evidenceId: "external_communication_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC2",
		},
	],
};
