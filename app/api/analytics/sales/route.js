import { NextResponse } from "next/server";
import { getSalesAnalytics } from "../../../lib/analytics";

const CACHE_HEADERS = {
  "Cache-Control": "s-maxage=120, stale-while-revalidate=600",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      dateRange: searchParams.get("dateRange") || "30d",
      category: searchParams.get("category") || "all",
    };

    const data = await getSalesAnalytics(filters);
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sales analytics" },
      { status: 500 }
    );
  }
}
