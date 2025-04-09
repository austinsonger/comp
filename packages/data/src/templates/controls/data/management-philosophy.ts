import type { TemplateControl as Control } from "../types";

export const managementPhilosophy: Control = {
	id: "management_philosophy",
	name: "Management Philosophy",
	description:
		"Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "corporate_governance_policy",
		},
		{
			type: "evidence",
			evidenceId: "management_structure_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC1",
		},
	],
};
