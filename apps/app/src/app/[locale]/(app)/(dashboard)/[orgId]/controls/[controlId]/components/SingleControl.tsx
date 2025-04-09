"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import { useI18n } from "@/locales/client";
import type {
	Artifact,
	Control,
	Evidence,
	FrameworkInstance,
	Policy,
	RequirementMap,
} from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { ControlProgressResponse } from "../data/getOrganizationControlProgress";
import { ArtifactsTable } from "./ArtifactsTable";
import { RequirementsTable } from "./RequirementsTable";
import { SingleControlSkeleton } from "./SingleControlSkeleton";

interface SingleControlProps {
	control: Control & {
		requirementsMapped: (RequirementMap & {
			frameworkInstance: FrameworkInstance;
		})[];
	};
	controlProgress: ControlProgressResponse;
	relatedArtifacts: (Artifact & {
		evidence: Evidence | null;
		policy: Policy | null;
	})[];
}

export const SingleControl = ({
	control,
	controlProgress,
	relatedArtifacts = [],
}: SingleControlProps) => {
	const t = useI18n();
	const params = useParams();
	const orgId = params.orgId as string;
	const controlId = params.controlId as string;

	const progressStatus = useMemo(() => {
		if (!controlProgress) return "not_started";

		return controlProgress.total === controlProgress.completed
			? "completed"
			: controlProgress.completed > 0
				? "in_progress"
				: "not_started";
	}, [controlProgress]);

	if (!control || !controlProgress) {
		return <SingleControlSkeleton />;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>
							<span className="text-sm text-muted-foreground">
								{t("frameworks.controls.title")}
							</span>
							<h1 className="text-2xl font-semibold">{control.name}</h1>
						</div>
						<DisplayFrameworkStatus status={progressStatus} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">{control.description}</p>
				</CardContent>
			</Card>
			<RequirementsTable
				requirements={control.requirementsMapped}
				orgId={orgId}
			/>
			<ArtifactsTable
				artifacts={relatedArtifacts}
				orgId={orgId}
				controlId={controlId}
			/>
		</div>
	);
};
