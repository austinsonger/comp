import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { getI18n } from "@/locales/server";

export default async function Loading() {
	const t = await getI18n();

	return (
		<div className="space-y-12 grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>{t("settings.general.org_name")}</CardTitle>
					<CardDescription>
						{t("settings.general.org_name_description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						type="text"
						placeholder="Loading..."
						className="max-w-[300px]"
					/>
				</CardContent>
				<CardFooter className="flex justify-between">
					<div>{t("settings.general.org_name_tip")}</div>
					<Button disabled aria-label={t("common.actions.save")}>
						{t("common.actions.save")}
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>{t("settings.general.org_website")}</CardTitle>
					<CardDescription>
						{t("settings.general.org_website_description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						type="url"
						placeholder="Loading..."
						className="max-w-[300px]"
					/>
				</CardContent>
				<CardFooter className="flex justify-between">
					<div>{t("settings.general.org_website_tip")}</div>
					<Button disabled aria-label={t("common.actions.save")}>
						{t("common.actions.save")}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
