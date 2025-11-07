import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';
    const category = searchParams.get('category') || 'all';
    const location = searchParams.get('location') || 'all';

    // Forward the request to the backend
    const response = await fetch(`http://localhost:5001/api/analytics/sales?dateRange=${dateRange}&category=${category}&location=${location}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Sales analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales analytics' }, { status: 500 });
  }
}