"use client";

import { EmployeesTable } from "./table/EmployeesTable";
import { EmployeesTableProvider } from "./table/hooks/useEmployeesTableContext";

export function EmployeesList() {
	return (
		<EmployeesTableProvider>
			<EmployeesTable />
		</EmployeesTableProvider>
	);
}
