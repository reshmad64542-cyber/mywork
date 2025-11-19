import { NextResponse } from "next/server";
import { getProductPerformance } from "../../../lib/analytics";

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

    const data = await getProductPerformance(filters);
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getProductPerformance } from "../../../lib/analytics";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      dateRange: searchParams.get("dateRange") || "30d",
      category: searchParams.get("category") || "all",
    };

    const data = await getProductPerformance(filters);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Product analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 }
    );
  }
}