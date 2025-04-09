import type { TemplateControl as Control } from "../types";

export const accessAuthentication: Control = {
	id: "access_authentication",
	name: "Access Authentication",
	description:
		"Prior to issuing system credentials and granting system access, the organization registers and authorizes new internal and external users.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "access_control_policy",
		},
		{
			type: "evidence",
			evidenceId: "authentication_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
