"use client";

import type { Column } from "@tanstack/react-table";
import { Button } from "@comp/ui/button";
import { TableHead } from "@comp/ui/table";

interface DataTableColumnHeaderProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
	className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	return (
		<TableHead className={className || "w-[20%]"}>
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{title}
			</Button>
		</TableHead>
	);
}
