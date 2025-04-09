import type { TemplateControl as Control } from "../types";

export const policyImplementation: Control = {
	id: "policy_implementation",
	name: "Policy Implementation",
	description:
		"The organization selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "corporate_governance_policy",
		},
		{
			type: "evidence",
			evidenceId: "policy_implementation_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC5",
		},
	],
};
