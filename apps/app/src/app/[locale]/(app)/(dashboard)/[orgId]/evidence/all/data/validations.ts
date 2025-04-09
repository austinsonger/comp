import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { Evidence, EvidenceStatus } from "@comp/db/types";

export const searchParamsCache = createSearchParamsCache({
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<Evidence>().withDefault([
		{ id: "name", desc: false },
	]),
	name: parseAsString.withDefault(""),
	status: parseAsArrayOf(z.nativeEnum(EvidenceStatus)).withDefault([]),
	createdAt: parseAsArrayOf(z.coerce.date()).withDefault([]),
	// advanced filter
	filters: getFiltersStateParser().withDefault([]),
	joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetEvidenceSchema = Awaited<
	ReturnType<typeof searchParamsCache.parse>
>;
