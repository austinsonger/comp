"use client";

import { CreateRiskSheet } from "@/components/sheets/create-risk-sheet";
import { useI18n } from "@/locales/client";
import { Departments, Member, RiskStatus, User } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { cn } from "@comp/ui/cn";
import { Input } from "@comp/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Skeleton } from "@comp/ui/skeleton";
import { Search, X } from "lucide-react";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { useCallback } from "react";

const riskStatuses = Object.values(RiskStatus);
const departments = Object.values(Departments).filter((d) => d !== "none");

type Props = {
	isEmpty?: boolean;
	users: (Member & { user: User })[];
};

const statusTranslationKeys = {
	open: "common.status.open",
	pending: "common.status.pending",
	closed: "common.status.closed",
	archived: "common.status.archived",
} as const;

export function FilterToolbar({ isEmpty, users }: Props) {
	const t = useI18n();
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useQueryState("create-risk-sheet");

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

	const [department, setDepartment] = useQueryState("department", {
		shallow: false,
		history: "push",
		parse: (value) => value || null,
	});

	const [assigneeId, setAssigneeId] = useQueryState("assigneeId", {
		shallow: false,
		history: "push",
		parse: (value) => value || null,
	});

	const handleReset = useCallback(() => {
		startTransition(() => {
			Promise.all([
				setSearch(null),
				setCategory(null),
				setStatus(null),
				setDepartment(null),
				setAssigneeId(null),
			]);
		});
	}, [setSearch, setCategory, setStatus, setDepartment, setAssigneeId]);

	const hasFilters = search || category || status || department || assigneeId;

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
		<div className="flex flex-row items-center justify-between gap-2 mb-4">
			<div className="flex flex-1 items-center gap-2 min-w-0">
				<div className="relative flex-1 md:max-w-sm">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t("common.filters.search")}
						className="pl-8"
						value={search || ""}
						onChange={(e) => setSearch(e.target.value || null)}
					/>
				</div>

				<div className="md:hidden">
					<Button onClick={() => setOpen("true")} variant="action">
						<Plus className="h-4 w-4" />
						{t("common.actions.addNew")}
					</Button>
				</div>
			</div>

			<div className="hidden md:flex items-center gap-2">
				<Select
					value={status || ""}
					onValueChange={(value) => setStatus(value || null)}
				>
					<SelectTrigger className="w-auto min-w-[100px]">
						<SelectValue placeholder={t("common.filters.status")} />
					</SelectTrigger>
					<SelectContent>
						{riskStatuses.map((stat) => (
							<SelectItem key={stat} value={stat}>
								{t(
									statusTranslationKeys[
										stat.toLowerCase() as keyof typeof statusTranslationKeys
									],
								)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={department || ""}
					onValueChange={(value) => setDepartment(value || null)}
				>
					<SelectTrigger className="w-[150px] min-w-[150px]">
						<SelectValue placeholder={t("common.filters.department")} />
					</SelectTrigger>
					<SelectContent>
						{departments.map((dept) => (
							<SelectItem key={dept} value={dept}>
								{dept.replace(/_/g, " ").toUpperCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={assigneeId || ""}
					onValueChange={(value) => setAssigneeId(value || null)}
				>
					<SelectTrigger className="w-[200px] min-w-[200px]">
						<SelectValue
							placeholder={t("common.filters.assignee.placeholder")}
						/>
					</SelectTrigger>
					<SelectContent>
						{users.map((user) => (
							<SelectItem key={user.id} value={user.id}>
								{user.user.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleReset}
						disabled={isPending}
					>
						<X className="h-4 w-4 mr-2" />
						{t("common.actions.clear")}
					</Button>
				)}

				<Button onClick={() => setOpen("true")} variant="action">
					<Plus className="h-4 w-4" />
					{t("common.actions.addNew")}
				</Button>
			</div>

			<CreateRiskSheet assignees={users} />
		</div>
	);
}
