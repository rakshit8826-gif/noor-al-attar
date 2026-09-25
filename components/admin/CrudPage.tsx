'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { list, create, update, remove, getPath, setPath } from '@/lib/adminApi';
import { slugify } from '@/lib/format';
import { Confirm, EmptyState, ImageInput, Modal, PageTitle, Skeleton, Toggle } from './Bits';
import type { Product } from '@/lib/types';

export type Field = {
  key: string; label: string; help?: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'date' | 'image' | 'products' | 'tags' | 'l10n';
  options?: string[]; slugFrom?: string; span?: 2;
};
type Item = { id: string; [k: string]: any };
export type Column = { key: string; label: string; toggle?: boolean; render?: (i: Item) => React.ReactNode };

export function CrudPage({ entity, title, sub, fields, columns, blank, labelKey = 'name.en', ordered }: {
  entity: string; title: string; sub?: string; fields: Field[]; columns: Column[]; blank: Record<string, unknown>; labelKey?: string; ordered?: boolean;
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [persistent, setPersistent] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [del, setDel] = useState<Item | null>(null);
  const [q, setQ] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { const r = await list<Item>(entity); setItems(r.items); setPersistent(r.persistent); } catch (e) { toast.error((e as Error).message); setItems([]); }
  }, [entity]);
  useEffect(() => { load(); if (fields.some((f) => f.type === 'products')) list<Product>('products').then((r) => setProducts(r.items)).catch(() => {}); }, [load, fields]);

  const shown = useMemo(() => (items ?? []).filter((i) => !q || JSON.stringify(i).toLowerCase().includes(q.toLowerCase())).sort((a, b) => (ordered ? (a.order ?? 0) - (b.order ?? 0) : 0)), [items, q, ordered]);
  const nextOrder = () => Math.max(0, ...(items ?? []).map((i) => i.order ?? 0)) + 1;

  const save = async () => {
    if (!editing) return;
    const e = { ...editing };
    if (typeof e.code === 'string') e.code = e.code.trim().toUpperCase();
    if (fields.some((f) => f.key === 'slug') && !e.slug) e.slug = slugify(getPath(e, labelKey) || e.title || '');
    setSaving(true);
    try {
      if (isNew) await create(entity, e); else await update(entity, e);
      toast.success(isNew ? 'Created' : 'Saved'); setEditing(null); await load();
    } catch (err) { toast.error((err as Error).message); }
    setSaving(false);
  };
  const patch = async (i: Item, p: Partial<Item>) => {
    setItems((cur) => (cur ?? []).map((x) => (x.id === i.id ? { ...x, ...p } : x)));
    try { await update(entity, { ...i, ...p }); } catch (err) { toast.error((err as Error).message); load(); }
  };
  const move = async (i: Item, dir: -1 | 1) => {
    const sorted = [...shown]; const idx = sorted.findIndex((x) => x.id === i.id); const other = sorted[idx + dir]; if (!other) return;
    await patch(i, { order: other.order }); await patch(other, { order: i.order }); load();
  };
  const doDelete = async (i: Item) => {
    try { await remove(entity, [i.id]); toast.success('Deleted'); load(); } catch (err) { toast.error((err as Error).message); }
  };
  const upd = (path: string, v: unknown) => setEditing((cur) => setPath(cur!, path, v));

  const renderField = (f: Field) => {
    const v = getPath(editing, f.key);
    switch (f.type) {
      case 'textarea': return <textarea className="input min-h-28" value={v ?? ''} onChange={(e) => upd(f.key, e.target.value)} />;
      case 'number': return <input type="number" className="input" value={v ?? 0} onChange={(e) => upd(f.key, +e.target.value)} />;
      case 'checkbox': return <Toggle checked={!!v} onChange={(x) => upd(f.key, x)} label={f.label} />;
      case 'select': return <select className="input" value={v ?? ''} onChange={(e) => upd(f.key, e.target.value)}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>;
      case 'date': return <input type="datetime-local" className="input" value={v ? String(v).slice(0, 16) : ''} onChange={(e) => upd(f.key, e.target.value ? new Date(e.target.value).toISOString() : '')} />;
      case 'image': return <ImageInput value={v ?? ''} onChange={(x) => upd(f.key, x)} />;
      case 'tags': return <input className="input" placeholder="comma, separated" value={(v ?? []).join(', ')} onChange={(e) => upd(f.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />;
      case 'l10n': return (
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="input" placeholder="English" value={v?.en ?? ''} onChange={(e) => upd(`${f.key}.en`, e.target.value)} />
          <input className="input font-arabic text-lg" dir="rtl" placeholder="العربية" value={v?.ar ?? ''} onChange={(e) => upd(`${f.key}.ar`, e.target.value)} />
          <input className="input" placeholder="हिन्दी" value={v?.hi ?? ''} onChange={(e) => upd(`${f.key}.hi`, e.target.value)} />
        </div>);
      case 'products': return (
        <div className="max-h-56 overflow-y-auto rounded-xl border border-gold-500/30 p-2">
          {products.map((p) => { const on = (v ?? []).includes(p.id); return (
            <label key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gold-500/10"><input type="checkbox" className="accent-gold-600" checked={on} onChange={() => upd(f.key, on ? v.filter((x: string) => x !== p.id) : [...(v ?? []), p.id])} />{p.name.en}</label>); })}
        </div>);
      default: return <input className="input" value={v ?? ''} onChange={(e) => { upd(f.key, e.target.value); }} />;
    }
  };

  return (
    <div>
      <PageTitle title={title} sub={sub}>
        <button className="btn-gold !py-2" onClick={() => { setIsNew(true); setEditing({ ...structuredClone(blank), id: '', ...(ordered ? { order: nextOrder() } : {}) } as Item); }}><Plus size={16} />Add new</button>
      </PageTitle>
      {!persistent && <p className="mb-4 rounded-xl border border-amber-400/50 bg-amber-100/60 p-3 text-sm text-amber-900">Saving is disabled: this deployment has no database. Connect Vercel KV (see data-persistence.md).</p>}
      <div className="relative mb-4 max-w-xs"><Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-mute" /><input className="input !ps-9" placeholder="Search…" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {items === null ? <Skeleton /> : shown.length === 0 ? <EmptyState text={`No ${title.toLowerCase()} yet.`} /> : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/30 bg-surface">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-deep text-start text-xs text-mute"><tr>{columns.map((c) => <th key={c.key} className="p-3 text-start font-semibold">{c.label}</th>)}<th className="p-3 text-end">Actions</th></tr></thead>
            <tbody>{shown.map((i) => (
              <tr key={i.id} className="border-t border-gold-500/15">
                {columns.map((c) => <td key={c.key} className="p-3">{c.toggle ? <Toggle checked={!!getPath(i, c.key)} onChange={(v) => patch(i, { [c.key]: v })} label={c.label} /> : c.render ? c.render(i) : String(getPath(i, c.key) ?? '')}</td>)}
                <td className="p-3"><div className="flex justify-end gap-1">
                  {ordered && <><button className="btn-ghost !p-1.5" aria-label="Move up" onClick={() => move(i, -1)}><ArrowUp size={15} /></button><button className="btn-ghost !p-1.5" aria-label="Move down" onClick={() => move(i, 1)}><ArrowDown size={15} /></button></>}
                  <button className="btn-ghost !p-1.5" aria-label="Edit" onClick={() => { setIsNew(false); setEditing(structuredClone(i)); }}><Pencil size={15} /></button>
                  <button className="btn-ghost !p-1.5 text-red-600" aria-label="Delete" onClick={() => setDel(i)}><Trash2 size={15} /></button></div></td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
      {editing && (
        <Modal title={`${isNew ? 'Add' : 'Edit'} ${title.replace(/s$/, '').toLowerCase()}`} wide onClose={() => setEditing(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'l10n' || f.type === 'textarea' || f.type === 'products' || f.span === 2 ? 'sm:col-span-2' : ''}>
                <label className="label">{f.label}</label>{renderField(f)}{f.help && <p className="mt-1 text-xs text-mute">{f.help}</p>}
              </div>))}
          </div>
          <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button className="btn-gold" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button></div>
        </Modal>
      )}
      {del && <Confirm title="Delete this item?" message={`“${getPath(del, labelKey) || del.title || del.code}” will be removed from the site.`} onConfirm={() => doDelete(del)} onClose={() => setDel(null)} />}
    </div>
  );
}
