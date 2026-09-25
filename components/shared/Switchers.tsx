'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useApp } from './Providers';
import { LOCALES } from '@/lib/i18n';
import { useCurrency } from '@/lib/stores';
import { cn } from '@/lib/utils';
import type { Currency } from '@/lib/format';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useApp();
  return (
    <div role="group" aria-label={t('common.language')} className={cn('flex rounded-full border border-gold-500/30 p-0.5 text-xs', className)}>
      {LOCALES.map((l) => (
        <button key={l.code} onClick={() => setLocale(l.code)} aria-pressed={locale === l.code} title={l.native}
          className={cn('rounded-full px-2.5 py-1 font-semibold transition', locale === l.code ? 'bg-gold-500 text-charcoal-900' : 'text-ink/70 hover:text-ink')}>{l.label}</button>
      ))}
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('noor_theme', next ? 'dark' : 'light'); } catch {}
  };
  return (
    <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className={cn('btn-ghost !p-2', className)}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, set } = useCurrency();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return (
    <select aria-label="Display currency" value={m ? currency : 'INR'} onChange={(e) => set(e.target.value as Currency)}
      className={cn('rounded-full border border-gold-500/30 bg-transparent px-2 py-1 text-xs text-ink', className)}>
      <option value="INR">₹ INR</option><option value="USD">$ USD (approx)</option><option value="AED">د.إ AED (approx)</option>
    </select>
  );
}
