"use client";

import { usePathname } from "next/navigation";
import { SecondaryMenu } from "@comp/ui/secondary-menu";
import { useEffect, useState } from "react";

interface PathProviderProps {
	organizationId: string;
	translationBackButton: string;
	translationOverview: string;
	translationEdit: string;
}

export function PathProvider({
	organizationId,
	translationBackButton,
	translationOverview,
	translationEdit,
}: PathProviderProps) {
	const pathname = usePathname();
	const [evidenceId, setEvidenceId] = useState<string>("");

	useEffect(() => {
		const pathParts = pathname.split("/");
		const evidenceIndex = pathParts.findIndex((part) => part === "evidence");
		const id =
			evidenceIndex >= 0 && pathParts.length > evidenceIndex + 1
				? pathParts[evidenceIndex + 1]
				: "";

		// Only update if we've got a valid ID
		if (id && id !== "list") {
			setEvidenceId(id);
		}
	}, [pathname]);

	// The back button should always be visible when we're in any evidence detail page
	// This is when we have an evidence ID in the URL that's not "list"
	const showBackButton = evidenceId !== "";

	// Format paths exactly as they would appear in the URL to ensure matching works correctly
	const overviewPath = `/${organizationId}/evidence/${evidenceId}`;
	const editPath = `/${organizationId}/evidence/${evidenceId}/edit`;

	return (
		<SecondaryMenu
			items={[
				{
					path: overviewPath,
					label: translationOverview,
				},
				{
					path: editPath,
					label: translationEdit,
				},
			]}
			showBackButton={showBackButton}
			backButtonHref={`/${organizationId}/evidence/all`}
			backButtonLabel={translationBackButton}
		/>
	);
}
