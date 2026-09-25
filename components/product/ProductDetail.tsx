'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, ArrowRightLeft, Share2, Minus, Plus, MessageCircle, ShoppingBag, Truck, X, Sparkles, BellRing } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { useApp } from '@/components/shared/Providers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { ProductImage } from '@/components/shared/ProductImage';
import { Price, Stars } from '@/components/shared/Bits';
import { useCart, useWishlist, useCompare, useRecent, useHydrated } from '@/lib/stores';
import { productMessage, notifyMessage } from '@/lib/whatsapp';
import { discountPct } from '@/lib/format';
import { HOW_TO_USE } from '@/lib/content';
import { defaultVariant } from '@/lib/product';
import { cn } from '@/lib/utils';

const METRO = ['110', '400', '700', '600', '560', '500', '411', '380', '122', '201'];

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [lb, setLb] = useState(false);
  const [pos, setPos] = useState('50% 50%');
  const imgs = p.images.length ? p.images : [];
  const cur = imgs[i] ? [imgs[i]] : [];
  return (
    <div>
      <div className="zoom-origin relative cursor-zoom-in overflow-hidden rounded-2xl border border-gold-300/40" onClick={() => setLb(true)}
        onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}>
        <ProductImage images={cur} category={p.category} alt={p.name.en} className="aspect-[4/5]" sizes="(max-width:1024px) 100vw, 50vw" priority imgClassName={cn('transition-transform duration-300', zoom && 'md:scale-[1.8]')} />
        <style>{`.zoom-origin img,.zoom-origin svg{transform-origin:${pos}}`}</style>
      </div>
      {imgs.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {imgs.map((im, k) => (
            <button key={k} aria-label={`Image ${k + 1}`} onClick={() => setI(k)} className={cn('h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2', k === i ? 'border-gold-500' : 'border-transparent opacity-70')}>
              <ProductImage images={[im]} category={p.category} className="h-full w-full" sizes="64px" />
            </button>
          ))}
        </div>
      )}
      {lb && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-charcoal-900/90 p-4" role="dialog" aria-modal="true" onClick={() => setLb(false)}>
          <button aria-label="Close" className="absolute end-4 top-4 text-white"><X size={28} /></button>
          <div className="h-[80vh] w-full max-w-lg"><ProductImage images={cur} category={p.category} alt={p.name.en} className="h-full w-full rounded-2xl" sizes="100vw" /></div>
        </div>
      )}
    </div>
  );
}

function NotesPyramid({ p }: { p: Product }) {
  const { t } = useApp();
  const rows = [[t('product.top'), p.notes.top, 'w-2/5'], [t('product.heart'), p.notes.heart, 'w-3/5'], [t('product.base'), p.notes.base, 'w-full']] as const;
  return (
    <div className="mx-auto max-w-md space-y-2 text-center">
      {rows.map(([label, notes, w], k) => (
        <div key={label} className={cn('mx-auto rounded-xl border border-gold-500/40 p-3', w)} style={{ background: `rgba(201,169,97,${0.06 + k * 0.08})` }}>
          <p className="text-xs font-semibold text-accent">{label}</p><p className="text-sm">{notes.join(' · ') || '—'}</p>
        </div>
      ))}
    </div>
  );
}

function Reviews({ p }: { p: Product }) {
  const [name, setName] = useState(''); const [text, setText] = useState(''); const [rating, setRating] = useState(5);
  const [mine, setMine] = useState<{ name: string; text: string; rating: number }[]>([]);
  useEffect(() => { try { setMine(JSON.parse(localStorage.getItem(`noor-rev-${p.id}`) || '[]')); } catch {} }, [p.id]);
  // Approximate star distribution derived from the average rating
  const dist = useMemo(() => { const r = p.rating; const w = [1, 2, 3, 4, 5].map((s) => Math.exp(-Math.pow(s - r - 0.35, 2) / 0.9)); const sum = w.reduce((a, b) => a + b, 0); return w.map((x) => Math.round((x / sum) * 100)).reverse(); }, [p.rating]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!name || !text) return;
    const next = [{ name, text, rating }, ...mine]; setMine(next); localStorage.setItem(`noor-rev-${p.id}`, JSON.stringify(next));
    setName(''); setText(''); toast.success('Shukriya! Your review is saved on this device.');
  };
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div className="flex items-end gap-3"><span className="font-display text-5xl font-bold">{p.rating}</span><div><Stars value={p.rating} size={18} /><p className="text-sm text-mute">{p.reviewCount} ratings</p></div></div>
        <div className="mt-4 space-y-1.5">{dist.map((d, k) => (
          <div key={k} className="flex items-center gap-2 text-xs"><span className="w-6">{5 - k}★</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-deep"><div className="h-full bg-gold-500" style={{ width: `${d}%` }} /></div><span className="w-8 text-end text-mute">{d}%</span></div>))}
        </div>
        {mine.map((r, k) => <div key={k} className="mt-4 rounded-xl border border-gold-500/30 p-3"><Stars value={r.rating} /><p className="mt-1 text-sm">{r.text}</p><p className="mt-1 text-xs text-mute">— {r.name}</p></div>)}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <h3 className="font-semibold">Write a review</h3>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((s) => <button type="button" key={s} role="radio" aria-checked={rating === s} aria-label={`${s} stars`} onClick={() => setRating(s)} className="text-2xl leading-none">{s <= rating ? '★' : '☆'}</button>)}</div>
        <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="input min-h-24" placeholder="How does it wear on you?" value={text} onChange={(e) => setText(e.target.value)} required />
        <button className="btn-gold">Submit review</button>
      </form>
    </div>
  );
}

export function ProductDetail({ product: p, layerNames }: { product: Product; layerNames: { name: string; slug: string }[] }) {
  const { t, L } = useApp();
  const { open } = useWhatsApp();
  const hydrated = useHydrated();
  const [vi, setVi] = useState(() => Math.max(0, p.variants.indexOf(defaultVariant(p))));
  const [qty, setQty] = useState(1);
  const [gift, setGift] = useState(false); const [giftNote, setGiftNote] = useState('');
  const [coupon, setCoupon] = useState('');
  const [pin, setPin] = useState(''); const [pinMsg, setPinMsg] = useState('');
  const [tab, setTab] = useState('desc');
  const [sticky, setSticky] = useState(false);
  const cta = useRef<HTMLDivElement>(null);
  const v = p.variants[vi];
  const off = discountPct(v.price, v.mrp);
  const out = v.stock <= 0;
  const addCart = useCart((s) => s.add);
  const wished = useWishlist((s) => s.ids.includes(p.id)); const toggleWish = useWishlist((s) => s.toggle);
  const cmp = useCompare((s) => s.ids.includes(p.id)); const toggleCmp = useCompare((s) => s.toggle);
  const push = useRecent((s) => s.push);
  useEffect(() => push(p.id), [p.id, push]);
  useEffect(() => {
    const el = cta.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0)); io.observe(el); return () => io.disconnect();
  }, []);

  const order = () => open(productMessage({ product: p, size: v.size, price: v.price, qty, giftWrap: gift, giftNote, coupon: coupon.trim().toUpperCase() || undefined }),
    { kind: 'product', productIds: [p.id], productNames: [p.name.en], cartValue: v.price * qty });
  const share = async () => {
    const url = location.href;
    try { if (navigator.share) await navigator.share({ title: p.name.en, url }); else { await navigator.clipboard.writeText(url); toast('Link copied'); } } catch {}
  };
  const checkPin = () => {
    if (!/^[1-9]\d{5}$/.test(pin)) return setPinMsg('Please enter a valid 6-digit PIN code.');
    const metro = METRO.some((m) => pin.startsWith(m));
    const [a, b] = metro ? [2, 3] : [4, 7];
    const d = (n: number) => new Date(Date.now() + n * 864e5).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    setPinMsg(`Delivering to ${pin} between ${d(a)} and ${d(b)}. ${p.codAvailable ? 'Cash on Delivery available.' : ''}`);
  };
  const tabs = [['desc', t('product.tabDesc')], ['notes', t('product.tabNotes')], ['use', t('product.tabUse')], ['ing', t('product.tabIng')], ['ship', t('product.tabShip')], ['rev', `${t('product.tabReviews')} (${p.reviewCount})`]];

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Gallery p={p} />
        <div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{L(p.name)}</h1>
          {(p.name.ar || p.name.hi) && <p className="mt-1 text-lg text-accent"><span lang="ar" className="font-arabic text-2xl">{p.name.ar}</span>{p.name.ar && p.name.hi && ' · '}<span lang="hi">{p.name.hi}</span></p>}
          <div className="mt-2 flex items-center gap-2 text-sm"><Stars value={p.rating} size={16} /><span className="text-mute">{p.rating} · {p.reviewCount} reviews</span></div>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <Price value={v.price} className="text-3xl font-bold text-accent" />
            {off > 0 && <><Price value={v.mrp} className="text-mute line-through" /><span className="rounded-full bg-rosegold-500 px-2 py-0.5 text-xs font-semibold text-white">{off}{t('common.off')}</span></>}
          </div>
          <p className="mt-1 text-xs text-mute">{t('product.taxNote')}</p>
          <p className="mt-4 text-mute">{L(p.shortDescription)}</p>

          <fieldset className="mt-6"><legend className="mb-2 text-sm font-semibold">{t('product.size')}</legend>
            <div className="flex flex-wrap gap-2">{p.variants.map((x, k) => (
              <button key={x.size} onClick={() => setVi(k)} aria-pressed={k === vi} disabled={false}
                className={cn('rounded-full border px-4 py-2 text-sm transition', k === vi ? 'border-gold-600 bg-gold-500/20 font-semibold' : 'border-gold-500/30 hover:border-gold-500', x.stock <= 0 && 'opacity-50 line-through')}>
                {x.size} <Price value={x.price} className="ms-1 text-xs text-mute" /></button>))}
            </div>
          </fieldset>

          <p className={cn('mt-3 text-sm font-medium', out ? 'text-mute' : v.stock <= 5 ? 'text-amber-600' : 'text-emerald_ar')}>
            ● {out ? t('product.outOfStock') : v.stock <= 5 ? t('product.onlyLeft', { n: v.stock }) : t('product.inStock')}</p>

          <div className="mt-5 flex items-center gap-4">
            <div><span className="sr-only">{t('product.qty')}</span>
              <div className="inline-flex items-center rounded-full border border-gold-500/40">
                <button aria-label="Decrease" className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
                <button aria-label="Increase" className="p-3" onClick={() => setQty(Math.min(20, qty + 1))}><Plus size={16} /></button>
              </div></div>
          </div>

          {p.giftWrapAvailable && (
            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-gold-600" checked={gift} onChange={(e) => setGift(e.target.checked)} />🎁 {t('product.giftWrap')}</label>
              {gift && <input className="input mt-2" placeholder={t('product.giftNote')} maxLength={140} value={giftNote} onChange={(e) => setGiftNote(e.target.value)} />}
            </div>
          )}
          <input className="input mt-3 uppercase" placeholder={t('product.coupon')} value={coupon} onChange={(e) => setCoupon(e.target.value)} aria-label={t('product.coupon')} />

          <div ref={cta} className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            {out ? (
              <button className="btn-outline" onClick={() => open(notifyMessage(p.name.en, v.size), { kind: 'notify', productIds: [p.id], productNames: [p.name.en] })}><BellRing size={16} />{t('product.notify')}</button>
            ) : (
              <button className="btn-gold !py-4 text-base" onClick={order}><MessageCircle size={18} />{t('product.order')}</button>
            )}
            <button className="btn-outline !py-4" disabled={out} onClick={() => { addCart({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0]?.url ?? '', category: p.category, size: v.size, price: v.price, mrp: v.mrp, qty }); toast.success('Added to cart'); }}><ShoppingBag size={16} />{t('product.addCart')}</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="chip !py-2" aria-pressed={hydrated && wished} onClick={() => { toggleWish(p.id); }}><Heart size={14} className={hydrated && wished ? 'fill-rosegold-500 text-rosegold-500' : ''} />{t('product.wishlist')}</button>
            <button className="chip !py-2" aria-pressed={hydrated && cmp} onClick={() => { if (!toggleCmp(p.id)) toast('You can compare up to 3 attars'); }}><ArrowRightLeft size={14} />{t('product.compare')}</button>
            <button className="chip !py-2" onClick={share}><Share2 size={14} />{t('product.share')}</button>
          </div>

          <div className="mt-6 rounded-2xl border border-gold-500/30 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold"><Truck size={16} className="text-accent" />Delivery estimate</p>
            <div className="mt-2 flex gap-2"><input className="input" inputMode="numeric" maxLength={6} placeholder={t('product.pin')} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => e.key === 'Enter' && checkPin()} /><button className="btn-outline" onClick={checkPin}>{t('product.check')}</button></div>
            {pinMsg && <p className="mt-2 text-sm text-mute" role="status">{pinMsg}</p>}
            {p.codAvailable && <p className="mt-2 text-xs text-emerald_ar">✓ {t('product.cod')}</p>}
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-gold-500/30">
          {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('shrink-0 border-b-2 px-4 py-3 text-sm font-medium', tab === k ? 'border-gold-600 text-accent' : 'border-transparent text-mute hover:text-ink')}>{l}</button>)}
        </div>
        <div role="tabpanel" className="py-8">
          {tab === 'desc' && <p className="max-w-3xl leading-relaxed text-mute">{L(p.longDescription)}</p>}
          {tab === 'notes' && <NotesPyramid p={p} />}
          {tab === 'use' && <ol className="max-w-2xl list-decimal space-y-2 ps-5 text-mute">{HOW_TO_USE.map((h) => <li key={h}>{h}</li>)}</ol>}
          {tab === 'ing' && <p className="max-w-2xl text-mute">Natural essential oils and botanical distillates ({[...p.notes.top, ...p.notes.heart, ...p.notes.base].join(', ')}) in a base of odourless sandalwood-derived oil. 100% alcohol-free. Vegetarian, not tested on animals.</p>}
          {tab === 'ship' && <ul className="max-w-2xl list-disc space-y-2 ps-5 text-mute"><li>Free shipping above ₹1,499; otherwise a flat ₹79.</li><li>Metros 2–3 working days · Rest of India 4–7 working days.</li><li>7-day replacement for damaged or wrong items — please share an unboxing video on WhatsApp.</li><li>Opened attars cannot be returned (personal-care product).</li></ul>}
          {tab === 'rev' && <Reviews p={p} />}
        </div>
      </div>

      {layerNames.length > 0 && (
        <div className="card mt-4 flex items-start gap-3 p-5"><Sparkles className="mt-0.5 shrink-0 text-accent" />
          <div><h3 className="text-lg font-semibold">{t('product.layer')}</h3>
            <p className="text-sm text-mute">Layer {L(p.name)} with {layerNames.map((x, k) => <span key={x.slug}>{k > 0 && ' or '}<a className="text-accent underline" href={`/product/${x.slug}`}>{x.name}</a></span>)} — apply the lighter attar first, then a small dab of the stronger one on top.</p></div></div>
      )}

      {/* Sticky mobile order bar */}
      <div className={cn('fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/40 bg-page/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg transition-transform md:hidden', sticky ? 'translate-y-0' : 'translate-y-full')}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{L(p.name)}</p><Price value={v.price * qty} className="text-sm text-accent" /></div>
          {out ? <button className="btn-outline !py-2.5" onClick={() => open(notifyMessage(p.name.en, v.size))}>{t('product.notify')}</button> : <button className="btn-gold !py-2.5" onClick={order}><MessageCircle size={16} />{t('product.order')}</button>}
        </div>
      </div>
    </>
  );
}
