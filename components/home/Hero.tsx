'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BottleArt } from '@/components/shared/ProductImage';
import { useApp } from '@/components/shared/Providers';
import type { Banner } from '@/lib/types';

const TONE_CAT: Record<string, string> = { amber: 'amber', rose: 'rose', oud: 'oud' };

function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => { const tick = () => setLeft(new Date(to).getTime() - Date.now()); tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, [to]);
  if (left === null || left <= 0 || left > 1000 * 3600 * 24 * 75) return null;
  const d = Math.floor(left / 864e5), h = Math.floor((left % 864e5) / 36e5), m = Math.floor((left % 36e5) / 6e4), s = Math.floor((left % 6e4) / 1e3);
  return (
    <div className="mt-5 inline-flex gap-2" role="timer" aria-label="Offer ends in">
      {[['d', d], ['h', h], ['m', m], ['s', s]].map(([l, v]) => (
        <div key={l as string} className="w-14 rounded-xl border border-gold-500/40 bg-surface/70 py-1.5 text-center">
          <div className="font-display text-xl font-bold tabular-nums">{String(v).padStart(2, '0')}</div><div className="text-[10px] text-mute">{l}</div>
        </div>
      ))}
    </div>
  );
}

export function Hero({ banners }: { banners: Banner[] }) {
  const { t, settings, locale } = useApp();
  const slides = banners.length ? banners : [{ id: 'x', title: settings.brand?.tagline?.en, subtitle: '', ctaText: t('hero.shop'), ctaLink: '/shop', tone: 'oud', endDate: '' } as Banner];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [paused, slides.length]);
  const s = slides[i % slides.length];
  const tagline = settings.brand?.tagline;
  return (
    <section className="pattern relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured offers">
      {/* Floating gold particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, k) => (
          <span key={k} className="absolute h-1.5 w-1.5 animate-float rounded-full bg-gold-400" style={{ left: `${(k * 37) % 100}%`, top: `${20 + ((k * 53) % 70)}%`, animationDelay: `${(k % 7) * 0.9}s`, animationDuration: `${6 + (k % 5)}s` }} />
        ))}
      </div>
      <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-gold-500/40 px-3 py-1 text-xs font-medium text-accent">{t('hero.badge')}</p>
          <h1 lang="ar" dir="rtl" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }} className="bg-gradient-to-b from-gold-500 via-gold-600 to-gold-800 bg-clip-text font-arabic text-6xl font-bold leading-[1.15] tracking-tight text-transparent sm:text-7xl lg:text-8xl">{settings.brand?.name?.ar || 'نور العطار'}</h1>
          <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{locale === 'en' ? tagline?.en : locale === 'ar' ? tagline?.ar : tagline?.hi}</p>
          <AnimatePresence mode="wait">
            <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }} className="mt-6 min-h-[8.5rem] max-w-xl">
              <h2 className="text-xl font-bold sm:text-2xl">{s.title}</h2>
              <p className="mt-1.5 text-mute">{s.subtitle}</p>
              {s.endDate && <Countdown to={s.endDate} />}
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={s.ctaLink || '/shop'} className="btn-gold">{s.ctaText || t('hero.shop')}</Link>
            <Link href="/collections/bestsellers" className="btn-outline">{t('hero.explore')}</Link>
          </div>
          {slides.length > 1 && (
            <div className="mt-8 flex gap-2" role="tablist" aria-label="Slides">
              {slides.map((b, k) => <button key={b.id} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-10 bg-gold-600' : 'w-4 bg-gold-500/40'}`} />)}
            </div>
          )}
        </div>
        {/* Mashrabiya arch frame */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="absolute -inset-4 rounded-t-[999px] rounded-b-3xl border border-gold-500/40" aria-hidden />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-2xl border border-gold-500/50 shadow-goldlg">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="aspect-[4/5]">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt={s.title || 'Noor Al Attar'} className="h-full w-full object-cover" />
                ) : (
                  <BottleArt category={TONE_CAT[s.tone] || 'oud'} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
