import type { TemplateControl as Control } from "../types";

export const informationQuality: Control = {
	id: "information_quality",
	name: "Information Quality",
	description:
		"The organization obtains or generates and uses relevant, quality information to support the functioning of internal control.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "information_security_policy",
		},
		{
			type: "evidence",
			evidenceId: "data_quality_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC2",
		},
	],
};
