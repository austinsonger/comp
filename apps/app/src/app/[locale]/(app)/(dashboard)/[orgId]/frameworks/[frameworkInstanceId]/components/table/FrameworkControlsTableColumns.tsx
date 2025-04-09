"use client";

import {
	DisplayFrameworkStatus,
	type StatusType,
} from "@/components/frameworks/framework-status";
import { useI18n } from "@/locales/client";
import type { Artifact, PolicyStatus } from "@comp/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import { useParams } from "next/navigation";
import { getControlStatus } from "../../../lib/utils";

export type OrganizationControlType = {
	id: string;
	name: string;
	description: string | null;
	frameworkInstanceId: string;
	artifacts: (Artifact & {
		policy: {
			status: PolicyStatus;
		} | null;
		evidence: {
			published: boolean;
		} | null;
	})[];
};

// Local helper function to check artifact completion
function isArtifactCompleted(
	artifact: OrganizationControlType["artifacts"][0],
): boolean {
	if (!artifact) return false;

	switch (artifact.type) {
		case "policy":
			return artifact.policy?.status === "published";
		case "evidence":
			return artifact.evidence?.published === true;
		case "procedure":
		case "training":
			// For other types, they're completed if they exist
			return true;
		default:
			return false;
	}
}

export function FrameworkControlsTableColumns(): ColumnDef<OrganizationControlType>[] {
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
			id: "category",
			accessorKey: "name",
			header: t("risk.vendor.table.category"),
			cell: ({ row }) => (
				<div className="w-[200px]">
					<span className="text-sm">{row.original.name}</span>
				</div>
			),
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
