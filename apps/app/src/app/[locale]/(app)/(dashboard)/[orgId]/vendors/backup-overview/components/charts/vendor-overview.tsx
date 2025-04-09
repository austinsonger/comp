"use server";

import { getI18n } from "@/locales/server";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { VendorsByCategory } from "./vendors-by-category";
import { VendorsByStatus } from "./vendors-by-status";

interface VendorOverviewProps {
	organizationId: string;
}

export async function VendorOverview({ organizationId }: VendorOverviewProps) {
	const t = await getI18n();

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
				<div className="w-full h-full">
					<VendorsByStatus organizationId={organizationId} />
				</div>
				<div className="w-full h-full">
					<VendorsByCategory organizationId={organizationId} />
				</div>
			</div>
		</div>
	);
}
