import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";

import { Button } from "@comp/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { cn } from "@comp/ui/cn";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
	table: Table<TData>;
	pageSizeOptions?: number[];
	tableId?: string;
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = [10, 20, 30, 40, 50],
	tableId,
	className,
	...props
}: DataTablePaginationProps<TData>) {
	const pageParam = tableId ? `${tableId}_page` : "page";
	const perPageParam = tableId ? `${tableId}_perPage` : "perPage";

	const [page, setPage] = useQueryState(pageParam);
	const [perPage, setPerPage] = useQueryState(perPageParam);

	// Parse URL query params
	const pageIndex = React.useMemo(() => {
		if (!page) return table.getState().pagination.pageIndex;
		try {
			const parsed = Number.parseInt(page, 10);
			return Number.isNaN(parsed)
				? table.getState().pagination.pageIndex
				: parsed - 1;
		} catch (e) {
			return table.getState().pagination.pageIndex;
		}
	}, [page, table]);

	const pageSizeValue = React.useMemo(() => {
		if (!perPage) return table.getState().pagination.pageSize;
		try {
			const parsed = Number.parseInt(perPage, 10);
			return Number.isNaN(parsed)
				? table.getState().pagination.pageSize
				: parsed;
		} catch (e) {
			return table.getState().pagination.pageSize;
		}
	}, [perPage, table]);

	// Use effect to update table pagination when query params change
	React.useEffect(() => {
		if (pageIndex !== table.getState().pagination.pageIndex) {
			table.setPageIndex(pageIndex);
		}

		if (pageSizeValue !== table.getState().pagination.pageSize) {
			table.setPageSize(pageSizeValue);
		}
	}, [pageIndex, pageSizeValue, table]);

	// Sync URL with table state on initial render
	React.useEffect(() => {
		const currentPageIndex = table.getState().pagination.pageIndex;
		const currentPageSize = table.getState().pagination.pageSize;

		if (page === undefined && currentPageIndex > 0) {
			setPage((currentPageIndex + 1).toString());
		}

		if (perPage === undefined && currentPageSize !== 10) {
			setPerPage(currentPageSize.toString());
		}
	}, [table, page, perPage, setPage, setPerPage]);

	// Handlers that update both table state and URL query params
	const handlePageChange = React.useCallback(
		(newPage: number) => {
			setPage((newPage + 1).toString());
			table.setPageIndex(newPage);
		},
		[setPage, table],
	);

	const handlePageSizeChange = React.useCallback(
		(value: string) => {
			const newSize = Number(value);
			setPerPage(value);
			table.setPageSize(newSize);
		},
		[setPerPage, table],
	);

	return (
		<div
			className={cn(
				"flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
				className,
			)}
			{...props}
		>
			<div className="flex-1 flex items-center gap-2 select-none">
				<p className="text-sm text-muted-foreground">
					{table.getCoreRowModel().rows.length} items
				</p>
			</div>
			<div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8 select-none">
				<div className="flex items-center space-x-2">
					<p className="whitespace-nowrap text-sm">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={handlePageSizeChange}
					>
						<SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="bottom">
							{pageSizeOptions.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center justify-center text-sm">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						aria-label="Go to first page"
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => handlePageChange(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronsLeft className="size-4" />
					</Button>
					<Button
						aria-label="Go to previous page"
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => handlePageChange(pageIndex - 1)}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft className="size-4" />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => handlePageChange(pageIndex + 1)}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRight className="size-4" />
					</Button>
					<Button
						aria-label="Go to last page"
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => handlePageChange(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<ChevronsRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
