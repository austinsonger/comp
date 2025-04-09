"use client";

import { Member } from "@comp/db/types";
import { useQueryState } from "nuqs";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { useEmployees } from "../../../hooks/useEmployees";
import { type EmployeeWithUser } from "../columns";

interface EmployeesTableContextType {
	// State
	search: string;
	setSearch: (value: string) => void;
	role: string;
	setRole: (value: string) => void;
	page: number;
	setPage: (value: number) => void;
	per_page: number;
	setPerPage: (value: number) => void;
	employees: EmployeeWithUser[];
	total: number;
	isLoading: boolean;
	isSearching: boolean;
	hasActiveFilters: boolean;

	// Actions
	clearFilters: () => void;
}

const EmployeesTableContext = createContext<
	EmployeesTableContextType | undefined
>(undefined);

export function EmployeesTableProvider({ children }: { children: ReactNode }) {
	// Local state for search with debounce
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	// Query state for filters
	const [role, setRole] = useQueryState("role");
	const [page, setPage] = useQueryState("page", { defaultValue: "1" });
	const [per_page, setPerPage] = useQueryState("per_page", {
		defaultValue: "10",
	});

	// Loading states
	const [isSearching, setIsSearching] = useState(false);
	const totalCountRef = useRef<number>(0);

	// Fetch data
	const { employees, total, isLoading, error } = useEmployees({
		search: debouncedSearch,
		role: role ?? "",
		page: Number(page),
		per_page: Number(per_page),
	});

	// Update debounced search
	useEffect(() => {
		setIsSearching(true);
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}
		searchTimeoutRef.current = setTimeout(() => {
			setDebouncedSearch(search);
			setIsSearching(false);
		}, 300);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [search]);

	// Cache total count
	useEffect(() => {
		if (total !== undefined) {
			totalCountRef.current = total;
		}
	}, [total]);

	// Clear filters
	const clearFilters = async () => {
		setSearch("");
		setRole(null);
		setPage("1");
		setPerPage("10");
	};

	// Calculate if there are active filters
	const hasActiveFilters = useMemo(() => {
		return Boolean(role);
	}, [role]);

	const value = {
		// State
		search,
		setSearch,
		role: role ?? "",
		setRole: (value: string) => setRole(value || null),
		page: Number(page),
		setPage: (value: number) => setPage(String(value)),
		per_page: Number(per_page),
		setPerPage: (value: number) => setPerPage(String(value)),
		employees,
		total: totalCountRef.current,
		isLoading,
		isSearching,
		hasActiveFilters,

		// Actions
		clearFilters,
	};

	return (
		<EmployeesTableContext.Provider value={value}>
			{children}
		</EmployeesTableContext.Provider>
	);
}

export function useEmployeesTable() {
	const context = useContext(EmployeesTableContext);
	if (!context) {
		throw new Error(
			"useEmployeesTable must be used within a EmployeesTableProvider",
		);
	}
	return context;
}
