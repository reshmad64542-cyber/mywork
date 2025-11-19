import { NextResponse } from "next/server";
import { getCustomerBehavior, getCustomerSegments } from "../../../lib/analytics";

const CACHE_HEADERS = {
  "Cache-Control": "s-maxage=180, stale-while-revalidate=600",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      dateRange: searchParams.get("dateRange") || "30d",
      category: searchParams.get("category") || "all",
    };

    const [behavior, segments] = await Promise.all([
      getCustomerBehavior(filters),
      getCustomerSegments(filters),
    ]);

    return NextResponse.json(
      {
        ...behavior,
        segments,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch customer analytics" },
      { status: 500 }
    );
  }
}
