import { db } from "@comp/db";
// No need for Prisma import if not using enums/types directly
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

// Type for the raw data fetched from the database
interface RawOrganizationData {
	createdAt: Date;
}

// Helper function to aggregate counts by date, ensuring all dates in the range are present
function aggregateCountsByDate(
	data: RawOrganizationData[],
	startDate: Date,
	endDate: Date = new Date(),
): Array<{ date: string; count: number }> {
	const counts: Record<string, number> = {};
	const start = dayjs(startDate).startOf("day");
	const end = dayjs(endDate).startOf("day");
	let current = start;

	// Initialize counts for all dates in the range with 0
	while (current.isBefore(end) || current.isSame(end)) {
		counts[current.format("YYYY-MM-DD")] = 0;
		current = current.add(1, "day");
	}

	// Increment counts based on the fetched data
	for (const item of data) {
		const dateStr = dayjs(item.createdAt).format("YYYY-MM-DD");
		if (counts[dateStr] !== undefined) {
			counts[dateStr]++;
		}
	}

	return Object.entries(counts)
		.map(([date, count]) => ({ date, count }))
		.sort((a, b) => a.date.localeCompare(b.date));
}

const ANALYTICS_SECRET = process.env.ANALYTICS_SECRET;
const TODAY = dayjs().endOf("day").toDate();
const THIRTY_DAYS_AGO = dayjs().subtract(30, "days").startOf("day").toDate();
const SIXTY_DAYS_AGO = dayjs().subtract(60, "days").startOf("day").toDate(); // Needed for comparison period

// Helper function to calculate percentage change safely
function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) {
		// Handle division by zero: If previous was 0, change is infinite or undefined.
		// Return 100% if current is positive, 0% if current is also 0.
		return current > 0 ? 100 : 0;
	}
	return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const secret = searchParams.get("secret");

	if (!ANALYTICS_SECRET || secret !== ANALYTICS_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const [
			// Count organizations created in the last 30 days
			countLast30Days,
			// Count organizations created between 60 and 30 days ago (for comparison)
			count30To60DaysAgo,
			// Fetch createdAt timestamps for the last 30 days (for daily breakdown)
			organizationsCreatedLast30DaysRaw,
			// Count all organizations regardless of creation date
			allTimeTotal,
		] = await Promise.all([
			// Query 1: Count organizations created in the last 30 days
			db.organization.count({
				where: {
					createdAt: { gte: THIRTY_DAYS_AGO },
				},
			}),
			// Query 2: Count organizations created between 60 and 30 days ago
			db.organization.count({
				where: {
					createdAt: { gte: SIXTY_DAYS_AGO, lt: THIRTY_DAYS_AGO },
				},
			}),
			// Query 3: Fetch organizations created in the last 30 days
			db.organization.findMany({
				where: {
					createdAt: { gte: THIRTY_DAYS_AGO },
				},
				select: { createdAt: true },
				orderBy: { createdAt: "asc" },
			}),
			// Query 4: Count all organizations (all-time total)
			db.organization.count(),
		]);

		// Calculate percentage change
		const changeLast30Days = calculatePercentageChange(
			countLast30Days,
			count30To60DaysAgo,
		);

		// Aggregate counts by date for the last 30 days
		const byDateLast30Days = aggregateCountsByDate(
			organizationsCreatedLast30DaysRaw,
			THIRTY_DAYS_AGO,
			TODAY,
		);

		return NextResponse.json({
			countLast30Days,
			count30To60DaysAgo,
			changeLast30Days,
			byDateLast30Days,
			allTimeTotal,
		});
	} catch (error) {
		console.error("Error fetching organizations analytics:", error);
		// Consistent error response
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
