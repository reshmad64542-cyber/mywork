import { NextResponse } from "next/server";
import {
  getSalesAnalytics,
  getProductPerformance,
  getCustomerBehavior,
  getCustomerSegments,
  getMarketingAnalytics,
  getPredictions,
  getAvailableCategories,
} from "../../lib/analytics";

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

    const [
      categories,
      sales,
      products,
      customerBehavior,
      customerSegments,
      marketing,
      predictions,
    ] = await Promise.all([
      getAvailableCategories(),
      getSalesAnalytics(filters),
      getProductPerformance(filters),
      getCustomerBehavior(filters),
      getCustomerSegments(filters),
      getMarketingAnalytics(filters),
      getPredictions(filters),
    ]);
    
    return NextResponse.json(
      {
        filters: {
          ...filters,
          categoryOptions: categories,
        },
        sales,
        products,
        customerBehavior,
        customerSegments,
        marketing,
        predictions,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
