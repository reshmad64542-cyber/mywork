import { NextResponse } from "next/server";
import { getPredictions } from "../../../lib/analytics";

const CACHE_HEADERS = {
  "Cache-Control": "s-maxage=300, stale-while-revalidate=900",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      dateRange: searchParams.get("dateRange") || "1y",
      category: searchParams.get("category") || "all",
    };

    const predictions = await getPredictions(filters);
    return NextResponse.json(predictions, { headers: CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch predictive analytics" },
      { status: 500 }
    );
  }
}
