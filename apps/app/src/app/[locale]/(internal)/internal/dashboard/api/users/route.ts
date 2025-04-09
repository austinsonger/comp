import { db } from "@comp/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Types for groupBy results
// interface UsersGroupByDateResult {
// 	createdAt: Date;
// 	_count: {
// 		_all: number;
// 	};
// }
interface DailyUserCount {
	day: Date;
	count: bigint; // Prisma $queryRaw returns bigint for COUNT
}

const ANALYTICS_SECRET = process.env.ANALYTICS_SECRET;

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
			activeSessionTotal,
			last30DaysTotal,
			previous30DaysTotal,
			last30DaysByDayRaw,
		] = await Promise.all([
			db.user.count(), // All time total users
			db.user.count({
				// Active users (session not expired)
				where: { sessions: { some: { expiresAt: { gt: new Date() } } } },
			}),
			db.user.count({
				// Users created in the last 30 days
				where: { createdAt: { gte: thirtyDaysAgo } },
			}),
			db.user.count({
				// Users created between 30 and 60 days ago
				where: {
					createdAt: {
						gte: sixtyDaysAgo,
						lt: thirtyDaysAgo, // Less than thirtyDaysAgo to avoid overlap
					},
				},
			}),
			db.$queryRaw<DailyUserCount[]>`
					SELECT 
						DATE_TRUNC('day', "createdAt") as day,
						COUNT(*) as count
					FROM "User"
					WHERE "createdAt" >= ${thirtyDaysAgo}
					GROUP BY DATE_TRUNC('day', "createdAt")
					ORDER BY day ASC
				`,
		]);

		// Prepare daily data, ensuring all days in the last 30 days are present
		const last30DaysByDayMap = new Map<string, number>();
		const today = new Date();
		for (let i = 0; i < 30; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			const dateString = date.toISOString().split("T")[0];
			last30DaysByDayMap.set(dateString, 0);
		}

		for (const item of last30DaysByDayRaw) {
			const dateString = item.day.toISOString().split("T")[0];
			last30DaysByDayMap.set(dateString, Number(item.count)); // Convert bigint to number
		}

		const last30DaysByDay = Array.from(last30DaysByDayMap.entries())
			.map(([date, count]) => ({ date, count }))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort chronologically

		// Calculate percentage change
		let percentageChangeLast30Days: number | null = null;
		if (previous30DaysTotal > 0) {
			percentageChangeLast30Days =
				((last30DaysTotal - previous30DaysTotal) / previous30DaysTotal) * 100;
		} else if (last30DaysTotal > 0) {
			// If previous was 0 and current is > 0, change is infinite.
			// Representing as null, but could also be a large number or specific indicator.
			percentageChangeLast30Days = null; // Or potentially 100 if we want to show a 100% increase from 0
		} else {
			// If both are 0, change is 0%
			percentageChangeLast30Days = 0;
		}

		return NextResponse.json({
			allTimeTotal,
			last30DaysTotal,
			last30DaysByDay,
			activeSessionTotal,
			percentageChangeLast30Days,
		});
	} catch (error) {
		console.error("Error fetching user analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user analytics" },
			{ status: 500 },
		);
	}
}
