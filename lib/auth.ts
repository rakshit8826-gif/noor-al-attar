import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const COOKIE = 'noor_admin_session';
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me');

export const signSession = () =>
  new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret());

export async function verifySession(token?: string) {
  if (!token) return false;
  try { await jwtVerify(token, secret()); return true; } catch { return false; }
}

/** For route handlers: true when the request carries a valid admin cookie. */
export async function isAdmin() {
  return verifySession(cookies().get(COOKIE)?.value);
}

// Tiny in-memory limiter (per server instance) — 5 attempts / minute / IP.
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}
