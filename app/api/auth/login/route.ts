import { NextResponse } from 'next/server';
import { COOKIE, signSession, rateLimited } from '@/lib/auth';
import { timingSafeEqual } from 'crypto';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD is not set on the server.' }, { status: 500 });
  const { password = '' } = (await req.json().catch(() => ({}))) as { password?: string };
  const a = Buffer.from(String(password)), b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
