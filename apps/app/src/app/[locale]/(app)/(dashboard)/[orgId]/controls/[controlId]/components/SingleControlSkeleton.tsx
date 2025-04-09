import { CardHeader, CardContent, CardTitle } from "@comp/ui/card";

import { Card } from "@comp/ui/card";

export const SingleControlSkeleton = () => {
	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
						</CardHeader>
						<CardContent>
							<div className="h-16 bg-muted animate-pulse rounded" />
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Domain</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col gap-2">
					<div className="w-full h-48 bg-muted/50 animate-pulse" />
				</div>
			</div>
		</div>
	);
};
