import type { TemplateControl as Control } from "../types";

export const choiceAndConsent: Control = {
	id: "choice_and_consent",
	name: "Choice and Consent",
	description:
		"The entity obtains consent for personal information where required by policy or law.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "privacy_policy",
		},
		{
			type: "evidence",
			evidenceId: "consent_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "P1",
		},
	],
};
