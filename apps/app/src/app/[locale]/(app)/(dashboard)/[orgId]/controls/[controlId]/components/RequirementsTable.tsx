"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import type {
	FrameworkId,
	FrameworkInstance,
	RequirementMap,
} from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getFrameworkDetails } from "../../../frameworks/lib/getFrameworkDetails";
import { getRequirementDetails } from "../../../frameworks/lib/getRequirementDetails";

interface RequirementsTableProps {
	requirements: (RequirementMap & { frameworkInstance: FrameworkInstance })[];
	orgId: string;
}

export function RequirementsTable({
	requirements,
	orgId,
}: RequirementsTableProps) {
	const t = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	// Define columns for requirements table
	const columns = useMemo<
		ColumnDef<RequirementMap & { frameworkInstance: FrameworkInstance }>[]
	>(
		() => [
			{
				accessorKey: "id",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.name")}
					/>
				),
				cell: ({ row }) => {
					const [frameworkId, requirementId] =
						row.original.requirementId.split("_");
					const details = getRequirementDetails(
						frameworkId as FrameworkId,
						requirementId,
					);

					const frameworkDetails = getFrameworkDetails(
						row.original.frameworkInstance.frameworkId,
					);
					return (
						<span>
							{frameworkDetails?.name} - {details?.name}
						</span>
					);
				},
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					const [frameworkIdA, requirementIdA] =
						rowA.original.requirementId.split("_");
					const [frameworkIdB, requirementIdB] =
						rowB.original.requirementId.split("_");

					const detailsA = getRequirementDetails(
						frameworkIdA as FrameworkId,
						requirementIdA,
					);
					const detailsB = getRequirementDetails(
						frameworkIdB as FrameworkId,
						requirementIdB,
					);

					const nameA = detailsA?.name || "";
					const nameB = detailsB?.name || "";

					return nameA.localeCompare(nameB);
				},
			},
			{
				accessorKey: "description",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.requirements.table.description")}
					/>
				),
				cell: ({ row }) => {
					const [frameworkId, requirementId] =
						row.original.requirementId.split("_");
					const details = getRequirementDetails(
						frameworkId as FrameworkId,
						requirementId,
					);
					return (
						<span className="text-muted-foreground">
							{details?.description}
						</span>
					);
				},
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					const [frameworkIdA, requirementIdA] =
						rowA.original.requirementId.split("_");
					const [frameworkIdB, requirementIdB] =
						rowB.original.requirementId.split("_");

					const detailsA = getRequirementDetails(
						frameworkIdA as FrameworkId,
						requirementIdA,
					);
					const detailsB = getRequirementDetails(
						frameworkIdB as FrameworkId,
						requirementIdB,
					);

					const descA = detailsA?.description || "";
					const descB = detailsB?.description || "";

					return descA.localeCompare(descB);
				},
			},
		],
		[t],
	);

	// Filter requirements data based on search term
	const filteredRequirements = useMemo(() => {
		if (!searchTerm.trim()) return requirements;

		const searchLower = searchTerm.toLowerCase();
		return requirements.filter((req) => {
			const [frameworkId, requirementId] = req.requirementId.split("_");
			const details = getRequirementDetails(
				frameworkId as FrameworkId,
				requirementId,
			);

			// Search in ID, name, and description
			return (
				frameworkId.toLowerCase().includes(searchLower) ||
				requirementId.toLowerCase().includes(searchLower) ||
				details?.name?.toLowerCase().includes(searchLower) ||
				false ||
				details?.description?.toLowerCase().includes(searchLower) ||
				false
			);
		});
	}, [requirements, searchTerm]);

	// Set up the requirements table
	const table = useDataTable({
		data: filteredRequirements,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "id", desc: false }],
		},
		tableId: "r",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("frameworks.requirements.title")} ({filteredRequirements.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-4">
					<Input
						placeholder={t(
							"frameworks.requirements.search.universal_placeholder",
						)}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
					<div className="ml-auto">
						<DataTableSortList table={table.table} align="end" tableId="r" />
					</div>
				</div>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/frameworks`}
					getRowId={(row) => {
						const [_, requirementId] = row.requirementId.split("_");
						return `${row.frameworkInstanceId}/requirements/${requirementId}`;
					}}
					tableId={"r"}
				/>
			</CardContent>
		</Card>
	);
}
