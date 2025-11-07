import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';
    const category = searchParams.get('category') || 'all';
    const channel = searchParams.get('channel') || 'all';

    // Forward the request to the backend
    const response = await fetch(`http://localhost:5001/api/analytics/marketing?dateRange=${dateRange}&category=${category}&channel=${channel}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Marketing analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch marketing analytics' }, { status: 500 });
  }
}