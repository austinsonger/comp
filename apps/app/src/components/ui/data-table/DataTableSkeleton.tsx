import { Skeleton } from "@comp/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@comp/ui/table";

interface DataTableSkeletonProps {
	columns?: number;
	rows?: number;
	className?: string;
	showFilters?: boolean;
	showSearch?: boolean;
	showPagination?: boolean;
}

export function DataTableSkeleton({
	columns = 5,
	rows = 5,
	className,
	showFilters = false,
	showSearch = false,
	showPagination = false,
}: DataTableSkeletonProps) {
	return (
		<div className="space-y-4 w-full">
			{(showSearch || showFilters) && (
				<div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
					{showSearch && (
						<div className="w-full md:w-[300px]">
							<Skeleton className="h-10 w-full" />
						</div>
					)}
					{showFilters && (
						<div className="flex items-center gap-2">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					)}
				</div>
			)}

			<Table className={className}>
				<TableHeader>
					<TableRow>
						{Array.from({ length: columns }).map((_, i) => (
							<TableHead key={`skeleton-header-${i + 1}`}>
								<Skeleton className="h-4 w-[200px]" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rows }).map((_, i) => (
						<TableRow key={`skeleton-row-${i + 1}`} className="h-[54px]">
							{Array.from({ length: columns }).map((_, j) => (
								<TableCell key={`skeleton-cell-${i + 1}-${j + 1}`}>
									<Skeleton className="h-4 w-[150px]" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>

			{showPagination && (
				<div className="flex items-center justify-between mt-4">
					<Skeleton className="h-8 w-[200px]" />
					<Skeleton className="h-8 w-[120px]" />
				</div>
			)}
		</div>
	);
}
