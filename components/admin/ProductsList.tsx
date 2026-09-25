'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Copy, Download, Eye, EyeOff, Pencil, Plus, Star, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Category, Product } from '@/lib/types';
import { list, create, update, remove, bulkUpdate, api, download, toCSV } from '@/lib/adminApi';
import { ProductImage } from '@/components/shared/ProductImage';
import { Confirm, EmptyState, PageTitle, Skeleton } from './Bits';
import { formatINR } from '@/lib/format';

export function ProductsList() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [status, setStatus] = useState(''); const [sort, setSort] = useState('updated');
  const [sel, setSel] = useState<string[]>([]);
  const [del, setDel] = useState<string[] | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try { const [p, c] = await Promise.all([list<Product>('products'), list<Category>('categories')]); setItems(p.items); setCats(c.items); } catch (e) { toast.error((e as Error).message); setItems([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const r = (items ?? []).filter((p) => (!q || p.name.en.toLowerCase().includes(q.toLowerCase()) || p.sku?.toLowerCase().includes(q.toLowerCase())) && (!cat || p.category === cat) && (!status || p.status === status));
    return r.sort((a, b) => sort === 'name' ? a.name.en.localeCompare(b.name.en) : sort === 'price' ? a.variants[0].price - b.variants[0].price : +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [items, q, cat, status, sort]);

  const totalStock = (p: Product) => p.variants.reduce((n, v) => n + v.stock, 0);
  const act = async (fn: () => Promise<unknown>, ok: string) => { try { await fn(); toast.success(ok); setSel([]); await load(); } catch (e) { toast.error((e as Error).message); } };
  const toggleVis = (p: Product) => act(() => update('products', { ...p, status: p.status === 'published' ? 'draft' : 'published' }), p.status === 'published' ? 'Hidden from store' : 'Published');
  const dup = (p: Product) => act(() => create('products', { ...p, id: '', name: { ...p.name, en: `${p.name.en} (copy)` }, slug: `${p.slug}-copy-${Date.now().toString(36).slice(-3)}`, status: 'draft' }), 'Duplicated as draft');
  const importJson = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (!Array.isArray(data)) throw new Error('File must contain a JSON array of products');
      const replace = confirm(`Import ${data.length} products.\n\nOK = REPLACE all existing products\nCancel = MERGE (update by id, keep others)`);
      await api('/api/admin/products', 'POST', { bulk: data, mode: replace ? 'replace' : 'merge' });
      toast.success('Imported'); load();
    } catch (e) { toast.error((e as Error).message); }
  };
  const allSel = shown.length > 0 && shown.every((p) => sel.includes(p.id));

  return (
    <div>
      <PageTitle title="Products" sub={`${items?.length ?? 0} total`}>
        <button className="btn-outline !py-2" onClick={() => download('products.json', JSON.stringify(items, null, 2))}><Download size={15} />Export JSON</button>
        <button className="btn-outline !py-2" onClick={() => download('products.csv', toCSV((items ?? []).map((p) => ({ id: p.id, name: p.name.en, sku: p.sku, category: p.category, status: p.status, price: p.variants[0]?.price, stock: totalStock(p) }))), 'text/csv')}><Download size={15} />CSV</button>
        <button className="btn-outline !py-2" onClick={() => file.current?.click()}><Upload size={15} />Import JSON</button>
        <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
        <Link href="/admin/products/new" className="btn-gold !py-2"><Plus size={16} />Add product</Link>
      </PageTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input !w-56" placeholder="Search name or SKU" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input !w-40" aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name.en}</option>)}</select>
        <select className="input !w-36" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option><option value="published">Published</option><option value="draft">Draft</option></select>
        <select className="input !w-40" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}><option value="updated">Recently updated</option><option value="name">Name</option><option value="price">Price</option></select>
      </div>
      {sel.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-gold-500/15 p-3 text-sm"><b>{sel.length} selected</b>
          <button className="btn-outline !py-1.5" onClick={() => act(() => bulkUpdate('products', sel, { status: 'published' }), 'Published')}>Publish</button>
          <button className="btn-outline !py-1.5" onClick={() => act(() => bulkUpdate('products', sel, { status: 'draft' }), 'Unpublished')}>Unpublish</button>
          <button className="btn-outline !py-1.5" onClick={() => download('selected-products.json', JSON.stringify((items ?? []).filter((p) => sel.includes(p.id)), null, 2))}>Export</button>
          <button className="btn-danger !py-1.5" onClick={() => setDel(sel)}>Delete</button></div>)}
      {items === null ? <Skeleton rows={6} /> : shown.length === 0 ? <EmptyState text="No products match." action={<Link href="/admin/products/new" className="btn-gold">Add your first product</Link>} /> : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/30 bg-surface">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-deep text-xs text-mute"><tr>
              <th className="w-10 p-3"><input type="checkbox" aria-label="Select all" className="accent-gold-600" checked={allSel} onChange={() => setSel(allSel ? [] : shown.map((p) => p.id))} /></th>
              {['', 'Name', 'Category', 'Price', 'Stock', 'Status', '⭐'].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}<th className="p-3 text-end">Actions</th></tr></thead>
            <tbody>{shown.map((p) => (
              <tr key={p.id} className="border-t border-gold-500/15">
                <td className="p-3"><input type="checkbox" aria-label={`Select ${p.name.en}`} className="accent-gold-600" checked={sel.includes(p.id)} onChange={() => setSel(sel.includes(p.id) ? sel.filter((x) => x !== p.id) : [...sel, p.id])} /></td>
                <td className="p-2"><ProductImage images={p.images} category={p.category} className="h-12 w-10 rounded-lg" sizes="40px" /></td>
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="font-medium hover:text-accent">{p.name.en}</Link><p className="text-xs text-mute">{p.sku}</p></td>
                <td className="p-3 capitalize">{p.category.replace('-', ' ')}</td>
                <td className="p-3">{formatINR(p.variants[0]?.price ?? 0)}</td>
                <td className={`p-3 ${totalStock(p) === 0 ? 'font-semibold text-red-600' : totalStock(p) < 10 ? 'text-amber-600' : ''}`}>{totalStock(p)}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'published' ? 'bg-emerald_ar/15 text-emerald_ar' : 'bg-charcoal-700/15 text-mute'}`}>{p.status}</span></td>
                <td className="p-3"><button aria-label="Toggle featured" onClick={() => act(() => update('products', { ...p, featured: !p.featured }), 'Updated')}><Star size={16} className={p.featured ? 'fill-gold-500 text-gold-500' : 'text-mute'} /></button></td>
                <td className="p-3"><div className="flex justify-end gap-0.5">
                  <Link className="btn-ghost !p-1.5" aria-label="Edit" href={`/admin/products/${p.id}`}><Pencil size={15} /></Link>
                  <button className="btn-ghost !p-1.5" aria-label="Duplicate" onClick={() => dup(p)}><Copy size={15} /></button>
                  <button className="btn-ghost !p-1.5" aria-label={p.status === 'published' ? 'Hide' : 'Publish'} onClick={() => toggleVis(p)}>{p.status === 'published' ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                  <button className="btn-ghost !p-1.5 text-red-600" aria-label="Delete" onClick={() => setDel([p.id])}><Trash2 size={15} /></button></div></td>
              </tr>))}</tbody>
          </table>
        </div>)}
      {del && <Confirm title={`Delete ${del.length} product${del.length > 1 ? 's' : ''}?`} message="They will disappear from the storefront. Consider exporting a JSON backup first." onConfirm={() => act(() => remove('products', del), 'Deleted')} onClose={() => setDel(null)} />}
    </div>
  );
}
