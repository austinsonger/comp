import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { EmployeesList } from "./components/EmployeesList";

export default async function AllPeoplePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setStaticParamsLocale(locale);

	return <EmployeesList />;
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
		title: t("sidebar.employees"),
	};
}
