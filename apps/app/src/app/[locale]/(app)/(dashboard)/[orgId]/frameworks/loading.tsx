import { Card, CardContent } from "@comp/ui/card";
import { Progress } from "@comp/ui/progress";
import { Skeleton } from "@comp/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-12">
			<div className="grid gap-4 md:grid-cols-2 select-none">
				{/* Framework Cards */}
				{[1, 2, 3].map((index) => (
					<Card
						key={index}
						className="select-none hover:bg-muted/40 transition-colors duration-200"
					>
						<CardContent className="pt-6">
							<div className="flex flex-col gap-4 rounded-lg p-4">
								<div className="flex items-start gap-4">
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<Skeleton className="h-8 w-48" /> {/* Framework name */}
											<Skeleton className="h-5 w-24" />{" "}
											{/* Compliance percentage */}
										</div>
										<Progress value={0} className="h-2 mt-2 bg-secondary" />
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 text-sm">
									<div className="space-y-1">
										<Skeleton className="h-4 w-24" /> {/* Controls label */}
										<Skeleton className="h-5 w-32" /> {/* Controls count */}
									</div>
									<div className="space-y-1">
										<Skeleton className="h-4 w-24" /> {/* Completed label */}
										<Skeleton className="h-5 w-32" /> {/* Completed count */}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
