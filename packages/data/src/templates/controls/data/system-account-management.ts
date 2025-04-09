import type { TemplateControl as Control } from "../types";

export const systemAccountManagement: Control = {
	id: "system_account_management",
	name: "System Account Management",
	description:
		"The organization identifies and authenticates system users, devices, and other systems before allowing access.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "access_control_policy",
		},
		{
			type: "evidence",
			evidenceId: "account_management_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
