import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { Policy, PolicyStatus } from "@comp/db/types";

export const searchParamsCache = createSearchParamsCache({
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<Policy>().withDefault([
		{ id: "name", desc: false },
	]),
	name: parseAsString.withDefault(""),
	status: parseAsArrayOf(z.nativeEnum(PolicyStatus)).withDefault([]),
	createdAt: parseAsArrayOf(z.coerce.date()).withDefault([]),
	// advanced filter
	filters: getFiltersStateParser().withDefault([]),
	joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetPolicySchema = Awaited<
	ReturnType<typeof searchParamsCache.parse>
>;
