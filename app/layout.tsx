import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import '@/styles/globals.css';
import { Providers } from '@/components/shared/Providers';
import { PwaRegister, Analytics3P } from '@/components/shared/Popups';
import { getSettings } from '@/lib/data';
import { LOCALE_COOKIE, isRTL } from '@/lib/i18n';
import { businessJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooralattar.in';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE),
    title: { default: s.seo?.title || 'Noor Al Attar', template: '%s | Noor Al Attar' },
    description: s.seo?.description,
    keywords: s.seo?.keywords,
    manifest: '/manifest.webmanifest',
    icons: { icon: '/icons/icon.svg', apple: '/icons/icon-192.png' },
    openGraph: { type: 'website', siteName: 'Noor Al Attar', locale: 'en_IN', images: [s.seo?.ogImage || `/api/og?title=${encodeURIComponent(s.brand?.tagline?.en || 'The Essence of the Orient')}`] },
    twitter: { card: 'summary_large_image' },
    appleWebApp: { capable: true, title: 'Noor Al Attar', statusBarStyle: 'default' },
  };
}
export const viewport: Viewport = { themeColor: '#C9A961', width: 'device-width', initialScale: 1 };

const FONTS = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;600;700&family=Playfair+Display:wght@500;600;700&display=swap';
// Runs before paint so dark mode never flashes
const THEME_SCRIPT = `try{var t=localStorage.getItem('noor_theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = cookies().get(LOCALE_COOKIE)?.value;
  const locale: Locale = c === 'hi' || c === 'ar' ? c : 'en';
  const settings = await getSettings();
  return (
    <html lang={locale} dir={isRTL(locale) ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(settings)) }} />
      </head>
      <body>
        <Providers locale={locale} settings={settings}>{children}</Providers>
        <PwaRegister />
        <Analytics3P ga={settings.analytics?.ga4 || process.env.NEXT_PUBLIC_GA_ID} pixel={settings.analytics?.metaPixel || process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        <Analytics />
      </body>
    </html>
  );
}
