import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readKey, writeKey, PersistenceError, hasKV } from '@/lib/store';
import { logActivity } from '@/lib/data';

const WRITABLE = ['products', 'categories', 'collections', 'banners', 'testimonials', 'blog', 'coupons', 'inquiries'];
type Item = { id: string; slug?: string; name?: { en?: string }; title?: string; code?: string; [k: string]: unknown };
const label = (i: Item) => i.name?.en || i.title || i.code || i.id;

async function guard(entity: string) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!WRITABLE.includes(entity) && entity !== 'activity') return NextResponse.json({ error: 'Unknown entity' }, { status: 404 });
  return null;
}
const fail = (e: unknown) => NextResponse.json({ error: (e as Error).message }, { status: e instanceof PersistenceError ? 503 : 500 });
const stamp = (entity: string, item: Item, isNew: boolean) => {
  const now = new Date().toISOString();
  if (entity === 'products') { if (isNew) item.createdAt = item.createdAt || now; item.updatedAt = now; }
  return item;
};

export async function GET(_: Request, { params }: { params: { entity: string } }) {
  const g = await guard(params.entity); if (g) return g;
  return NextResponse.json({ items: await readKey<Item[]>(params.entity, []), persistent: hasKV || process.env.NODE_ENV !== 'production' });
}

/** Create one item, or bulk import: { bulk: Item[], mode: 'merge' | 'replace' } */
export async function POST(req: Request, { params }: { params: { entity: string } }) {
  const g = await guard(params.entity); if (g) return g;
  try {
    const body = (await req.json()) as Item & { bulk?: Item[]; mode?: string };
    const list = await readKey<Item[]>(params.entity, []);
    if (body.bulk) {
      const incoming = body.bulk.map((i) => stamp(params.entity, { ...i, id: i.id || crypto.randomUUID() }, true));
      const next = body.mode === 'replace' ? incoming : [...list.filter((x) => !incoming.some((i) => i.id === x.id)), ...incoming];
      await writeKey(params.entity, next);
      await logActivity(`import (${body.mode})`, params.entity, `${incoming.length} items`);
      return NextResponse.json({ items: next });
    }
    if (params.entity === 'products' && (!body.name?.en || !body.slug)) return NextResponse.json({ error: 'Name (EN) and slug are required.' }, { status: 400 });
    if (body.slug && list.some((x) => x.slug === body.slug)) return NextResponse.json({ error: `Slug "${body.slug}" is already used.` }, { status: 409 });
    const item = stamp(params.entity, { ...body, id: body.id || crypto.randomUUID().slice(0, 8) }, true);
    list.push(item);
    await writeKey(params.entity, list);
    await logActivity('created', params.entity, label(item));
    return NextResponse.json({ item });
  } catch (e) { return fail(e); }
}

/** Update one item (full object) or many: { ids: string[], patch: {...} } */
export async function PUT(req: Request, { params }: { params: { entity: string } }) {
  const g = await guard(params.entity); if (g) return g;
  try {
    const body = (await req.json()) as Item & { ids?: string[]; patch?: Partial<Item> };
    const list = await readKey<Item[]>(params.entity, []);
    if (body.ids && body.patch) {
      const next = list.map((x) => (body.ids!.includes(x.id) ? stamp(params.entity, { ...x, ...body.patch }, false) : x));
      await writeKey(params.entity, next);
      await logActivity('bulk update', params.entity, `${body.ids.length} items`);
      return NextResponse.json({ items: next });
    }
    const idx = list.findIndex((x) => x.id === body.id);
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (body.slug && list.some((x, i) => i !== idx && x.slug === body.slug)) return NextResponse.json({ error: `Slug "${body.slug}" is already used.` }, { status: 409 });
    list[idx] = stamp(params.entity, { ...list[idx], ...body }, false);
    await writeKey(params.entity, list);
    await logActivity('updated', params.entity, label(list[idx]));
    return NextResponse.json({ item: list[idx] });
  } catch (e) { return fail(e); }
}

/** DELETE ?ids=a,b,c */
export async function DELETE(req: Request, { params }: { params: { entity: string } }) {
  const g = await guard(params.entity); if (g) return g;
  try {
    const ids = (new URL(req.url).searchParams.get('ids') || '').split(',').filter(Boolean);
    const list = await readKey<Item[]>(params.entity, []);
    const removed = list.filter((x) => ids.includes(x.id));
    await writeKey(params.entity, list.filter((x) => !ids.includes(x.id)));
    await logActivity('deleted', params.entity, removed.map(label).join(', '));
    return NextResponse.json({ ok: true });
  } catch (e) { return fail(e); }
}
