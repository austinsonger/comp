"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import { Table, TableBody, TableCell, TableRow } from "@comp/ui/table";
import { useParams, useRouter } from "next/navigation";
import type { PersonType } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@comp/ui/badge";
import { Status, type StatusType } from "@/components/status";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import {
	EmployeeStatus,
	getEmployeeStatusFromBoolean,
} from "./employee-status";
import Link from "next/link";

interface DataTableProps {
	columnHeaders: {
		name: string;
		email: string;
		department: string;
		status: string;
	};
	data: PersonType[];
	pageCount: number;
	currentPage: number;
}

function getColumns(): ColumnDef<PersonType>[] {
	const t = useI18n();
	const { orgId } = useParams<{ orgId: string }>();

	return [
		{
			id: "name",
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("people.table.name")} />
			),
			cell: ({ row }) => {
				const name = row.original.name;
				const email = row.original.email;
				const isActive = row.original.isActive;
				const status = getEmployeeStatusFromBoolean(isActive);

				return (
					<div className="flex flex-col space-y-0.5">
						<Button variant="link" className="p-0 h-auto justify-start" asChild>
							<Link href={`/${orgId}/employees/${row.original.id}`}>
								<span className="truncate">{name}</span>
							</Link>
						</Button>
						<div className="block md:hidden text-muted-foreground text-sm leading-tight">
							{email}
						</div>
						<div className="md:hidden mt-1">
							<EmployeeStatus status={status} />
						</div>
					</div>
				);
			},
		},
		{
			id: "email",
			accessorKey: "email",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={t("people.table.email")}
				/>
			),
			cell: ({ row }) => {
				const email = row.original.email;
				return (
					<div className="hidden md:block text-muted-foreground">{email}</div>
				);
			},
		},
		{
			id: "department",
			accessorKey: "department",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={t("people.table.department")}
				/>
			),
			cell: ({ row }) => {
				const department = row.original.department;
				return (
					<div className="flex items-center md:flex">
						<Badge variant="marketing">{department}</Badge>
					</div>
				);
			},
		},
		{
			id: "status",
			accessorKey: "isActive",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={t("people.table.status")}
				/>
			),
			cell: ({ row }) => {
				const isActive = row.original.isActive;
				const status = getEmployeeStatusFromBoolean(isActive);

				return (
					<div className="hidden md:block">
						<EmployeeStatus status={status} />
					</div>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
	];
}

export function DataTable({
	columnHeaders,
	data,
	pageCount,
	currentPage,
}: DataTableProps) {
	const columns = getColumns();
	const router = useRouter();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		pageCount,
	});

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<DataTableHeader table={table} />
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cn(
												(cell.column.id === "email" ||
													cell.column.id === "department" ||
													cell.column.id === "status") &&
													"hidden md:table-cell",
											)}
										>
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
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination pageCount={pageCount} currentPage={currentPage} />
		</div>
	);
}
