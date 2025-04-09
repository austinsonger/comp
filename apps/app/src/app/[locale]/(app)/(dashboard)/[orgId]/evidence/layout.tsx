import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@comp/ui/secondary-menu";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ policyId: string; orgId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const t = await getI18n();
	const { orgId } = await params;

	return (
		<div className="max-w-[1200px] m-auto flex flex-col gap-6">
			<SecondaryMenu
				items={[
					{
						path: `/${orgId}/evidence`,
						label: t("evidence.dashboard.layout"),
					},
					{
						path: `/${orgId}/evidence/all`,
						label: t("evidence.list"),
						activeOverrideIdPrefix: "evd_",
					},
				]}
			/>
			<div>{children}</div>
		</div>
	);
}
