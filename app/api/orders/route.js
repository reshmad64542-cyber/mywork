import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    // Prefer Authorization header from the incoming request, fall back to token cookie
    const incomingAuth = request.headers.get('authorization');
    let token = null;
    if (incomingAuth && incomingAuth.startsWith('Bearer ')) {
      token = incomingAuth.split(' ')[1];
    } else {
      const cookieHeader = request.headers.get('cookie') || '';
      // simple cookie parse for `token`
      const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('token='));
      if (match) token = match.split('=')[1];
    }

    // Debug logging to help trace why backend may return 401
    try {
      console.log('[orders proxy] incoming Authorization header:', incomingAuth ? '[present]' : '[none]');
      console.log('[orders proxy] token extracted:', token ? `[${token.slice(0,6)}...masked]` : '[none]');
    } catch (e) {
      // ignore logging errors
    }

    const url = new URL(request.url);
    const qs = url.search ? url.search : '';
    const forwardHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    // Log what we're forwarding
    try {
      console.log('[orders proxy] forwarding headers:', Object.keys(forwardHeaders));
    } catch (e) {}

    const res = await fetch(`${backendUrl}/api/orders${qs}`, {
      method: 'GET',
      headers: forwardHeaders,
    });

    console.log('[orders proxy] backend responded with status', res.status);

    const data = await res.json().catch(() => ({}));

    // Optionally log backend body shape for debugging (don't log large bodies in prod)
    try {
      console.log('[orders proxy] backend response body keys:', data && typeof data === 'object' ? Object.keys(data) : typeof data);
    } catch (e) {}

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Orders proxy error:', err);
    return NextResponse.json({ error: 'Failed to proxy orders request' }, { status: 500 });
  }
}
