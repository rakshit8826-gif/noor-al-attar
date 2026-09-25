'use client';
import { Star } from 'lucide-react';
import { useApp } from './Providers';
import { useCurrency } from '@/lib/stores';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

/** Display price. INR is canonical; USD/AED are approximate display-only conversions for NRIs. */
export function Price({ value, className }: { value: number; className?: string }) {
  const { settings } = useApp();
  const currency = useCurrency((s) => s.currency);
  // Server render is always INR; switch after hydration to avoid mismatch flash
  return <span className={className} suppressHydrationWarning>{formatMoney(value, currency, settings.currencyRates)}</span>;
}

export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-gold-500 text-gold-500' : 'text-gold-500/30'} aria-hidden />
      ))}
    </span>
  );
}

export function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="h-section">{title}</h2>
        {sub && <p className="mt-2 text-mute">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export const Ornament = () => (
  <div className="my-4 flex items-center gap-3 text-gold-500" aria-hidden>
    <span className="hairline" /><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="4" y="4" width="12" height="12" /><rect x="4" y="4" width="12" height="12" transform="rotate(45 10 10)" /></svg><span className="hairline" />
  </div>
);
