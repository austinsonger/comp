"use client";

import { useI18n } from "@/locales/client";
import type { User, TaskStatus } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterToolbarProps {
	isEmpty: boolean;
	users: User[];
}

export function FilterToolbar({ isEmpty, users }: FilterToolbarProps) {
	const t = useI18n();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const search = searchParams.get("search") ?? "";
	const status = searchParams.get("status") as TaskStatus | null;
	const assigneeId = searchParams.get("assigneeId");

	const hasFilters = !!(search || status || assigneeId);

	function handleSearch(value: string) {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set("search", value);
		} else {
			params.delete("search");
		}
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	}

	function handleStatusChange(value: string) {
		const params = new URLSearchParams(searchParams);
		if (value === "all") {
			params.delete("status");
		} else {
			params.set("status", value);
		}
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	}

	function handleAssigneeChange(value: string) {
		const params = new URLSearchParams(searchParams);
		if (value === "all") {
			params.delete("assigneeId");
		} else {
			params.set("assigneeId", value);
		}
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	}

	function handleClearFilters() {
		router.push(pathname);
	}

	return (
		<div className="flex flex-col gap-4 mb-4">
			<div className="flex flex-col sm:flex-row gap-4">
				<Input
					placeholder={t("vendors.tasks.filters.search")}
					value={search}
					onChange={(e) => handleSearch(e.target.value)}
					className="max-w-sm"
				/>
				<div className="flex gap-4">
					<Select value={status ?? "all"} onValueChange={handleStatusChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t("vendors.tasks.filters.status")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								{t("vendors.tasks.filters.all_statuses")}
							</SelectItem>
							<SelectItem value="not_started">
								{t("vendors.tasks.filters.not_started")}
							</SelectItem>
							<SelectItem value="in_progress">
								{t("vendors.tasks.filters.in_progress")}
							</SelectItem>
							<SelectItem value="completed">
								{t("vendors.tasks.filters.completed")}
							</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={assigneeId ?? "all"}
						onValueChange={handleAssigneeChange}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t("vendors.tasks.filters.assignee")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								{t("vendors.tasks.filters.all_assignees")}
							</SelectItem>
							{users.map((user) => (
								<SelectItem key={user.id} value={user.id}>
									{user.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			{hasFilters && !isEmpty && (
				<div className="flex justify-end">
					<Button
						variant="outline"
						onClick={handleClearFilters}
						className="gap-2"
					>
						<XIcon className="h-4 w-4" />
						{t("vendors.tasks.filters.clear")}
					</Button>
				</div>
			)}
		</div>
	);
}
