import { VendorOverview } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/backup-overview/components/charts/vendor-overview";
import { getServersideSession } from "@/lib/get-session";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function VendorManagement({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	const {
		session: { activeOrganizationId },
	} = await getServersideSession({
		headers: await headers(),
	});

	if (!activeOrganizationId) {
		redirect("/");
	}

	return (
		<div className="space-y-4 sm:space-y-8">
			<VendorOverview organizationId={activeOrganizationId} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sidebar.vendors"),
	};
}
