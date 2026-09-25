'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ChevronDown, Leaf, Truck, Wallet, ShieldCheck, MessageCircle, Instagram } from 'lucide-react';
import type { Category, Collection, Product, Testimonial, BlogPost } from '@/lib/types';
import { useApp } from '@/components/shared/Providers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductImage, BottleArt } from '@/components/shared/ProductImage';
import { Price, SectionHead, Stars } from '@/components/shared/Bits';
import { optInMessage } from '@/lib/whatsapp';
import { FAQS } from '@/lib/content';
import { fmtDate, readTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function TrustStrip() {
  const { t } = useApp();
  const items = [[Leaf, t('trust.authentic')], [Truck, t('trust.shipping')], [Wallet, t('trust.cod')], [ShieldCheck, t('trust.delivery')]] as const;
  return (
    <div className="border-y border-gold-500/30 bg-surface/60">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-3 px-4 py-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map(([Icon, label]) => <li key={label} className="flex items-center justify-center gap-2 text-sm font-medium"><Icon size={18} className="text-accent" />{label}</li>)}
      </ul>
    </div>
  );
}

export function CategoryTiles({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const { t, L } = useApp();
  return (
    <section className="section">
      <SectionHead title={t('home.categories')} sub={t('home.categoriesSub')} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {categories.map((c) => (
          <Link key={c.id} href={`/shop/${c.slug}`} className="group card flex flex-col items-center p-5 text-center transition hover:-translate-y-1 hover:shadow-goldlg">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 bg-gold-500/10 text-3xl transition group-hover:scale-110" aria-hidden>{c.icon}</span>
            <h3 className="mt-3 text-lg font-semibold">{L(c.name)}</h3>
            <p className="text-xs text-mute" lang={c.name.ar ? 'ar' : undefined}>{c.name.ar} · {c.name.hi}</p>
            <p className="mt-1 text-xs text-accent">{counts[c.slug] ? t('shop.results', { n: counts[c.slug] }) : 'Coming soon'}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Bestsellers({ products }: { products: Product[] }) {
  const { t } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 320, behavior: 'smooth' });
  return (
    <section className="section">
      <SectionHead title={t('home.bestsellers')} sub={t('home.bestsellersSub')} action={
        <div className="hidden gap-2 md:flex">
          <button aria-label="Previous" className="btn-outline !p-3" onClick={() => scroll(-1)}><ArrowLeft size={16} className="rtl:rotate-180" /></button>
          <button aria-label="Next" className="btn-outline !p-3" onClick={() => scroll(1)}><ArrowRight size={16} className="rtl:rotate-180" /></button>
        </div>} />
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {products.map((p) => <div key={p.id} className="w-[70vw] max-w-[300px] shrink-0 snap-start sm:w-[280px]"><ProductCard product={p} /></div>)}
      </div>
    </section>
  );
}

export function Story() {
  const { t } = useApp();
  return (
    <section className="bg-deep pattern">
      <div className="section grid items-center gap-10 md:grid-cols-2">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-t-[999px] rounded-b-2xl border border-gold-500/50 shadow-goldlg">
          <div className="aspect-[4/5]"><BottleArt category="rose" /></div>
        </div>
        <div>
          <h2 className="h-section">{t('home.storyTitle')}</h2>
          <div className="hairline my-5 max-w-40" />
          <p className="text-lg leading-relaxed text-mute">{t('home.storyP1')}</p>
          <p className="mt-4 text-lg leading-relaxed text-mute">{t('home.storyP2')}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs">{['Made in India', 'Kannauj Craftsmanship', '100% Alcohol-Free', 'Halal Certified'].map((b) => <li key={b} className="chip">{b}</li>)}</ul>
          <Link href="/about" className="btn-outline mt-6">{t('home.storyCta')} <ArrowRight size={16} className="rtl:rotate-180" /></Link>
        </div>
      </div>
    </section>
  );
}

const Q = [
  { id: 'mood', title: 'What mood are you after?', opts: [['Calm & fresh', 'fresh'], ['Romantic & floral', 'floral'], ['Bold & regal', 'oriental'], ['Earthy & grounded', 'woody']] },
  { id: 'occasion', title: 'What is the occasion?', opts: [['Everyday', 'daily'], ['Wedding', 'wedding'], ['Festival / Eid / Diwali', 'festive'], ['Office', 'office'], ['Prayer', 'prayer']] },
  { id: 'intensity', title: 'How strong should it be?', opts: [['Soft — close to skin', 'light'], ['Balanced', 'medium'], ['Strong — statement', 'strong']] },
];
export function Quiz({ products }: { products: Product[] }) {
  const { t, L } = useApp();
  const { open } = useWhatsApp();
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const recs = useMemo(() => {
    if (step < 3) return [];
    return products.map((p) => ({ p, score: (p.fragranceFamily === ans.mood ? 3 : 0) + (p.occasions.includes(ans.occasion) ? 2 : 0) + (p.intensity === ans.intensity ? 2 : 0) + p.rating / 10 }))
      .sort((a, b) => b.score - a.score).slice(0, 3).map((x) => x.p);
  }, [step, ans, products]);
  return (
    <section className="section">
      <div className="card mx-auto max-w-3xl p-6 text-center sm:p-10">
        <h2 className="h-section">{t('home.quizTitle')}</h2>
        <p className="mx-auto mt-2 max-w-lg text-mute">{t('home.quizSub')}</p>
        {step < 3 ? (
          <div className="mt-8" key={step}>
            <p className="mb-1 text-xs text-mute">Question {step + 1} of 3</p>
            <h3 className="mb-4 text-xl font-semibold">{Q[step].title}</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {Q[step].opts.map(([label, val]) => <button key={val} className="chip !px-5 !py-2.5 !text-sm" onClick={() => { setAns({ ...ans, [Q[step].id]: val }); setStep(step + 1); }}>{label}</button>)}
            </div>
          </div>
        ) : (
          <div className="mt-8 text-start">
            <div className="grid gap-3 sm:grid-cols-3">
              {recs.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="rounded-xl border border-gold-500/30 p-3 transition hover:border-gold-500">
                  <ProductImage images={p.images} category={p.category} className="aspect-square rounded-lg" sizes="200px" />
                  <p className="mt-2 font-semibold leading-tight">{L(p.name)}</p><Price value={p.variants[0].price} className="text-sm text-accent" />
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="btn-wa" onClick={() => open(`Assalamu Alaikum! My fragrance quiz result: mood ${ans.mood}, occasion ${ans.occasion}, strength ${ans.intensity}.\nSuggested: ${recs.map((r) => r.name.en).join(', ')}.\nPlease guide me.`, { kind: 'quiz', productIds: recs.map((r) => r.id), productNames: recs.map((r) => r.name.en) })}><MessageCircle size={16} />Get recommendations on WhatsApp</button>
              <button className="btn-outline" onClick={() => { setStep(0); setAns({}); }}>Retake</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function CollectionsRow({ collections }: { collections: Collection[] }) {
  const { t, L } = useApp();
  const tones = ['amber', 'rose', 'musk', 'oud', 'sandal-khus'];
  return (
    <section className="section">
      <SectionHead title={t('home.collections')} />
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
        {collections.map((c, i) => (
          <Link key={c.id} href={`/collections/${c.slug}`} className="group card w-56 shrink-0 snap-start overflow-hidden sm:w-auto">
            <div className="aspect-[4/3] overflow-hidden transition duration-500 group-hover:scale-105"><BottleArt category={tones[i % tones.length]} /></div>
            <div className="p-4"><h3 className="font-semibold">{L(c.name)}</h3><p className="text-xs text-mute">{c.productIds.length} attars</p></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Spotlight() {
  const { t } = useApp();
  return (
    <section className="bg-charcoal-800 text-cream-100">
      <div className="section grid items-center gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="h-section text-gold-300">{t('home.spotlightTitle')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-cream-200/85">{t('home.spotlightSub')}</p>
          <div className="mt-6 flex gap-3"><Link href="/shop/bakhoor" className="btn-gold">Shop bakhoor</Link><Link href="/shop/oud" className="btn border border-gold-400/60 text-gold-300 hover:bg-gold-400/10">Shop oud</Link></div>
        </div>
        <dl className="grid gap-3 text-sm">
          {[['Bakhoor', 'Wood chips soaked in oud, rose and amber. Burn on a lit charcoal disc — never directly on flame.'], ['Oud chips', 'Raw agarwood heartwood. Warm gently on a mabkhara for a pure, smoky perfume.'], ['Moattar', 'Cloth scented over bakhoor smoke — a traditional way to perfume clothes and rooms.']].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-gold-400/30 p-4"><dt className="font-display text-lg text-gold-300">{k}</dt><dd className="mt-1 text-cream-200/80">{v}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const { t } = useApp();
  return (
    <section className="section">
      <SectionHead title={t('home.testimonials')} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <figure key={x.id} className="card flex flex-col p-6">
            <Stars value={x.rating} size={16} />
            <blockquote className="mt-3 flex-1 leading-relaxed text-ink/90">“{x.text}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500/20 font-semibold text-accent">{x.name[0]}</span>
              <span className="text-sm"><span className="block font-semibold">{x.name}</span><span className="text-mute">{x.city}{x.verified && ' · ✓ Verified buyer'}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function InstagramStrip({ handle, url }: { handle: string; url: string }) {
  const { t } = useApp();
  const cats = ['oud', 'rose', 'musk', 'amber', 'bakhoor', 'gift-sets'];
  return (
    <section className="section !py-10">
      <SectionHead title={t('home.instagram')} sub={handle} />
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {cats.map((c) => (
          <a key={c} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram: ${c}`} className="group relative block aspect-square overflow-hidden rounded-xl">
            <BottleArt category={c} className="transition duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 grid place-items-center bg-charcoal-900/50 opacity-0 transition group-hover:opacity-100"><Instagram className="text-white" /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function BlogTeaser({ posts }: { posts: BlogPost[] }) {
  const { t } = useApp();
  return (
    <section className="section">
      <SectionHead title={t('home.blog')} action={<Link href="/blog" className="btn-outline">{t('home.viewAll')}</Link>} />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group card overflow-hidden transition hover:-translate-y-1">
            <div className="aspect-[16/9] overflow-hidden bg-deep pattern"><div className="grid h-full place-items-center font-arabic text-6xl text-accent/60">ن</div></div>
            <div className="p-5"><p className="text-xs text-accent">{p.tags[0]} · {fmtDate(p.publishedAt)} · {readTime(p.content)} min</p><h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-accent">{p.title}</h3><p className="mt-2 line-clamp-2 text-sm text-mute">{p.excerpt}</p></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  const { t } = useApp();
  const { open } = useWhatsApp();
  const [phone, setPhone] = useState('');
  return (
    <section className="section">
      <div className="pattern overflow-hidden rounded-3xl border border-gold-500/40 bg-deep p-8 text-center sm:p-12">
        <h2 className="h-section">{t('home.newsletterTitle')}</h2>
        <p className="mx-auto mt-2 max-w-lg text-mute">{t('home.newsletterSub')}</p>
        <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
          <input className="input" inputMode="tel" placeholder={t('home.phone')} aria-label={t('home.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className="btn-wa shrink-0" onClick={() => open(optInMessage(phone), { kind: 'generic' })}><MessageCircle size={16} />{t('home.join')}</button>
        </div>
      </div>
    </section>
  );
}

export function FaqAccordion({ limit }: { limit?: number }) {
  const [openIdx, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-gold-500/25 rounded-2xl border border-gold-500/30 bg-surface/60">
      {FAQS.slice(0, limit).map((f, i) => (
        <div key={f.q}>
          <h3><button className="flex w-full items-center justify-between gap-4 p-5 text-start font-semibold" aria-expanded={openIdx === i} onClick={() => setOpen(openIdx === i ? null : i)}>
            {f.q}<ChevronDown size={18} className={cn('shrink-0 text-accent transition', openIdx === i && 'rotate-180')} /></button></h3>
          {openIdx === i && <p className="px-5 pb-5 leading-relaxed text-mute animate-in fade-in">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
