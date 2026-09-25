/**
 * Persistence layer.
 *  - Production (Vercel): Upstash Redis / Vercel KV over its REST API (no SDK needed) when
 *    KV_REST_API_URL + KV_REST_API_TOKEN are set → admin edits are live instantly.
 *  - Local dev: reads/writes /data/*.json directly.
 *  - Vercel without KV: reads the committed JSON (read-only). Writes throw a clear error.
 * Server-only.
 */
import { promises as fs } from 'fs';
import path from 'path';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
export const hasKV = Boolean(KV_URL && KV_TOKEN);
const DATA_DIR = path.join(process.cwd(), 'data');

export class PersistenceError extends Error {}

async function readSeed<T>(key: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${key}.json`), 'utf8')) as T;
  } catch {
    return fallback;
  }
}

export async function readKey<T>(key: string, fallback: T): Promise<T> {
  if (hasKV) {
    try {
      const res = await fetch(`${KV_URL}/get/noor:${key}`, { headers: { Authorization: `Bearer ${KV_TOKEN}` }, cache: 'no-store' });
      const json = (await res.json()) as { result: string | null };
      if (json.result) return JSON.parse(json.result) as T;
    } catch (e) {
      console.error('KV read failed, using seed data', e);
    }
    return readSeed(key, fallback); // first run: KV empty → seed JSON
  }
  // Local fs: a previously written file wins; otherwise the seed
  return readSeed(key, fallback);
}

export async function writeKey<T>(key: string, value: T): Promise<void> {
  const body = JSON.stringify(value);
  if (hasKV) {
    const res = await fetch(`${KV_URL}/set/noor:${key}`, { method: 'POST', headers: { Authorization: `Bearer ${KV_TOKEN}` }, body });
    if (!res.ok) throw new PersistenceError(`KV write failed (${res.status})`);
    return;
  }
  try {
    await fs.writeFile(path.join(DATA_DIR, `${key}.json`), JSON.stringify(value, null, 2), 'utf8');
  } catch {
    throw new PersistenceError(
      'Cannot save: this deployment has no database. Add Vercel KV (Storage tab) and redeploy — see data-persistence.md.'
    );
  }
}
