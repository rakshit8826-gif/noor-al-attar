import { NextResponse } from 'next/server';
import { z } from 'zod';
import { readKey, writeKey } from '@/lib/store';
import type { Inquiry } from '@/lib/types';

const schema = z.object({
  kind: z.enum(['product', 'cart', 'generic', 'quiz', 'bulk', 'notify']).default('generic'),
  productIds: z.array(z.string().max(60)).max(30).default([]), productNames: z.array(z.string().max(120)).max(30).default([]),
  cartValue: z.number().min(0).max(10_000_000).default(0), pageUrl: z.string().max(500).default(''), referrer: z.string().max(500).default(''),
});

/** Public endpoint: logs every WhatsApp click as a lead. Never fails the user's redirect. */
export async function POST(req: Request) {
  try {
    const d = schema.parse(await req.json());
    const ua = req.headers.get('user-agent') || '';
    const device = /ipad|tablet/i.test(ua) ? 'Tablet' : /mobi|android|iphone/i.test(ua) ? 'Mobile' : 'Desktop';
    const city = decodeURIComponent(req.headers.get('x-vercel-ip-city') || '');
    const item: Inquiry = { id: crypto.randomUUID(), ...d, device, city, createdAt: new Date().toISOString(), status: 'new', note: '' };
    const list = await readKey<Inquiry[]>('inquiries', []);
    list.unshift(item);
    await writeKey('inquiries', list.slice(0, 2000));
  } catch (e) { console.warn('inquiry not stored:', (e as Error).message); }
  return NextResponse.json({ ok: true }, { status: 202 });
}
