"use client";

import { EmployeeInviteSheet } from "@/components/sheets/add-employee-sheet";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { employeesColumns } from "./columns";
import { useEmployeesTable } from "./hooks/useEmployeesTableContext";

export function EmployeesTable() {
	const router = useRouter();
	const [, setInviteSheetOpen] = useQueryState("invite-user-sheet");
	const { orgId } = useParams<{ orgId: string }>();

	const {
		page,
		setPage,
		per_page,
		setPerPage,
		employees,
		total,
		search,
		setSearch,
		isLoading,
		isSearching,
	} = useEmployeesTable();

	const handleRowClick = (employeeId: string) => {
		router.push(`/${orgId}/employees/${employeeId}`);
	};

	// Calculate pagination values only when total is defined
	const pagination =
		total !== undefined
			? {
					page: Number(page),
					pageSize: Number(per_page),
					totalCount: total,
					totalPages: Math.ceil(total / Number(per_page)),
					hasNextPage: Number(page) * Number(per_page) < total,
					hasPreviousPage: Number(page) > 1,
				}
			: undefined;

	return (
		<>
			<DataTable
				data={employees}
				columns={employeesColumns}
				onRowClick={(row) => handleRowClick(row.id)}
				emptyMessage="No employees found."
				isLoading={isLoading || isSearching}
				pagination={pagination}
				onPageChange={(page) => setPage(page)}
				onPageSizeChange={(pageSize) => setPerPage(pageSize)}
				search={{
					value: search || "",
					onChange: setSearch,
					placeholder: "Search employees...",
				}}
				ctaButton={{
					label: "Add Employee",
					onClick: () => setInviteSheetOpen("true"),
					icon: <Plus className="h-4 w-4" />,
				}}
			/>
			<EmployeeInviteSheet />
		</>
	);
}
