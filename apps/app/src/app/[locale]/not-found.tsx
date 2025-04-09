import { getI18n } from "@/locales/server";
import Link from "next/link";

export default async function NotFound() {
	const t = await getI18n();

	return (
		<div className="h-screen flex flex-col items-center justify-center text-center text-sm text-muted-foreground ">
			<h2 className="text-xl font-semibold mb-2">{t("not_found.title")}</h2>
			<p className="mb-4">{t("not_found.description")}</p>
			<Link href="/" className="underline">
				{t("not_found.return")}
			</Link>
		</div>
	);
}
