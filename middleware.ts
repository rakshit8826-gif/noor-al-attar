import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, COOKIE } from '@/lib/auth';

// Protects /admin/* (except /admin/login) and /api/admin/*
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();
  const ok = await verifySession(req.cookies.get(COOKIE)?.value);
  if (ok) return NextResponse.next();
  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload'] };
