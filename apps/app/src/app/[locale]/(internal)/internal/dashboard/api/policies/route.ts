import { db } from "@comp/db";
import { Prisma, PolicyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface AssigneeDetails {
	id: string;
	name: string | null;
	email: string | null;
}

interface PolicyGroupByAssigneeResult {
	assigneeId: string | null;
	_count: {
		_all: number;
	};
}

interface PolicyGroupByDateResult {
	createdAt: Date;
	_count: {
		_all: number;
	};
}

interface DailyPolicyCount {
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
			db.policy.count(),
			db.policy.count({
				where: { status: PolicyStatus.published },
			}),
			db.policy.count({ where: { status: PolicyStatus.draft } }),
			db.policy.count({
				where: {
					createdAt: {
						gte: thirtyDaysAgo,
					},
				},
			}),
			db.policy.count({
				where: {
					status: PolicyStatus.published,
					createdAt: {
						gte: thirtyDaysAgo,
					},
				},
			}),
			db.policy.count({
				where: {
					status: PolicyStatus.draft,
					createdAt: {
						gte: thirtyDaysAgo,
					},
				},
			}),
			// Group by day for chart data (last 30 days)
			db.$queryRaw<DailyPolicyCount[]>`
				SELECT 
					DATE_TRUNC('day', "createdAt") as day,
					COUNT(*) as count
				FROM "Policy"
				WHERE "createdAt" >= ${thirtyDaysAgo}
				GROUP BY DATE_TRUNC('day', "createdAt")
				ORDER BY day ASC
			`,
			db.policy.count({
				// Policies created between 30 and 60 days ago
				where: {
					createdAt: {
						gte: sixtyDaysAgo,
						lt: thirtyDaysAgo,
					},
				},
			}),
		]);

		// Prepare daily data, ensuring all days in the last 30 days are present
		const last30DaysTotalByDayMap = new Map<string, number>();
		const today = new Date();
		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const dateString = date.toISOString().split("T")[0];
			last30DaysTotalByDayMap.set(dateString, 0);
		}

		// Populate the map with actual counts from the database
		for (const item of last30DaysTotalByDayRaw) {
			// Ensure item.day is treated as UTC if it's not already
			const itemDate = new Date(item.day);
			// Adjust for potential timezone offset if item.day is local time
			const itemUtcDate = new Date(
				Date.UTC(
					itemDate.getFullYear(),
					itemDate.getMonth(),
					itemDate.getDate(),
				),
			);
			const dateString = itemUtcDate.toISOString().split("T")[0];
			if (last30DaysTotalByDayMap.has(dateString)) {
				last30DaysTotalByDayMap.set(dateString, Number(item.count)); // Convert bigint to number
			}
		}

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
		console.error("Error fetching policy analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch policy analytics" },
			{ status: 500 },
		);
	}
}
