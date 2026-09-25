import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import ar from '@/messages/ar.json';
import type { Locale } from './types';

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'hi', label: 'हिं', native: 'हिन्दी' },
  { code: 'ar', label: 'ع', native: 'العربية' },
];
export const dict: Record<Locale, Record<string, string>> = { en, hi, ar };
export const isRTL = (l: Locale) => l === 'ar';
export const LOCALE_COOKIE = 'noor_lang';

/** Translate with English fallback; `{n}` style placeholders are replaced from `vars`. */
export function translate(locale: Locale, key: string, vars?: Record<string, string | number>) {
  let s = dict[locale]?.[key] ?? dict.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
