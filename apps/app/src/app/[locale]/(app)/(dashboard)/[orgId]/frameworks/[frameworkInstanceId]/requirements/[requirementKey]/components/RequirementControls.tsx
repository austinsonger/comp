"use client";

import { useI18n } from "@/locales/client";
import type { Requirement } from "@comp/data";
import { FrameworkId } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { FrameworkInstanceWithControls } from "../../../../types";
import { RequirementControlsTable } from "./table/RequirementControlsTable";

interface RequirementControlsProps {
	requirement: Requirement;
	requirementKey: string;
	frameworkInstanceWithControls: FrameworkInstanceWithControls;
}

export function RequirementControls({
	requirement,
	requirementKey,
	frameworkInstanceWithControls,
}: RequirementControlsProps) {
	const t = useI18n();

	// Get the framework ID from the instance
	const frameworkId = frameworkInstanceWithControls.frameworkId as FrameworkId;
	const compositeId = `${frameworkId}_${requirementKey}`;

	// Filter controls that are mapped to this requirement using the composite ID
	const requirementControls = frameworkInstanceWithControls.controls.filter(
		(control) =>
			control.requirementsMapped?.some(
				(req) => req.requirementId === compositeId,
			) ?? false,
	);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>
							<span className="text-sm text-muted-foreground">
								{t("frameworks.requirements.requirement")}
							</span>
							<h1 className="text-2xl font-semibold">{requirement.name}</h1>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{requirement.description}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						{t("frameworks.controls.title")} ({requirementControls.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<RequirementControlsTable controls={requirementControls} />
				</CardContent>
			</Card>
		</div>
	);
}
