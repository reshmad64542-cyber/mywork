import { NextResponse } from 'next/server';

export function middleware(request) {
  // Disable middleware - handle auth in client components
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/analytics/:path*']
};