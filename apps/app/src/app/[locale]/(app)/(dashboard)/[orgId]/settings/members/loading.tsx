import { LogoSpinner } from "@/components/logo-spinner";
import { getI18n } from "@/locales/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";

export default async function Loading() {
	const t = await getI18n();

	return (
		<div className="space-y-4 sm:space-y-8">
			<Tabs defaultValue="members">
				<TabsList className="bg-transparent border-b-[1px] w-full justify-start rounded-none mb-1 p-0 h-auto pb-4">
					<TabsTrigger value="members" className="p-0 m-0 mr-4">
						{t("settings.team.tabs.members")}
					</TabsTrigger>
					<TabsTrigger value="invite" className="p-0 m-0">
						{t("settings.team.tabs.invite")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="members">
					<Card>
						<CardHeader>
							<CardTitle>{t("settings.team.members.title")}</CardTitle>
							<CardDescription />
						</CardHeader>
						<CardContent>
							<LogoSpinner />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="invite">
					<div className="flex flex-col gap-4">
						<Card>
							<CardHeader className="blur-sm">
								<CardTitle>{t("settings.team.invite.title")}</CardTitle>
								<CardDescription>
									{t("settings.team.invite.description")}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<LogoSpinner />
							</CardContent>
							<div className="p-4 flex justify-end">
								<div className="h-10 w-24 bg-muted rounded blur-sm" />
							</div>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
