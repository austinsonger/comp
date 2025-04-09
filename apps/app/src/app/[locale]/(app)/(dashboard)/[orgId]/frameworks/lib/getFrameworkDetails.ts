import { frameworks } from "@comp/data";
import { FrameworkId } from "@comp/db/types";

export function getFrameworkDetails(frameworkId: FrameworkId) {
	return frameworks[frameworkId as keyof typeof frameworks];
}
