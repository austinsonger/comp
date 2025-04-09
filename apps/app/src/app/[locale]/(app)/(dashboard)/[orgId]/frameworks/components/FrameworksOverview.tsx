import { getFrameworkWithComplianceScores } from "../data/getFrameworkWithComplianceScores";
import type { FrameworkInstanceWithControls } from "../types";
import { FrameworkList } from "./FrameworkList";

export interface FrameworksOverviewProps {
	frameworksWithControls: FrameworkInstanceWithControls[];
}

export async function FrameworksOverview({
	frameworksWithControls,
}: FrameworksOverviewProps) {
	const frameworksWithControlsAndComplianceScores =
		await getFrameworkWithComplianceScores({
			frameworksWithControls,
		});

	return (
		<div className="grid gap-4 md:grid-cols-1 select-none w-full">
			<FrameworkList
				frameworksWithControlsAndComplianceScores={
					frameworksWithControlsAndComplianceScores
				}
			/>
		</div>
	);
}
