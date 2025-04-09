import { auth } from "@/utils/auth";
import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@comp/ui/secondary-menu";
import { headers } from "next/headers";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const orgId = session?.session.activeOrganizationId;

	return (
		<div className="max-w-[1200px] m-auto">
			<SecondaryMenu
				items={[
					{
						path: `/${orgId}/employees`,
						label: t("people.dashboard.title"),
					},
					{ path: `/${orgId}/employees/all`, label: t("people.all") },
				]}
			/>

			<main className="mt-8">{children}</main>
		</div>
	);
}
