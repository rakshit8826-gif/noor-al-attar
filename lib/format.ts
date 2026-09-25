import type { Locale, LocalizedString } from './types';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
/** ₹1,49,900 — Indian digit grouping */
export const formatINR = (n: number) => inr.format(Math.round(n));

export type Currency = 'INR' | 'USD' | 'AED';
export function formatMoney(n: number, cur: Currency = 'INR', rates = { USD: 0.012, AED: 0.044 }) {
  if (cur === 'INR') return formatINR(n);
  return new Intl.NumberFormat(cur === 'USD' ? 'en-US' : 'en-AE', { style: 'currency', currency: cur, maximumFractionDigits: 2 }).format(n * rates[cur]);
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

/** Pick the localized string, falling back to English. */
export const loc = (s: LocalizedString | undefined, l: Locale) => (s ? (s[l] && s[l]!.trim() ? s[l]! : s.en) : '');

export const discountPct = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
export const readTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
