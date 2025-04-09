"use client";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableRow } from "@comp/ui/table";
import { ControlRequirementsTableColumns } from "./ControlRequirementsTableColumns";
import { ControlRequirementsTableHeader } from "./ControlRequirementsTableHeader";
import { useParams, useRouter } from "next/navigation";
import type { Evidence, Policy } from "@comp/db/types";
import { Requirement } from "@comp/data";

// Define the type that matches what we receive from the hook
export type RequirementTableData = Requirement & {
	policy: Policy | null;
	evidence: Evidence | null;
};

interface DataTableProps {
	data: RequirementTableData[];
}

export function ControlRequirementsTable({ data }: DataTableProps) {
	const router = useRouter();
	const { orgId } = useParams<{ orgId: string }>();

	const table = useReactTable({
		data,
		columns: ControlRequirementsTableColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const onRowClick = (requirement: RequirementTableData) => {
		switch (requirement.policy ? "policy" : "evidence") {
			case "policy":
				if (requirement.policy?.id) {
					router.push(`/${orgId}/policies/all/${requirement.policy.id}`);
				}
				break;
			case "evidence":
				if (requirement.evidence?.id) {
					router.push(`/${orgId}/evidence/${requirement.evidence.id}`);
				}
				break;
			default:
				break;
		}
	};

	return (
		<div className="relative w-full">
			<div className="overflow-auto">
				<Table>
					<ControlRequirementsTableHeader table={table} />
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/50 cursor-pointer"
									onClick={() => onRowClick(row.original)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={ControlRequirementsTableColumns.length}
									className="h-24 text-center"
								>
									No requirements found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
