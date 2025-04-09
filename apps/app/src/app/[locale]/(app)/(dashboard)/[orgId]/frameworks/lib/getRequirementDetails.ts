import { requirements } from "@comp/data";

export function getRequirementDetails(
	frameworkId: keyof typeof requirements,
	requirementId: string,
) {
	const frameworkRequirements =
		requirements[frameworkId as keyof typeof requirements] || [];

	const requirement =
		frameworkRequirements[requirementId as keyof typeof frameworkRequirements];

	return requirement;
}
