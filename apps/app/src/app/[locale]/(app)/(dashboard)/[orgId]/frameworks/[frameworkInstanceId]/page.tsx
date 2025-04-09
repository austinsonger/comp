import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSingleFrameworkInstanceWithControls } from "../data/getSingleFrameworkInstanceWithControls";
import { FrameworkOverview } from "./components/FrameworkOverview";
import { FrameworkRequirements } from "./components/FrameworkRequirements";
import PageWithBreadcrumb from "../../../../../../../components/pages/PageWithBreadcrumb";
import { getFrameworkDetails } from "../lib/getFrameworkDetails";
interface PageProps {
	params: Promise<{
		frameworkInstanceId: string;
	}>;
}

export default async function FrameworkPage({ params }: PageProps) {
	const { frameworkInstanceId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/");
	}

	const organizationId = session.session.activeOrganizationId;

	if (!organizationId) {
		redirect("/");
	}

	const frameworkInstanceWithControls =
		await getSingleFrameworkInstanceWithControls({
			organizationId,
			frameworkInstanceId,
		});

	if (!frameworkInstanceWithControls) {
		redirect("/");
	}

	const framework = getFrameworkDetails(
		frameworkInstanceWithControls.frameworkId,
	).name;

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{ label: "Frameworks", href: `/${organizationId}/frameworks` },
				{ label: framework, current: true },
			]}
		>
			<div className="flex flex-col gap-6">
				<FrameworkOverview
					frameworkInstanceWithControls={frameworkInstanceWithControls}
				/>
				<FrameworkRequirements
					frameworkId={frameworkInstanceWithControls.frameworkId}
					frameworkInstanceWithControls={frameworkInstanceWithControls}
				/>
			</div>
		</PageWithBreadcrumb>
	);
}
