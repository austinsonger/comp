"use client";

import { useI18n } from "@/locales/client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTable } from "@/hooks/use-data-table";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import { Input } from "@comp/ui/input";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { getControlStatus } from "../../../../../lib/utils";
import { isArtifactCompleted } from "@/app/[locale]/(app)/(dashboard)/[orgId]/lib/utils/control-compliance";
import type { Control } from "@comp/db/types";
import type { Artifact, Evidence, Policy } from "@comp/db/types";

interface RequirementControlsTableProps {
	controls: (Control & {
		artifacts: (Artifact & {
			policy: Policy | null;
			evidence: Evidence | null;
		})[];
	})[];
}

export function RequirementControlsTable({
	controls,
}: RequirementControlsTableProps) {
	const t = useI18n();
	const { orgId } = useParams<{ orgId: string }>();
	const [searchTerm, setSearchTerm] = useState("");

	// Define columns for the controls table
	const columns = useMemo<
		ColumnDef<
			Control & {
				artifacts: (Artifact & {
					policy: Policy | null;
					evidence: Evidence | null;
				})[];
			}
		>[]
	>(
		() => [
			{
				id: "name",
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.controls.table.control")}
					/>
				),
				cell: ({ row }) => (
					<div className="flex flex-col w-[300px]">
						<Link
							href={`/${orgId}/controls/${row.original.id}`}
							className="flex flex-col"
						>
							<span className="font-medium truncate">{row.original.name}</span>
						</Link>
					</div>
				),
				enableSorting: true,
				size: 300,
				minSize: 200,
				maxSize: 400,
				enableResizing: true,
			},
			{
				id: "status",
				accessorKey: "artifacts",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.controls.table.status")}
					/>
				),
				cell: ({ row }) => {
					const artifacts = row.original.artifacts;
					const status = getControlStatus(artifacts);

					const totalArtifacts = artifacts.length;
					const completedArtifacts =
						artifacts.filter(isArtifactCompleted).length;

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
											{Math.round(
												(completedArtifacts / totalArtifacts) * 100,
											) || 0}
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
				enableSorting: true,
				size: 200,
				minSize: 150,
				maxSize: 250,
				enableResizing: true,
			},
		],
		[t, orgId],
	);

	// Filter controls data based on search term
	const filteredControls = useMemo(() => {
		if (!controls?.length) return [];
		if (!searchTerm.trim()) return controls;

		const searchLower = searchTerm.toLowerCase();
		return controls.filter((control) =>
			control.name.toLowerCase().includes(searchLower),
		);
	}, [controls, searchTerm]);

	// Set up the controls table
	const table = useDataTable({
		data: filteredControls,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "name", desc: false }],
		},
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center">
				<Input
					placeholder={t("frameworks.controls.search.placeholder")}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm"
				/>
				<div className="ml-auto">
					<DataTableSortList table={table.table} />
				</div>
			</div>
			<DataTable
				table={table.table}
				rowClickBasePath={`/${orgId}/controls`}
				getRowId={(row) => row.id}
			/>
		</div>
	);
}
