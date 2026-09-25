'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Category, Collection, Product } from '@/lib/types';
import { list, create, update, remove, getPath, setPath } from '@/lib/adminApi';
import { slugify, discountPct } from '@/lib/format';
import { Confirm, ImageInput, PageTitle, Toggle, Skeleton } from './Bits';
import { ProductCard } from '@/components/product/ProductCard';

export const blankProduct = (): Product => ({
  id: '', slug: '', name: { en: '', ar: '', hi: '' }, sku: '', category: '', collections: [], tags: [],
  shortDescription: { en: '', ar: '', hi: '' }, longDescription: { en: '', ar: '', hi: '' }, fragranceFamily: 'oriental', gender: 'unisex', occasions: [], intensity: 'medium',
  notes: { top: [], heart: [], base: [] }, variants: [{ size: '12ml', price: 999, mrp: 1199, stock: 10 }], currency: 'INR', images: [],
  seo: { title: '', description: '' }, status: 'draft', featured: false, bestseller: false, giftWrapAvailable: true, codAvailable: true, rating: 4.8, reviewCount: 0, createdAt: '', updatedAt: '',
});
const TAGS = ['bestseller', 'new', 'limited', 'festive'], OCC = ['daily', 'wedding', 'festive', 'office', 'prayer'];
const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="card !bg-surface p-5"><h2 className="mb-4 text-lg font-bold">{title}</h2><div className="grid gap-4 sm:grid-cols-2">{children}</div></section>
);
const Row = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => <div className={full ? 'sm:col-span-2' : ''}><label className="label">{label}</label>{children}</div>;

export function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const [p, setP] = useState<Product | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [cols, setCols] = useState<Collection[]>([]);
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, co] = await Promise.all([list<Category>('categories'), list<Collection>('collections')]);
      setCats(c.items); setCols(co.items);
      if (id) {
        const all = (await list<Product>('products')).items;
        const found = all.find((x) => x.id === id);
        if (!found) { toast.error('Product not found'); router.push('/admin/products'); return; }
        setP(found);
      } else {
        const draft = localStorage.getItem('noor-draft-new');
        const base = blankProduct(); base.category = c.items[0]?.slug ?? '';
        setP(draft ? JSON.parse(draft) : base);
        if (draft) toast('Restored your unsaved draft');
      }
    })().catch((e) => toast.error(e.message));
  }, [id, router]);

  // Auto-save the "new product" draft locally every 30s
  useEffect(() => {
    if (id || !p) return;
    const t = setInterval(() => localStorage.setItem('noor-draft-new', JSON.stringify(p)), 30000);
    return () => clearInterval(t);
  }, [id, p]);

  const save = async (status?: 'draft' | 'published') => {
    if (!p) return;
    const out: Product = { ...p, status: status ?? p.status, slug: p.slug || slugify(p.name.en) };
    if (!out.name.en.trim()) return toast.error('Name (EN) is required');
    if (!out.category) return toast.error('Choose a category');
    if (!out.variants.length) return toast.error('Add at least one size');
    setSaving(true);
    try {
      if (id) { await update('products', out); toast.success(out.status === 'published' ? 'Published' : 'Saved as draft'); setP(out); }
      else { await create('products', out); localStorage.removeItem('noor-draft-new'); toast.success(out.status === 'published' ? 'Published — live on /shop' : 'Saved as draft'); router.push('/admin/products'); }
    } catch (e) { toast.error((e as Error).message); }
    setSaving(false);
  };
  // Cmd/Ctrl+S saves
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  });

  if (!p) return <Skeleton rows={8} />;
  const s = (path: string, v: unknown) => setP((cur) => setPath(cur!, path, v));
  const toggleIn = (path: string, val: string) => { const arr: string[] = getPath(p, path); s(path, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]); };
  const moveImg = (i: number, d: number) => { const a = [...p.images]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; s('images', a); };
  const duplicate = async () => {
    try { await create('products', { ...p, id: '', name: { ...p.name, en: `${p.name.en} (copy)` }, slug: `${p.slug}-copy-${Date.now().toString(36).slice(-3)}`, status: 'draft' }); toast.success('Duplicated as draft'); router.push('/admin/products'); } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div>
      <PageTitle title={id ? `Edit: ${p.name.en}` : 'Add product'} sub="⌘/Ctrl + S to save">
        {id && <button className="btn-outline !py-2" onClick={duplicate}><Copy size={15} />Duplicate</button>}
        {id && <button className="btn-danger !py-2" onClick={() => setDel(true)}><Trash2 size={15} />Delete</button>}
        <button className="btn-outline !py-2" disabled={saving} onClick={() => save('draft')}>Save as draft</button>
        <button className="btn-gold !py-2" disabled={saving} onClick={() => save('published')}>{saving ? 'Saving…' : 'Publish'}</button>
      </PageTitle>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <Section title="Basics">
            <Row label="Name (EN) *"><input className="input" value={p.name.en} onChange={(e) => { s('name.en', e.target.value); if (!id) s('slug', slugify(e.target.value)); }} /></Row>
            <Row label="Name (AR)"><input className="input font-arabic text-lg" dir="rtl" value={p.name.ar ?? ''} onChange={(e) => s('name.ar', e.target.value)} /></Row>
            <Row label="Name (HI)"><input className="input" value={p.name.hi ?? ''} onChange={(e) => s('name.hi', e.target.value)} /></Row>
            <Row label="Slug"><input className="input" value={p.slug} onChange={(e) => s('slug', slugify(e.target.value))} /></Row>
            <Row label="SKU"><input className="input" value={p.sku ?? ''} onChange={(e) => s('sku', e.target.value)} /></Row>
            <Row label="Category *"><select className="input" value={p.category} onChange={(e) => s('category', e.target.value)}>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name.en}</option>)}</select></Row>
            <Row label="Tags" full><div className="flex flex-wrap gap-2">{TAGS.map((t) => <button type="button" key={t} aria-pressed={p.tags.includes(t)} onClick={() => toggleIn('tags', t)} className={`chip capitalize ${p.tags.includes(t) ? 'chip-on' : ''}`}>{t}</button>)}</div></Row>
            <Row label="Collections" full><div className="flex flex-wrap gap-2">{cols.map((c) => <button type="button" key={c.id} aria-pressed={p.collections.includes(c.slug)} onClick={() => toggleIn('collections', c.slug)} className={`chip ${p.collections.includes(c.slug) ? 'chip-on' : ''}`}>{c.name.en}</button>)}</div></Row>
          </Section>

          <Section title="Descriptions">
            <Row label={`Short description (${p.shortDescription.en.length}/160) — shown on cards`} full><textarea maxLength={160} className="input min-h-20" value={p.shortDescription.en} onChange={(e) => s('shortDescription.en', e.target.value)} /></Row>
            <Row label="Long description (EN)" full><textarea className="input min-h-36" value={p.longDescription.en} onChange={(e) => s('longDescription.en', e.target.value)} /></Row>
            <Row label="Long description (AR)" full><textarea dir="rtl" className="input min-h-24" value={p.longDescription.ar ?? ''} onChange={(e) => s('longDescription.ar', e.target.value)} /></Row>
            <Row label="Long description (HI)" full><textarea className="input min-h-24" value={p.longDescription.hi ?? ''} onChange={(e) => s('longDescription.hi', e.target.value)} /></Row>
          </Section>

          <Section title="Fragrance">
            <Row label="Family"><select className="input" value={p.fragranceFamily} onChange={(e) => s('fragranceFamily', e.target.value)}>{['floral', 'woody', 'oriental', 'fresh', 'gourmand'].map((x) => <option key={x}>{x}</option>)}</select></Row>
            <Row label="Gender"><select className="input" value={p.gender} onChange={(e) => s('gender', e.target.value)}>{['men', 'women', 'unisex'].map((x) => <option key={x}>{x}</option>)}</select></Row>
            <Row label="Strength (used by the quiz)"><select className="input" value={p.intensity} onChange={(e) => s('intensity', e.target.value)}>{['light', 'medium', 'strong'].map((x) => <option key={x}>{x}</option>)}</select></Row>
            <Row label="Occasions"><div className="flex flex-wrap gap-2">{OCC.map((o) => <button type="button" key={o} aria-pressed={p.occasions.includes(o)} onClick={() => toggleIn('occasions', o)} className={`chip capitalize ${p.occasions.includes(o) ? 'chip-on' : ''}`}>{o}</button>)}</div></Row>
            {(['top', 'heart', 'base'] as const).map((k) => <Row key={k} label={`${k[0].toUpperCase() + k.slice(1)} notes (comma separated)`}><input className="input" value={p.notes[k].join(', ')} onChange={(e) => s(`notes.${k}`, csv(e.target.value))} /></Row>)}
          </Section>

          <section className="card !bg-surface p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Sizes & prices</h2><button className="btn-outline !py-1.5" onClick={() => s('variants', [...p.variants, { size: '', price: 0, mrp: 0, stock: 0 }])}><Plus size={14} />Add size</button></div>
            <div className="space-y-2">{p.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-2 max-sm:grid-cols-2">
                {(['size', 'price', 'mrp', 'stock'] as const).map((k) => (
                  <div key={k}><label className="label capitalize">{k === 'mrp' ? 'MRP (₹)' : k === 'price' ? 'Price (₹)' : k}</label>
                    <input className="input" type={k === 'size' ? 'text' : 'number'} value={v[k]} onChange={(e) => s(`variants`, p.variants.map((x, j) => (j === i ? { ...x, [k]: k === 'size' ? e.target.value : +e.target.value } : x)))} /></div>))}
                <div className="flex items-center gap-2"><span className="text-xs text-emerald_ar">{discountPct(v.price, v.mrp) ? `${discountPct(v.price, v.mrp)}% off` : ''}</span>
                  <button aria-label="Remove size" className="btn-ghost !p-2 text-red-600" onClick={() => s('variants', p.variants.filter((_, j) => j !== i))}><Trash2 size={15} /></button></div>
              </div>))}</div>
            <p className="mt-2 text-xs text-mute">Stock 0 = out of stock for that size. Discount % is calculated automatically from MRP.</p>
          </section>

          <section className="card !bg-surface p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Images</h2><button className="btn-outline !py-1.5" onClick={() => s('images', [...p.images, { url: '', alt: '' }])}><Plus size={14} />Add image</button></div>
            {p.images.length === 0 && <p className="text-sm text-mute">No images yet — an illustrated bottle is shown until you add one. The first image is the primary.</p>}
            <div className="space-y-3">{p.images.map((im, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-gold-500/20 p-3 sm:grid-cols-[1fr_1fr_auto]">
                <ImageInput value={im.url} onChange={(v) => s('images', p.images.map((x, j) => (j === i ? { ...x, url: v } : x)))} />
                <input className="input" placeholder="Alt text (required)" aria-label="Alt text" value={im.alt} onChange={(e) => s('images', p.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
                <div className="flex items-center"><button className="btn-ghost !p-2" aria-label="Move up" onClick={() => moveImg(i, -1)}><ArrowUp size={15} /></button><button className="btn-ghost !p-2" aria-label="Move down" onClick={() => moveImg(i, 1)}><ArrowDown size={15} /></button><button className="btn-ghost !p-2 text-red-600" aria-label="Remove image" onClick={() => s('images', p.images.filter((_, j) => j !== i))}><Trash2 size={15} /></button></div>
              </div>))}</div>
          </section>

          <Section title="SEO">
            <Row label="SEO title" full><input className="input" value={p.seo.title} onChange={(e) => s('seo.title', e.target.value)} /></Row>
            <Row label="SEO description" full><textarea className="input min-h-20" value={p.seo.description} onChange={(e) => s('seo.description', e.target.value)} /></Row>
          </Section>

          <Section title="Visibility & options">
            {([['status', 'Published (visible on the site)'], ['featured', 'Featured on homepage'], ['bestseller', 'Bestseller'], ['giftWrapAvailable', 'Gift wrap available'], ['codAvailable', 'COD available']] as const).map(([k, l]) => (
              <div key={k} className="flex items-center justify-between rounded-xl border border-gold-500/20 p-3"><span className="text-sm">{l}</span>
                <Toggle label={l} checked={k === 'status' ? p.status === 'published' : (p[k] as boolean)} onChange={(v) => (k === 'status' ? s('status', v ? 'published' : 'draft') : s(k, v))} /></div>))}
          </Section>
        </div>

        <aside className="hidden xl:block"><div className="sticky top-20"><p className="label">Live preview</p>
          <ProductCard product={{ ...p, name: { ...p.name, en: p.name.en || 'Product name' } }} /></div></aside>
      </div>
      {del && <Confirm title="Delete product?" message="This removes the product from the storefront." requireText={p.name.en} onConfirm={async () => { try { await remove('products', [p.id]); toast.success('Deleted'); router.push('/admin/products'); } catch (e) { toast.error((e as Error).message); } }} onClose={() => setDel(false)} />}
    </div>
  );
}
