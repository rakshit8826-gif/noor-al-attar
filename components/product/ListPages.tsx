'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, MessageCircle, Printer, Share2, X, ShoppingBag, Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { Coupon, Product } from '@/lib/types';
import { useApp } from '@/components/shared/Providers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { ProductImage, BottleArt } from '@/components/shared/ProductImage';
import { Price, Stars } from '@/components/shared/Bits';
import { ProductGrid } from './ProductCard';
import { useCart, useWishlist, useCompare, useHydrated } from '@/lib/stores';
import { cartMessage, productMessage } from '@/lib/whatsapp';
import { formatINR } from '@/lib/format';
import { defaultVariant } from '@/lib/product';

const Empty = ({ icon, title, cta = '/shop', label }: { icon: React.ReactNode; title: string; cta?: string; label: string }) => (
  <div className="section grid place-items-center text-center">
    <div className="h-44 w-36 overflow-hidden rounded-t-full opacity-90"><BottleArt category="musk" /></div>
    <div className="mt-4 text-accent">{icon}</div>
    <h1 className="mt-2 text-2xl font-bold">{title}</h1>
    <Link href={cta} className="btn-gold mt-5">{label}</Link>
  </div>
);

export function CartView({ coupons }: { coupons: Coupon[] }) {
  const { t, L, settings } = useApp();
  const { open } = useWhatsApp();
  const hydrated = useHydrated();
  const { items, coupon, giftWrap, giftNote, setQty, remove, setCoupon, setGift, clear } = useCart();
  const [code, setCode] = useState('');
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const applied = coupons.find((c) => c.code === coupon);
  const valid = applied && applied.active && subtotal >= applied.minOrder && (!applied.expiry || new Date(applied.expiry + 'T23:59:59') >= new Date());
  const discount = valid ? Math.min(subtotal, applied!.type === 'percent' ? Math.round((subtotal * applied!.value) / 100) : applied!.value) : 0;
  const threshold = settings.shipping?.freeThreshold ?? 1499;
  const shipping = !items.length || subtotal - discount >= threshold ? 0 : settings.shipping?.flatRate ?? 79;
  const total = subtotal - discount + shipping;

  if (!hydrated) return <div className="section"><div className="skeleton h-64" /></div>;
  if (!items.length) return <Empty icon={<ShoppingBag size={28} />} title={t('cart.empty')} label={t('cart.continue')} />;

  const applyCode = () => {
    const c = coupons.find((x) => x.code === code.trim().toUpperCase());
    if (!c || !c.active) return toast.error('That code is not valid.');
    if (subtotal < c.minOrder) return toast.error(`Add ${formatINR(c.minOrder - subtotal)} more to use ${c.code}.`);
    setCoupon(c.code); toast.success(`${c.code} added`);
  };
  const send = () => open(
    cartMessage(items.map((i) => ({ name: i.name.en, slug: i.slug, size: i.size, price: i.price, qty: i.qty })), { subtotal, shipping, discount, total, coupon: coupon || undefined, giftWrap, giftNote }),
    { kind: 'cart', productIds: items.map((i) => i.productId), productNames: items.map((i) => i.name.en), cartValue: total });

  return (
    <div className="section !pt-8">
      <h1 className="mb-6 text-3xl font-bold">{t('cart.title')}</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.key} className="card flex gap-4 p-3">
              <Link href={`/product/${i.slug}`} className="w-24 shrink-0"><ProductImage images={i.image ? [{ url: i.image, alt: '' }] : []} category={i.category} className="aspect-[4/5] rounded-xl" sizes="96px" /></Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${i.slug}`} className="font-display text-lg font-semibold">{L(i.name)}</Link>
                <p className="text-sm text-mute">{i.size}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="inline-flex items-center rounded-full border border-gold-500/40">
                    <button aria-label="Decrease" className="p-2" onClick={() => setQty(i.key, i.qty - 1)}><Minus size={14} /></button>
                    <span className="w-7 text-center text-sm font-semibold">{i.qty}</span>
                    <button aria-label="Increase" className="p-2" onClick={() => setQty(i.key, i.qty + 1)}><Plus size={14} /></button>
                  </div>
                  <Price value={i.price * i.qty} className="font-semibold text-accent" />
                  <button aria-label={t('cart.remove')} className="p-2 text-mute hover:text-red-600" onClick={() => remove(i.key)}><Trash2 size={16} /></button>
                </div>
              </div>
            </li>
          ))}
          <li><button className="text-sm text-mute underline" onClick={clear}>Clear cart</button></li>
        </ul>

        <aside className="card h-fit space-y-4 p-5 lg:sticky lg:top-24">
          <div className="flex gap-2">
            <input className="input uppercase" placeholder={t('cart.coupon')} aria-label={t('cart.coupon')} value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn-outline" onClick={applyCode}>{t('cart.apply')}</button>
          </div>
          {coupon && <p className="flex items-center justify-between text-sm">🔖 {coupon} {valid ? '✓' : '(minimum not met)'}<button aria-label="Remove coupon" onClick={() => setCoupon('')}><X size={14} /></button></p>}
          <p className="text-xs text-mute">{t('cart.couponNote')}</p>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-gold-600" checked={giftWrap} onChange={(e) => setGift(e.target.checked)} />🎁 {t('product.giftWrap')}</label>
          {giftWrap && <input className="input" placeholder={t('product.giftNote')} maxLength={140} value={giftNote} onChange={(e) => setGift(true, e.target.value)} />}
          <dl className="space-y-1.5 border-t border-gold-500/30 pt-4 text-sm">
            <div className="flex justify-between"><dt>{t('cart.subtotal')}</dt><dd><Price value={subtotal} /></dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald_ar"><dt>Discount ({coupon})</dt><dd>−<Price value={discount} /></dd></div>}
            <div className="flex justify-between"><dt>{t('cart.shipping')}</dt><dd>{shipping ? <Price value={shipping} /> : t('cart.free')}</dd></div>
            {shipping > 0 && <p className="text-xs text-mute">Add {formatINR(threshold - (subtotal - discount))} more for free shipping.</p>}
            <div className="flex justify-between border-t border-gold-500/30 pt-3 text-lg font-bold"><dt>{t('cart.total')}</dt><dd className="text-accent"><Price value={total} /></dd></div>
          </dl>
          <button className="btn-wa w-full !py-4 text-base" onClick={send}><MessageCircle size={18} />{t('cart.send')}</button>
          <button className="btn-outline w-full" onClick={() => window.print()}><Printer size={16} />{t('cart.print')}</button>
          <p className="text-xs text-mute">{t('cart.tip')}</p>
        </aside>
      </div>

      {/* Print-only invoice the customer can share on WhatsApp */}
      <div id="invoice" className="hidden print:block">
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{settings.brand?.name?.en} — Order summary</h1>
        <p>{settings.business?.legalName} · GSTIN {settings.business?.gstin} · {new Date().toLocaleDateString('en-IN')}</p>
        <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
          <thead><tr>{['Item', 'Size', 'Qty', 'Amount'].map((h) => <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: 6 }}>{h}</th>)}</tr></thead>
          <tbody>{items.map((i) => <tr key={i.key}><td style={{ padding: 6 }}>{i.name.en}</td><td>{i.size}</td><td>{i.qty}</td><td>{formatINR(i.price * i.qty)}</td></tr>)}</tbody>
        </table>
        <p style={{ marginTop: 12 }}>Subtotal {formatINR(subtotal)} · Discount {formatINR(discount)} · Shipping {formatINR(shipping)}</p>
        <p style={{ fontWeight: 700 }}>Estimated total: {formatINR(total)} (final amount confirmed on WhatsApp)</p>
      </div>
    </div>
  );
}

export function WishlistView({ products }: { products: Product[] }) {
  const { t } = useApp();
  const { open } = useWhatsApp();
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const [shared, setShared] = useState<string[]>([]);
  useEffect(() => { const p = new URLSearchParams(location.search).get('ids'); if (p) setShared(p.split(',')); }, []);
  const list = (shared.length ? shared : ids).map((i) => products.find((p) => p.id === i)).filter(Boolean) as Product[];
  if (!hydrated) return <div className="section"><div className="skeleton h-64" /></div>;
  if (!list.length) return <Empty icon={<Heart size={28} />} title={t('common.wishlistEmpty')} label={t('cart.continue')} />;
  const share = async () => {
    const url = `${location.origin}/wishlist?ids=${ids.join(',')}`;
    try { if (navigator.share) await navigator.share({ title: 'My Noor Al Attar wishlist', url }); else { await navigator.clipboard.writeText(url); toast('Wishlist link copied'); } } catch {}
  };
  return (
    <div className="section !pt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-bold">{shared.length ? 'Shared wishlist' : t('nav.wishlist')}</h1>{!shared.length && <button className="btn-outline" onClick={share}><Share2 size={16} />Share wishlist</button>}</div>
      <ProductGrid products={list} />
      <div className="mt-6 flex flex-wrap gap-2">
        <button className="btn-wa" onClick={() => open(`I'd like to order from my wishlist:\n${list.map((p, i) => `${i + 1}. ${p.name.en} (${defaultVariant(p).size} — ${formatINR(defaultVariant(p).price)})`).join('\n')}\n\nName: \nCity: \nPIN: `, { kind: 'cart', productIds: list.map((p) => p.id), productNames: list.map((p) => p.name.en) })}><MessageCircle size={16} />Order wishlist on WhatsApp</button>
        {!shared.length && <button className="btn-ghost" onClick={() => ids.forEach((i) => toggle(i))}>Clear</button>}
      </div>
    </div>
  );
}

export function CompareView({ products }: { products: Product[] }) {
  const { t, L } = useApp();
  const { open } = useWhatsApp();
  const hydrated = useHydrated();
  const { ids, toggle } = useCompare();
  const list = useMemo(() => ids.map((i) => products.find((p) => p.id === i)).filter(Boolean) as Product[], [ids, products]);
  if (!hydrated) return <div className="section"><div className="skeleton h-64" /></div>;
  if (!list.length) return <Empty icon={<span className="text-2xl">⇄</span>} title="Pick up to 3 attars to compare" label={t('hero.shop')} />;
  const rows: [string, (p: Product) => React.ReactNode][] = [
    ['Price', (p) => <Price value={defaultVariant(p).price} className="font-semibold text-accent" />],
    ['Sizes', (p) => p.variants.map((v) => v.size).join(', ')],
    ['Family', (p) => <span className="capitalize">{p.fragranceFamily}</span>], ['For', (p) => <span className="capitalize">{p.gender}</span>],
    ['Top notes', (p) => p.notes.top.join(', ')], ['Heart notes', (p) => p.notes.heart.join(', ')], ['Base notes', (p) => p.notes.base.join(', ')],
    ['Strength', (p) => <span className="capitalize">{p.intensity}</span>], ['Rating', (p) => <span className="inline-flex items-center gap-1"><Stars value={p.rating} /> {p.rating} ({p.reviewCount})</span>],
  ];
  return (
    <div className="section !pt-8">
      <h1 className="mb-6 text-3xl font-bold">{t('nav.compare')}</h1>
      <div className="overflow-x-auto rounded-2xl border border-gold-500/30">
        <table className="w-full min-w-[640px] text-sm">
          <thead><tr><th className="w-32 p-3" />{list.map((p) => (
            <th key={p.id} className="p-3 align-top"><div className="relative mx-auto w-36"><button aria-label="Remove" className="absolute end-1 top-1 z-10 rounded-full bg-surface p-1" onClick={() => toggle(p.id)}><X size={14} /></button>
              <Link href={`/product/${p.slug}`}><ProductImage images={p.images} category={p.category} className="aspect-[4/5] rounded-xl" sizes="150px" /><p className="mt-2 font-display text-base font-semibold">{L(p.name)}</p></Link></div></th>))}</tr></thead>
          <tbody>{rows.map(([label, fn]) => <tr key={label} className="border-t border-gold-500/20"><th className="p-3 text-start font-semibold text-mute">{label}</th>{list.map((p) => <td key={p.id} className="p-3 text-center">{fn(p)}</td>)}</tr>)}
            <tr className="border-t border-gold-500/20"><th /><>{list.map((p) => { const v = defaultVariant(p); return <td key={p.id} className="p-3 text-center"><button className="btn-wa !py-2" onClick={() => open(productMessage({ product: p, size: v.size, price: v.price, qty: 1 }), { kind: 'product', productIds: [p.id], productNames: [p.name.en], cartValue: v.price })}><MessageCircle size={14} />{t('product.order')}</button></td>; })}</></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
