"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Plus } from "lucide-react";
import { EmployeeInviteSheet } from "@/components/sheets/add-employee-sheet";

interface Props {
	hasFilters?: boolean;
}

export function NoResults({ hasFilters }: Props) {
	const router = useRouter();
	const t = useI18n();
	const { orgId } = useParams<{ orgId: string }>();

	return (
		<div className="mt-24 flex items-center justify-center">
			<div className="flex flex-col items-center">
				<Users className="mb-4 h-12 w-12 text-muted-foreground" />
				<div className="text-center mb-6 space-y-2">
					<h2 className="font-medium text-lg">
						{t("people.empty.no_results.title")}
					</h2>
					<p className="text-muted-foreground text-sm">
						{hasFilters
							? t("people.empty.no_results.description_with_filters")
							: t("people.empty.no_results.description")}
					</p>
				</div>

				{hasFilters && (
					<Button
						variant="outline"
						onClick={() => router.push(`/${orgId}/employees`)}
					>
						{t("people.actions.clear")}
					</Button>
				)}
			</div>
		</div>
	);
}

export function NoEmployees() {
	const t = useI18n();
	const [open, setOpen] = useQueryState("invite-user-sheet");

	return (
		<div className="mt-24 absolute w-full top-0 left-0 flex items-center justify-center z-20">
			<div className="text-center max-w-sm mx-auto flex flex-col items-center justify-center">
				<Users className="mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="text-xl font-medium mb-2">
					{t("people.empty.no_employees.title")}
				</h2>
				<p className="text-sm text-muted-foreground mb-6">
					{t("people.empty.no_employees.description")}
				</p>
				<Button onClick={() => setOpen("true")} className="flex">
					<Plus className="h-4 w-4 mr-2" />
					{t("people.actions.invite")}
				</Button>
			</div>

			<EmployeeInviteSheet />
		</div>
	);
}
