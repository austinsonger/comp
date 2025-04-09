"use client";

import type { FilterCategory } from "../types";

interface GetFilterCategoriesProps {
	role: string;
	setRole: (value: string | null) => void;
	setPage: (value: string) => void;
}

export function getFilterCategories({
	role,
	setRole,
	setPage,
}: GetFilterCategoriesProps): FilterCategory[] {
	return [
		{
			label: "Role",
			items: [
				{
					label: "Admin",
					value: "admin",
					checked: role === "admin",
					onChange: (checked) => {
						setRole(checked ? "admin" : null);
						setPage("1");
					},
				},
				{
					label: "Member",
					value: "member",
					checked: role === "member",
					onChange: (checked) => {
						setRole(checked ? "member" : null);
						setPage("1");
					},
				},
			],
		},
	];
}
