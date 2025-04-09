import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.session.activeOrganizationId) {
		redirect(`/${session.session.activeOrganizationId}/frameworks`);
	}
	return <>{children}</>;
}
