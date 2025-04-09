"use client";

import { useI18n } from "@/locales/client";
import type { Member, User, Vendor } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { UpdateSecondaryFieldsForm } from "./update-secondary-fields-form";

export function SecondaryFields({
	vendor,
	assignees,
}: {
	vendor: Vendor & { assignee: { user: User | null } | null };
	assignees: (Member & { user: User })[];
}) {
	const t = useI18n();

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							{t("risk.dashboard.overview")}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<UpdateSecondaryFieldsForm vendor={vendor} assignees={assignees} />
				</CardContent>
			</Card>
		</div>
	);
}
