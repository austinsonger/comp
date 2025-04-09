import type { TemplateControl as Control } from "../types";

export const boardOversight: Control = {
	id: "board_oversight",
	name: "Board Oversight",
	description:
		"The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "corporate_governance_policy",
		},
		{
			type: "evidence",
			evidenceId: "board_meeting_documentation",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "A1",
		},
	],
};
