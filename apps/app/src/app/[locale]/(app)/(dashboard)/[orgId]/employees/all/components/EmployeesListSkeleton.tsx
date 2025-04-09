import { FilterToolbar } from "@/components/tables/people/filter-toolbar";
import { Skeleton } from "@comp/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@comp/ui/table";

const SKELETON_ROWS = [
	"skeleton-1",
	"skeleton-2",
	"skeleton-3",
	"skeleton-4",
	"skeleton-5",
] as const;

export const EmployeesListSkeleton = () => {
	return (
		<div className="relative overflow-hidden">
			<FilterToolbar isEmpty={true} />
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-[200px]" />
							</TableHead>
							<TableHead className="hidden md:table-cell">
								<Skeleton className="h-4 w-[150px]" />
							</TableHead>
							<TableHead className="hidden md:table-cell">
								<Skeleton className="h-4 w-[100px]" />
							</TableHead>
							<TableHead className="hidden md:table-cell">
								<Skeleton className="h-4 w-[100px]" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{SKELETON_ROWS.map((key) => (
							<TableRow key={key} className="h-[54px]">
								<TableCell>
									<div className="flex flex-col space-y-0.5">
										<Skeleton className="h-4 w-[200px]" />
										<Skeleton className="h-4 w-[150px] md:hidden" />
										<Skeleton className="h-4 w-[80px] md:hidden mt-1" />
									</div>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Skeleton className="h-4 w-[150px]" />
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Skeleton className="h-4 w-[100px]" />
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Skeleton className="h-4 w-[80px]" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
