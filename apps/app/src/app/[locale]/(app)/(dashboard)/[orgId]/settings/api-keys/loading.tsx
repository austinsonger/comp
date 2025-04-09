import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Button } from "@comp/ui/button";
import { getI18n } from "@/locales/server";
import { Plus } from "lucide-react";
import { LogoSpinner } from "@/components/logo-spinner";

export default async function Loading() {
	const t = await getI18n();

	return (
		<div className="mx-auto max-w-7xl">
			<Card>
				<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle>{t("settings.api_keys.list_title")}</CardTitle>
						<CardDescription>
							{t("settings.api_keys.list_description")}
						</CardDescription>
					</div>
					<Button
						className="flex items-center gap-1 self-start sm:self-auto"
						disabled
						aria-label={t("settings.api_keys.create")}
					>
						<Plus className="h-4 w-4" />
						{t("settings.api_keys.create")}
					</Button>
				</CardHeader>
				<CardContent>
					<LogoSpinner />
				</CardContent>
				<CardFooter className="text-sm text-muted-foreground">
					{t("settings.api_keys.security_note")}
				</CardFooter>
			</Card>
		</div>
	);
}
