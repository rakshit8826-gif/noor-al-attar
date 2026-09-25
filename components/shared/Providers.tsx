'use client';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import type { Locale, LocalizedString, Settings } from '@/lib/types';
import { translate, LOCALE_COOKIE } from '@/lib/i18n';
import { loc as locFn } from '@/lib/format';

interface Ctx {
  locale: Locale; settings: Settings;
  t: (key: string, vars?: Record<string, string | number>) => string;
  L: (s: LocalizedString | undefined) => string;
  setLocale: (l: Locale) => void;
}
const AppCtx = createContext<Ctx | null>(null);

export function Providers({ locale, settings, children }: { locale: Locale; settings: Settings; children: React.ReactNode }) {
  const router = useRouter();
  const setLocale = useCallback((l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh(); // server re-renders <html lang dir> with the new locale
  }, [router]);
  const value = useMemo<Ctx>(() => ({
    locale, settings, setLocale,
    t: (k, v) => translate(locale, k, v),
    L: (s) => locFn(s, locale),
  }), [locale, settings, setLocale]);
  return (
    <AppCtx.Provider value={value}>
      {children}
      <Toaster position={locale === 'ar' ? 'bottom-left' : 'bottom-right'} toastOptions={{ style: { borderRadius: 16 } }} richColors={false} />
    </AppCtx.Provider>
  );
}
export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be inside <Providers>');
  return c;
}
