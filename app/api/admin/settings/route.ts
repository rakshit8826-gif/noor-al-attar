import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readKey, writeKey, PersistenceError } from '@/lib/store';
import { logActivity } from '@/lib/data';
import type { Settings } from '@/lib/types';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ settings: await readKey<Settings>('settings', {} as Settings) });
}
export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const s = (await req.json()) as Settings;
    await writeKey('settings', s);
    await logActivity('updated', 'settings', 'Brand settings');
    return NextResponse.json({ settings: s });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: e instanceof PersistenceError ? 503 : 500 }); }
}
