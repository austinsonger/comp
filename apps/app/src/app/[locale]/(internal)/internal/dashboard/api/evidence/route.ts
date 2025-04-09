import { db } from "@comp/db";
import { EvidenceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface DailyEvidenceCount {
	day: Date;
	count: bigint; // Prisma $queryRaw returns bigint for COUNT
}

const ANALYTICS_SECRET = process.env.ANALYTICS_SECRET || "dev_secret";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const secret = searchParams.get("secret");

	if (!ANALYTICS_SECRET || secret !== ANALYTICS_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const sixtyDaysAgo = new Date();
		sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

		const [
			allTimeTotal,
			allTimePublished,
			allTimeDraft,
			last30DaysTotal,
			last30DaysPublished,
			last30DaysDraft,
			last30DaysTotalByDayRaw,
			previous30DaysTotal,
		] = await Promise.all([
			db.evidence.count(),
			db.evidence.count({
				where: { status: EvidenceStatus.published },
			}),
			db.evidence.count({ where: { status: EvidenceStatus.draft } }),
			db.evidence.count({
				where: { createdAt: { gte: thirtyDaysAgo } },
			}),
			db.evidence.count({
				where: {
					createdAt: { gte: thirtyDaysAgo },
					status: EvidenceStatus.published,
				},
			}),
			db.evidence.count({
				where: {
					createdAt: { gte: thirtyDaysAgo },
					status: EvidenceStatus.draft,
				},
			}),
			// Group by day for chart data (last 30 days)
			db.$queryRaw`
				SELECT
					DATE_TRUNC('day', "createdAt")::date as day,
					COUNT(*) as count
				FROM "Evidence"
				WHERE "createdAt" >= ${thirtyDaysAgo}
				GROUP BY day
				ORDER BY day ASC
			`,
			db.evidence.count({
				// Evidence created between 30 and 60 days ago
				where: {
					createdAt: {
						gte: sixtyDaysAgo,
						lt: thirtyDaysAgo,
					},
				},
			}),
		]);

		// Process daily counts, ensuring all days in the last 30 days are present
		const last30DaysTotalByDayMap = new Map<string, number>();
		const today = new Date();
		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setUTCDate(today.getUTCDate() - i); // Use UTC to avoid timezone issues
			const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format
			last30DaysTotalByDayMap.set(dateString, 0);
		}

		// Populate the map with actual counts from the database
		for (const item of last30DaysTotalByDayRaw as DailyEvidenceCount[]) {
			const itemDate = new Date(item.day);
			const itemUtcDate = new Date(
				Date.UTC(
					itemDate.getFullYear(),
					itemDate.getMonth(),
					itemDate.getDate(),
				),
			);
			const dateString = itemUtcDate.toISOString().split("T")[0];
			if (last30DaysTotalByDayMap.has(dateString)) {
				last30DaysTotalByDayMap.set(dateString, Number(item.count));
			}
		}

		// Convert map to sorted array
		const last30DaysTotalByDay = Array.from(last30DaysTotalByDayMap.entries())
			.map(([date, count]) => ({ date, count }))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort chronologically

		// Calculate percentage change
		let percentageChangeLast30Days: number | null = null;
		if (previous30DaysTotal > 0) {
			percentageChangeLast30Days =
				((last30DaysTotal - previous30DaysTotal) / previous30DaysTotal) * 100;
		} else if (last30DaysTotal > 0) {
			percentageChangeLast30Days = null; // Indicate infinite change from 0
		} else {
			percentageChangeLast30Days = 0; // No change from 0 to 0
		}

		return NextResponse.json({
			allTimeTotal,
			allTimePublished,
			allTimeDraft,
			last30DaysTotal,
			last30DaysPublished,
			last30DaysDraft,
			last30DaysTotalByDay,
			percentageChangeLast30Days,
		});
	} catch (error) {
		console.error("Error fetching evidence analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch evidence analytics" },
			{ status: 500 },
		);
	}
}
