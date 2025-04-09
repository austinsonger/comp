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
import { AlertDialog, AlertDialogTrigger } from "@comp/ui/alert-dialog";

export default async function Loading() {
	const t = await getI18n();

	return (
		<div className="space-y-12">
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

			<Card className="border-2 border-destructive">
				<CardHeader>
					<CardTitle>{t("settings.general.org_delete")}</CardTitle>
					<CardDescription>
						{t("settings.general.org_delete_description")}
					</CardDescription>
				</CardHeader>
				<CardFooter className="flex justify-between">
					<div />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								disabled
								aria-label={t("common.actions.delete")}
							>
								{t("common.actions.delete")}
							</Button>
						</AlertDialogTrigger>
					</AlertDialog>
				</CardFooter>
			</Card>
		</div>
	);
}
