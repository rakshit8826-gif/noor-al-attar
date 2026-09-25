'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, MessageCircle, ArrowRightLeft } from 'lucide-react';
import { useApp } from '@/components/shared/Providers';
import { LanguageSwitcher, ThemeToggle, CurrencySwitcher } from '@/components/shared/Switchers';
import { SearchModal, type SearchItem } from '@/components/shared/SearchModal';
import { useCart, useWishlist, useCompare, useHydrated } from '@/lib/stores';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { genericMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export function Navbar({ items }: { items: SearchItem[] }) {
  const { t, L, settings } = useApp();
  const { open: openWA } = useWhatsApp();
  const path = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const cmpCount = useCompare((s) => s.ids.length);
  const f = settings.features || ({} as Settings['features']);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 12); h(); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => setDrawer(false), [path]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch((s) => !s); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);

  const links = [
    { href: '/', label: t('nav.home') }, { href: '/shop', label: t('nav.shop') }, { href: '/collections/bestsellers', label: t('nav.collections') },
    { href: '/about', label: t('nav.about') }, ...(f.blog !== false ? [{ href: '/blog', label: t('nav.blog') }] : []), { href: '/contact', label: t('nav.contact') },
  ];
  const active = (h: string) => (h === '/' ? path === '/' : path.startsWith(h.split('/').slice(0, 2).join('/')));
  const Badge = ({ n }: { n: number }) => (hydrated && n > 0 ? <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rosegold-500 px-1 text-[10px] font-bold text-white">{n}</span> : null);

  return (
    <>
      <header className={cn('sticky top-0 z-40 transition-all duration-300', scrolled ? 'border-b border-gold-300/30 bg-page/80 shadow-gold backdrop-blur-xl' : 'bg-page')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          <button className="btn-ghost !p-2 lg:hidden" aria-label={t('nav.menu')} onClick={() => setDrawer(true)}><Menu size={22} /></button>
          <Link href="/" className="flex items-baseline gap-2" aria-label={settings.brand?.name?.en}>
            <span className="font-arabic text-3xl font-bold leading-none text-accent">نور</span>
            <span className="font-display text-lg font-bold tracking-tight sm:text-xl">{settings.brand?.name?.en || 'Noor Al Attar'}</span>
          </Link>
          <nav className="mx-6 hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={cn('rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-gold-500/10', active(l.href) && 'text-accent underline decoration-gold-500 decoration-2 underline-offset-8')}>{l.label}</Link>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-0.5">
            <button className="btn-ghost relative !p-2" aria-label={t('common.search')} onClick={() => setSearch(true)}><Search size={19} /></button>
            {f.compare !== false && <Link href="/compare" className="btn-ghost relative !p-2 max-md:hidden" aria-label={t('nav.compare')}><ArrowRightLeft size={18} /><Badge n={cmpCount} /></Link>}
            {f.wishlist !== false && <Link href="/wishlist" className="btn-ghost relative !p-2" aria-label={t('nav.wishlist')}><Heart size={19} /><Badge n={wishCount} /></Link>}
            <Link href="/cart" className="btn-ghost relative !p-2" aria-label={t('nav.cart')}><ShoppingBag size={19} /><Badge n={cartCount} /></Link>
            <LanguageSwitcher className="ms-2 max-sm:hidden" />
            {f.darkMode !== false && <ThemeToggle className="max-sm:hidden" />}
            <button className="btn-ghost !p-2 text-wa max-md:hidden" aria-label="WhatsApp" onClick={() => openWA(genericMessage())}><MessageCircle size={20} /></button>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-[60] flex animate-in fade-in flex-col bg-page pattern" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <div className="flex h-16 items-center justify-between px-4 border-b border-gold-500/30">
            <span className="font-display text-xl font-bold"><span className="font-arabic text-accent">نور</span> {settings.brand?.name?.en}</span>
            <button className="btn-ghost !p-2" aria-label={t('common.close')} onClick={() => setDrawer(false)}><X size={24} /></button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-6">
            {links.map((l) => <Link key={l.href} href={l.href} className="border-b border-gold-500/20 py-4 font-display text-2xl">{L({ en: l.label })}</Link>)}
            <Link href="/compare" className="border-b border-gold-500/20 py-4 font-display text-2xl">{t('nav.compare')}</Link>
            <Link href="/track-order" className="py-4 text-mute">Track order</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3 border-t border-gold-500/30 p-6">
            <LanguageSwitcher /><ThemeToggle /><CurrencySwitcher />
            <button className="btn-wa ms-auto" onClick={() => openWA(genericMessage())}><MessageCircle size={16} />WhatsApp</button>
          </div>
        </div>
      )}
      <SearchModal items={items} open={search} onClose={() => setSearch(false)} />
    </>
  );
}
import type { Settings } from '@/lib/types';
