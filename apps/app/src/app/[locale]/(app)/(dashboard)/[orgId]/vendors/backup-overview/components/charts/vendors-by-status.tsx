import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { StatusChart } from "./status-chart";
interface Props {
	organizationId: string;
}

export async function VendorsByStatus({ organizationId }: Props) {
	const t = await getI18n();

	const vendors = await getVendorsByStatus(organizationId);

	const data = vendors.map((vendor) => ({
		name: vendor.status,
		value: vendor._count,
	}));

	return (
		<Card className="w-full h-full">
			<CardHeader>
				<CardTitle>{t("vendors.dashboard.status")}</CardTitle>
			</CardHeader>
			<CardContent className="w-full">
				<StatusChart data={data} />
			</CardContent>
		</Card>
	);
}

const getVendorsByStatus = async (organizationId: string) => {
	return await db.vendor.groupBy({
		by: ["status"],
		where: { organizationId },
		_count: true,
	});
};
