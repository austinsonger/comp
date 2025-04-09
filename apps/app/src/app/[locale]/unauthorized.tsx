import { getI18n } from "@/locales/server";
import { Button } from "@comp/ui/button";
import { Card } from "@comp/ui/card";
import Link from "next/link";

export default async function UnauthorizedPage() {
	const t = await getI18n();

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Card className="w-full max-w-lg p-8 space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						{t("errors.unauthorized.title")}
					</h1>
					<p className="text-muted-foreground">
						{t("errors.unauthorized.description")}
					</p>
				</div>

				<div className="flex justify-center">
					<Button asChild>
						<Link href="/">{t("errors.unauthorized.back")}</Link>
					</Button>
				</div>
			</Card>
		</div>
	);
}
