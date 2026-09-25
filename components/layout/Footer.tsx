'use client';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter, MessageCircle } from 'lucide-react';
import { useApp } from '@/components/shared/Providers';
import { CurrencySwitcher } from '@/components/shared/Switchers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { genericMessage, bulkMessage } from '@/lib/whatsapp';
import type { Category } from '@/lib/types';

export function Footer({ categories }: { categories: Category[] }) {
  const { t, L, settings } = useApp();
  const { open } = useWhatsApp();
  const s = settings.social || {};
  const socials = [[s.instagram, Instagram, 'Instagram'], [s.facebook, Facebook, 'Facebook'], [s.youtube, Youtube, 'YouTube'], [s.x, Twitter, 'X']] as const;
  return (
    <footer className="mt-10 border-t border-gold-500/30 bg-deep pb-20 md:pb-0 pattern">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-arabic text-4xl font-bold text-accent">{settings.brand?.name?.ar}</p>
          <p className="font-display text-xl font-bold">{settings.brand?.name?.en}</p>
          <p className="mt-3 max-w-xs text-sm text-mute">{t('footer.bio')}</p>
          <div className="mt-4 flex gap-2">
            {socials.filter(([u]) => u).map(([u, Icon, n]) => (
              <a key={n} href={u} target="_blank" rel="noopener noreferrer" aria-label={n} className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-accent transition hover:bg-gold-500 hover:text-charcoal-900"><Icon size={17} /></a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold">{t('footer.shop')}</h3>
          <ul className="space-y-2 text-sm text-mute">
            {categories.map((c) => <li key={c.id}><Link className="hover:text-accent" href={`/shop/${c.slug}`}>{L(c.name)}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold">{t('footer.help')}</h3>
          <ul className="space-y-2 text-sm text-mute">
            {[['/faq', 'FAQ'], ['/shipping-returns', 'Shipping & Returns'], ['/track-order', 'Track Order'], ['/contact', t('nav.contact')], ['/privacy-policy', 'Privacy Policy'], ['/terms', 'Terms'], ['/accessibility', 'Accessibility']].map(([h, l]) => <li key={h}><Link className="hover:text-accent" href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold">{t('footer.stay')}</h3>
          <button className="btn-wa w-full" onClick={() => open(genericMessage())}><MessageCircle size={16} />WhatsApp {settings.contact?.phone}</button>
          <button className="mt-2 text-start text-sm text-accent underline underline-offset-4" onClick={() => open(bulkMessage(), { kind: 'bulk' })}>{t('wa.bulk')}</button>
          <p className="mt-2 text-sm text-mute">{t('wa.nri')}</p>
          <div className="mt-4"><CurrencySwitcher /></div>
        </div>
      </div>
      <div className="border-t border-gold-500/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-mute sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {settings.brand?.name?.en} · GSTIN: {settings.business?.gstin || process.env.NEXT_PUBLIC_GSTIN} · {t('footer.made')} 🇮🇳</p>
          <p>{t('footer.payments')}</p>
        </div>
      </div>
    </footer>
  );
}
