import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { getI18n } from "@/locales/server";
import { LogoSpinner } from "@/components/logo-spinner";

export default async function Loading() {
	const t = await getI18n();

	return (
		<div className="space-y-4 sm:space-y-8">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{t("evidence.dashboard.evidence_status")}</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-center h-[300px]">
						<LogoSpinner />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("evidence.dashboard.by_assignee")}</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-center h-[300px]">
						<LogoSpinner />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
