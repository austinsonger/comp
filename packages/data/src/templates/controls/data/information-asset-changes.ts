import type { TemplateControl as Control } from "../types";

export const informationAssetChanges: Control = {
	id: "information_asset_changes",
	name: "Information Asset Changes",
	description:
		"The organization manages changes to system components to minimize the risk of unauthorized changes.",
	mappedArtifacts: [
		{
			type: "policy",
			policyId: "change_management_policy",
		},
		{
			type: "evidence",
			evidenceId: "change_management_records",
		},
	],
	mappedRequirements: [
		{
			frameworkId: "soc2",
			requirementId: "CC6",
		},
	],
};
