'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, MessageCircle, ArrowUp } from 'lucide-react';
import { useApp } from '@/components/shared/Providers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { genericMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

/** Floating WhatsApp button (all pages). On product pages the sticky order bar replaces it on mobile. */
export function WhatsAppFloat() {
  const { open } = useWhatsApp();
  const path = usePathname();
  const onProduct = path.startsWith('/product/');
  return (
    <button onClick={() => open(genericMessage())} aria-label="Chat on WhatsApp"
      className={cn('fixed end-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-lg transition hover:scale-105 bottom-20 md:bottom-6', onProduct && 'max-md:hidden')}>
      <span className="absolute inset-0 animate-ring rounded-full bg-wa" aria-hidden />
      <MessageCircle size={26} className="relative" />
    </button>
  );
}

export function MobileBar() {
  const { t } = useApp();
  const { open } = useWhatsApp();
  const path = usePathname();
  if (path.startsWith('/product/')) return null;
  const tab = 'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium';
  return (
    <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gold-500/30 bg-page/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
      <Link href="/" className={cn(tab, path === '/' && 'text-accent')}><Home size={20} />{t('nav.home')}</Link>
      <Link href="/shop" className={cn(tab, path.startsWith('/shop') && 'text-accent')}><Store size={20} />{t('nav.shop')}</Link>
      <button onClick={() => open(genericMessage())} className={cn(tab, 'text-wa')}><MessageCircle size={20} />{t('nav.order')}</button>
    </nav>
  );
}

export function BackToTop() {
  const { t } = useApp();
  const [show, setShow] = useState(false);
  useEffect(() => { const h = () => setShow(window.scrollY > 700); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  if (!show) return null;
  return (
    <button aria-label={t('common.backToTop')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-36 end-5 z-40 grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 bg-surface text-accent shadow md:bottom-24"><ArrowUp size={18} /></button>
  );
}
