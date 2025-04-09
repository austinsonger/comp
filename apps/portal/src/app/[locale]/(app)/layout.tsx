import { Header } from "@/app/components/header";
import { Sidebar } from "@/app/components/sidebar";
import { auth } from "@/app/lib/auth";
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

	if (!session?.user) {
		redirect("/auth");
	}

	return (
		<div className="relative">
			<Sidebar />

			<div className="mx-4 md:ml-[95px] md:mr-10 pb-8">
				<Header />
				<main className="max-w-[1200px] mx-auto">{children}</main>
			</div>
		</div>
	);
}
