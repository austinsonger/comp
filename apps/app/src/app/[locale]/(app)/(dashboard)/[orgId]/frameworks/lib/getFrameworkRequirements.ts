import { requirements } from "@comp/data";

export function getFrameworkRequirements(
	frameworkId: keyof typeof requirements,
) {
	return requirements[frameworkId as keyof typeof requirements] || [];
}
