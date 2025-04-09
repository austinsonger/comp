import { AppOnboarding } from "@/components/app-onboarding";
import { getServersideSession } from "@/lib/get-session";
import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import { SecondaryMenu } from "@comp/ui/secondary-menu";
import { headers } from "next/headers";
import { cache, Suspense } from "react";
import { CreateVendorSheet } from "../components/create-vendor-sheet";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();

	const {
		session: { activeOrganizationId },
	} = await getServersideSession({
		headers: await headers(),
	});

	const orgId = activeOrganizationId;
	const overview = await getVendorOverview();
	const assignees = await getAssignees();

	if (overview?.vendors === 0) {
		return (
			<div className="max-w-[1200px] m-auto">
				<Suspense fallback={<div>Loading...</div>}>
					<div className="mt-8">
						<AppOnboarding
							title={t("app_onboarding.vendors.title")}
							description={t("app_onboarding.vendors.description")}
							cta={t("app_onboarding.vendors.cta")}
							imageSrc="/onboarding/vendor-management.webp"
							imageAlt="Vendor Management"
							sheetName="createVendorSheet"
							faqs={[
								{
									questionKey: t("app_onboarding.vendors.faqs.question_1"),
									answerKey: t("app_onboarding.vendors.faqs.answer_1"),
								},
								{
									questionKey: t("app_onboarding.vendors.faqs.question_2"),
									answerKey: t("app_onboarding.vendors.faqs.answer_2"),
								},
								{
									questionKey: t("app_onboarding.vendors.faqs.question_3"),
									answerKey: t("app_onboarding.vendors.faqs.answer_3"),
								},
							]}
						/>
						<CreateVendorSheet assignees={assignees} />
					</div>
				</Suspense>
			</div>
		);
	}

	return (
		<div className="max-w-[1200px] m-auto">
			<Suspense fallback={<div>Loading...</div>}>
				<SecondaryMenu
					items={[
						{ path: `/${orgId}/vendors`, label: t("vendors.dashboard.title") },
						{
							path: `/${orgId}/vendors/register`,
							label: t("vendors.register.title"),
						},
					]}
				/>

				<main className="mt-8">{children}</main>
			</Suspense>
		</div>
	);
}

const getAssignees = cache(async () => {
	const {
		session: { activeOrganizationId },
	} = await getServersideSession({
		headers: await headers(),
	});

	if (!activeOrganizationId) {
		return [];
	}

	const assignees = await db.member.findMany({
		where: {
			organizationId: activeOrganizationId,
			role: {
				notIn: ["employee"],
			},
		},
		include: {
			user: true,
		},
	});

	return assignees;
});

const getVendorOverview = cache(async () => {
	const {
		session: { activeOrganizationId },
	} = await getServersideSession({
		headers: await headers(),
	});

	const orgId = activeOrganizationId;

	if (!orgId) {
		return { vendors: 0 };
	}

	return await db.$transaction(async (tx) => {
		const [vendors] = await Promise.all([
			tx.vendor.count({
				where: { organizationId: orgId },
			}),
		]);

		return {
			vendors,
		};
	});
});
