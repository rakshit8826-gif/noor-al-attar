'use client';
export async function api<T = unknown>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) { location.href = '/admin/login'; throw new Error('Session expired'); }
  if (!res.ok) throw new Error((json as { error?: string }).error || `Request failed (${res.status})`);
  return json as T;
}
export const list = <T,>(entity: string) => api<{ items: T[]; persistent: boolean }>(`/api/admin/${entity}`);
export const create = <T,>(entity: string, item: unknown) => api<{ item: T }>(`/api/admin/${entity}`, 'POST', item);
export const update = <T,>(entity: string, item: unknown) => api<{ item: T }>(`/api/admin/${entity}`, 'PUT', item);
export const bulkUpdate = (entity: string, ids: string[], patch: unknown) => api(`/api/admin/${entity}`, 'PUT', { ids, patch });
export const remove = (entity: string, ids: string[]) => api(`/api/admin/${entity}?ids=${ids.join(',')}`, 'DELETE');

export const getPath = (o: any, path: string) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
export function setPath<T>(o: T, path: string, v: unknown): T {
  const c: any = Array.isArray(o) ? [...(o as any)] : { ...(o as any) };
  const [h, ...rest] = path.split('.');
  c[h] = rest.length ? setPath(c[h] ?? {}, rest.join('.'), v) : v;
  return c;
}
export function download(name: string, content: string, type = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
export const toCSV = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replace(/"/g, '""')}"`;
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n');
};
