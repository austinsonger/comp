"use client";

import { useI18n } from "@/locales/client";
import type { Member, User } from "@comp/db/types";
import { cn } from "@comp/ui/cn";
import { Input } from "@comp/ui/input";
import { Skeleton } from "@comp/ui/skeleton";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";

type Props = {
	isEmpty?: boolean;
	assignees: (Member & { user: User })[];
};

export function FilterToolbar({ isEmpty, assignees }: Props) {
	const t = useI18n();
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useQueryState("create-task-sheet");

	const [search, setSearch] = useQueryState("search", {
		shallow: false,
		history: "push",
		parse: (value) => value || null,
	});

	const [category, setCategory] = useQueryState("category", {
		shallow: false,
		history: "push",
		parse: (value) => value || null,
	});

	const [status, setStatus] = useQueryState("status", {
		shallow: false,
		history: "push",
		parse: (value) => value || null,
	});

	const [assigneeId, setAssigneeId] = useQueryState("assigneeId", {
		shallow: false,
		history: "push",
		parse: (value) => value || null,
	});

	if (isEmpty) {
		return (
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 opacity-20 pointer-events-none blur-[7px]">
				<div className="relative flex-1 md:max-w-sm">
					<Skeleton className={cn("h-10", isEmpty && "animate-none")} />
				</div>

				<div className="md:flex gap-2 md:flex-row md:items-center hidden">
					<Skeleton
						className={cn("h-10 w-[200px]", isEmpty && "animate-none")}
					/>
					<Skeleton
						className={cn("h-10 w-[200px]", isEmpty && "animate-none")}
					/>
					<Skeleton
						className={cn("h-9 w-[120px]", isEmpty && "animate-none")}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex gap-2 flex-row items-center justify-between mb-4">
			<div className="relative flex-1 sm:max-w-sm">
				<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder={t("common.filters.search")}
					className="pl-8"
					value={search || ""}
					onChange={(e) => setSearch(e.target.value || null)}
				/>
			</div>
		</div>
	);
}
