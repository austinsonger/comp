"use client";

import { FrameworkCard } from "./FrameworkCard";
import type { FrameworkInstanceWithComplianceScore } from "./types";

export function FrameworkList({
	frameworksWithControlsAndComplianceScores,
}: {
	frameworksWithControlsAndComplianceScores: FrameworkInstanceWithComplianceScore[];
}) {
	if (!frameworksWithControlsAndComplianceScores.length) return null;

	return (
		<div className="space-y-6">
			{frameworksWithControlsAndComplianceScores.map(
				({ frameworkInstance, complianceScore }) => (
					<FrameworkCard
						key={frameworkInstance.id}
						frameworkInstance={frameworkInstance}
						complianceScore={complianceScore}
					/>
				),
			)}
		</div>
	);
}
