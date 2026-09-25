'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, LayoutGrid, List, X, MessageCircle } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { useApp } from '@/components/shared/Providers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { ProductGrid } from './ProductCard';
import { BottleArt } from '@/components/shared/ProductImage';
import { formatINR } from '@/lib/format';
import { minPrice, inStock } from '@/lib/product';
import { genericMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

interface F { cats: string[]; max: number; families: string[]; genders: string[]; sizes: string[]; occasions: string[]; stock: 'all' | 'in' | 'out'; rating: number; tags: string[] }
const PAGE = 12;
const FAMILIES = ['floral', 'woody', 'oriental', 'fresh', 'gourmand'], GENDERS = ['men', 'women', 'unisex'], OCC = ['daily', 'wedding', 'festive', 'office', 'prayer'], TAGS = ['bestseller', 'new', 'limited'];
const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function ShopClient({ products, categories, initialCategory, title, intro }: { products: Product[]; categories: Category[]; initialCategory?: string; title?: string; intro?: string }) {
  const { t, L } = useApp();
  const { open } = useWhatsApp();
  const base: F = { cats: initialCategory ? [initialCategory] : [], max: 25000, families: [], genders: [], sizes: [], occasions: [], stock: 'all', rating: 0, tags: [] };
  const [f, setF] = useState<F>(base);
  const [sort, setSort] = useState('featured');
  const [list, setList] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [page, setPage] = useState(1);
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.variants.map((v) => v.size)))), [products]);
  const upd = (patch: Partial<F>) => { setF((x) => ({ ...x, ...patch })); setPage(1); };

  const shown = useMemo(() => {
    let r = products.filter((p) =>
      (!f.cats.length || f.cats.includes(p.category)) && minPrice(p) <= f.max &&
      (!f.families.length || f.families.includes(p.fragranceFamily)) && (!f.genders.length || f.genders.includes(p.gender)) &&
      (!f.sizes.length || p.variants.some((v) => f.sizes.includes(v.size))) && (!f.occasions.length || p.occasions.some((o) => f.occasions.includes(o))) &&
      (f.stock === 'all' || (f.stock === 'in') === inStock(p)) && p.rating >= f.rating && (!f.tags.length || f.tags.some((x) => p.tags.includes(x))));
    const by: Record<string, (a: Product, b: Product) => number> = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller),
      'price-asc': (a, b) => minPrice(a) - minPrice(b), 'price-desc': (a, b) => minPrice(b) - minPrice(a),
      newest: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt), rating: (a, b) => b.rating - a.rating,
    };
    return r.sort(by[sort]);
  }, [products, f, sort]);

  const chips: { label: string; clear: () => void }[] = [
    ...f.cats.map((c) => ({ label: categories.find((x) => x.slug === c)?.name.en ?? c, clear: () => upd({ cats: f.cats.filter((x) => x !== c) }) })),
    ...(f.max < 25000 ? [{ label: `≤ ${formatINR(f.max)}`, clear: () => upd({ max: 25000 }) }] : []),
    ...f.families.map((c) => ({ label: c, clear: () => upd({ families: f.families.filter((x) => x !== c) }) })),
    ...f.genders.map((c) => ({ label: c, clear: () => upd({ genders: f.genders.filter((x) => x !== c) }) })),
    ...f.sizes.map((c) => ({ label: c, clear: () => upd({ sizes: f.sizes.filter((x) => x !== c) }) })),
    ...f.occasions.map((c) => ({ label: c, clear: () => upd({ occasions: f.occasions.filter((x) => x !== c) }) })),
    ...f.tags.map((c) => ({ label: c, clear: () => upd({ tags: f.tags.filter((x) => x !== c) }) })),
    ...(f.stock !== 'all' ? [{ label: f.stock === 'in' ? 'In stock' : 'Out of stock', clear: () => upd({ stock: 'all' }) }] : []),
    ...(f.rating ? [{ label: `${f.rating}★+`, clear: () => upd({ rating: 0 }) }] : []),
  ];

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="border-b border-gold-500/20 pb-4"><legend className="mb-2 text-sm font-semibold">{title}</legend><div className="flex flex-wrap gap-1.5">{children}</div></fieldset>
  );
  const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn('chip capitalize', on && 'chip-on')}>{children}</button>
  );
  const Filters = (
    <div className="space-y-4">
      <Group title={t('shop.category')}>{categories.map((c) => <Pill key={c.id} on={f.cats.includes(c.slug)} onClick={() => upd({ cats: toggle(f.cats, c.slug) })}>{L(c.name)}</Pill>)}</Group>
      <div className="border-b border-gold-500/20 pb-4">
        <label className="mb-2 flex justify-between text-sm font-semibold" htmlFor="pr">{t('shop.price')}<span className="font-normal text-mute">≤ {formatINR(f.max)}</span></label>
        <input id="pr" type="range" min={500} max={25000} step={500} value={f.max} onChange={(e) => upd({ max: +e.target.value })} className="w-full accent-gold-600" />
      </div>
      <Group title={t('shop.family')}>{FAMILIES.map((x) => <Pill key={x} on={f.families.includes(x)} onClick={() => upd({ families: toggle(f.families, x) })}>{x}</Pill>)}</Group>
      <Group title={t('shop.gender')}>{GENDERS.map((x) => <Pill key={x} on={f.genders.includes(x)} onClick={() => upd({ genders: toggle(f.genders, x) })}>{x}</Pill>)}</Group>
      <Group title={t('shop.size')}>{allSizes.map((x) => <Pill key={x} on={f.sizes.includes(x)} onClick={() => upd({ sizes: toggle(f.sizes, x) })}>{x}</Pill>)}</Group>
      <Group title={t('shop.occasion')}>{OCC.map((x) => <Pill key={x} on={f.occasions.includes(x)} onClick={() => upd({ occasions: toggle(f.occasions, x) })}>{x}</Pill>)}</Group>
      <Group title={t('shop.availability')}>{(['all', 'in', 'out'] as const).map((x) => <Pill key={x} on={f.stock === x} onClick={() => upd({ stock: x })}>{x === 'all' ? 'All' : x === 'in' ? 'In stock' : 'Out of stock'}</Pill>)}</Group>
      <Group title={t('shop.rating')}>{[0, 4, 3].map((x) => <Pill key={x} on={f.rating === x} onClick={() => upd({ rating: x })}>{x ? `${x}★+` : 'Any'}</Pill>)}</Group>
      <Group title={t('shop.tags')}>{TAGS.map((x) => <Pill key={x} on={f.tags.includes(x)} onClick={() => upd({ tags: toggle(f.tags, x) })}>{x}</Pill>)}</Group>
    </div>
  );

  return (
    <div className="section !pt-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">{title || t('shop.title')}</h1>
        {intro && <p className="mt-2 max-w-2xl text-mute">{intro}</p>}
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pe-2">{Filters}</div></aside>
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button className="btn-outline !py-2 lg:hidden" onClick={() => setSheet(true)}><SlidersHorizontal size={16} />{t('shop.filters')}{chips.length > 0 && ` (${chips.length})`}</button>
            <p className="text-sm text-mute">{t('shop.results', { n: shown.length })}</p>
            <div className="ms-auto flex items-center gap-2">
              <label className="sr-only" htmlFor="sort">{t('shop.sort')}</label>
              <select id="sort" className="input !w-auto !py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="newest">Newest</option><option value="rating">Best rated</option>
              </select>
              <button aria-label="Grid view" aria-pressed={!list} className={cn('btn-ghost !p-2', !list && 'text-accent')} onClick={() => setList(false)}><LayoutGrid size={18} /></button>
              <button aria-label="List view" aria-pressed={list} className={cn('btn-ghost !p-2', list && 'text-accent')} onClick={() => setList(true)}><List size={18} /></button>
            </div>
          </div>
          {chips.length > 0 && (
            <div className="sticky top-16 z-10 -mx-1 mb-4 flex flex-wrap gap-1.5 bg-page/90 px-1 py-2 backdrop-blur">
              {chips.map((c) => <button key={c.label} onClick={c.clear} className="chip chip-on capitalize">{c.label}<X size={12} /></button>)}
              <button className="text-xs text-accent underline" onClick={() => { setF(base); setPage(1); }}>{t('shop.clear')}</button>
            </div>
          )}
          {shown.length ? (
            <>
              <ProductGrid products={shown.slice(0, page * PAGE)} list={list} cols="lg:grid-cols-3" />
              {shown.length > page * PAGE && <div className="mt-8 text-center"><button className="btn-outline" onClick={() => setPage(page + 1)}>{t('shop.loadMore')}</button></div>}
            </>
          ) : (
            <div className="card grid place-items-center p-10 text-center">
              <div className="h-40 w-32 overflow-hidden rounded-t-full"><BottleArt category="musk" /></div>
              <h2 className="mt-4 text-xl font-semibold">{t('shop.empty')}</h2><p className="text-mute">{t('shop.emptySub')}</p>
              <button className="btn-wa mt-4" onClick={() => open(genericMessage(), { kind: 'generic' })}><MessageCircle size={16} />WhatsApp</button>
            </div>
          )}
        </div>
      </div>
      {sheet && (
        <div className="fixed inset-0 z-[60] bg-charcoal-900/50 lg:hidden" onClick={() => setSheet(false)}>
          <div role="dialog" aria-modal="true" aria-label={t('shop.filters')} className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-page p-5 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">{t('shop.filters')}</h2><button aria-label={t('common.close')} onClick={() => setSheet(false)}><X /></button></div>
            {Filters}
            <button className="btn-gold sticky bottom-0 mt-4 w-full" onClick={() => setSheet(false)}>{t('shop.results', { n: shown.length })}</button>
          </div>
        </div>
      )}
    </div>
  );
}
export { Link };
