"use client";

import { useI18n } from "@/locales/client";
import type { Member, Policy, User } from "@comp/db/types";
import { Alert, AlertDescription, AlertTitle } from "@comp/ui/alert";
import { Button } from "@comp/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Icons } from "@comp/ui/icons";
import { format } from "date-fns";
import { ArchiveIcon, ArchiveRestoreIcon, PencilIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { UpdatePolicyOverview } from "../forms/policies/UpdatePolicyOverview";
import { PolicyArchiveSheet } from "./sheets/policy-archive-sheet";
import { PolicyOverviewSheet } from "./sheets/policy-overview-sheet";

export function PolicyOverview({
	policy,
	assignees,
}: {
	policy: Policy | null;
	assignees: (Member & { user: User })[];
}) {
	const t = useI18n();
	const [, setOpen] = useQueryState("policy-overview-sheet");
	const [, setArchiveOpen] = useQueryState("archive-policy-sheet");

	return (
		<div className="space-y-4">
			{policy?.isArchived && (
				<Alert>
					<div className="flex items-center gap-2">
						<ArchiveIcon className="h-4 w-4" />
						<div className="font-medium">{t("policies.archive.status")}</div>
					</div>
					<AlertDescription className="mt-1 mb-3 text-sm text-muted-foreground">
						{policy?.isArchived && (
							<>
								{t("policies.archive.archived_on")}{" "}
								{format(new Date(policy?.updatedAt ?? new Date()), "PPP")}
							</>
						)}
					</AlertDescription>
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1 mt-1 text-foreground border-border"
						onClick={() => setArchiveOpen("true")}
					>
						<ArchiveRestoreIcon className="h-3 w-3" />
						{t("policies.archive.restore_confirm")}
					</Button>
				</Alert>
			)}

			<Alert>
				<Icons.Policies className="h-4 w-4" />
				<AlertTitle>
					<div className="flex items-center justify-between gap-2">
						{policy?.name}
						<div className="flex gap-2">
							<Button
								size="icon"
								variant="ghost"
								className="m-0 p-2 size-auto"
								onClick={() => setArchiveOpen("true")}
								title={
									policy?.isArchived
										? t("policies.archive.restore_tooltip")
										: t("policies.archive.tooltip")
								}
							>
								{policy?.isArchived ? (
									<ArchiveRestoreIcon className="h-3 w-3" />
								) : (
									<ArchiveIcon className="h-3 w-3" />
								)}
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="p-2 m-0 size-auto"
								onClick={() => setOpen("true")}
								title={t("policies.edit.tooltip")}
							>
								<PencilIcon className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</AlertTitle>
				<AlertDescription className="mt-4">
					{policy?.description}
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							{t("policies.overview.title")}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{policy && (
						<UpdatePolicyOverview policy={policy} assignees={assignees} />
					)}
				</CardContent>
			</Card>

			{policy && (
				<>
					<PolicyOverviewSheet policy={policy} />
					<PolicyArchiveSheet policy={policy} />
				</>
			)}
		</div>
	);
}
