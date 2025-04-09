"use client";

import { useI18n } from "@/locales/client";
import type { Control } from "@comp/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import type { Artifact, Evidence, Policy } from "@comp/db/types";
import { getControlStatus } from "../../../../../lib/utils";
import { isArtifactCompleted } from "@/app/[locale]/(app)/(dashboard)/[orgId]/lib/utils/control-compliance";

type OrganizationControlType = Control & {
	artifacts: (Artifact & {
		policy: Policy | null;
		evidence: Evidence | null;
	})[];
};

export function RequirementControlsTableColumns(): ColumnDef<OrganizationControlType>[] {
	const t = useI18n();
	const { orgId } = useParams<{ orgId: string }>();

	return [
		{
			id: "name",
			accessorKey: "name",
			header: t("frameworks.controls.table.control"),
			cell: ({ row }) => {
				return (
					<div className="flex flex-col w-[300px]">
						<Link
							href={`/${orgId}/controls/${row.original.id}`}
							className="flex flex-col"
						>
							<span className="font-medium truncate">{row.original.name}</span>
						</Link>
					</div>
				);
			},
		},
		{
			id: "status",
			accessorKey: "artifacts",
			header: t("frameworks.controls.table.status"),
			cell: ({ row }) => {
				const artifacts = row.original.artifacts;
				const status = getControlStatus(artifacts);

				const totalArtifacts = artifacts.length;
				const completedArtifacts = artifacts.filter(isArtifactCompleted).length;

				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="w-[200px]">
									<DisplayFrameworkStatus status={status} />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<div className="text-sm">
									<p>
										Progress:{" "}
										{Math.round((completedArtifacts / totalArtifacts) * 100) ||
											0}
										%
									</p>
									<p>
										Completed: {completedArtifacts}/{totalArtifacts} artifacts
									</p>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			},
		},
	];
}
