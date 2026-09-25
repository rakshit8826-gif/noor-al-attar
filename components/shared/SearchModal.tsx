'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useApp } from './Providers';
import { ProductImage } from './ProductImage';
import { Price } from './Bits';

export interface SearchItem { slug: string; name: { en: string; ar?: string; hi?: string }; category: string; family: string; notes: string; price: number; image: string }

export function SearchModal({ items, open, onClose }: { items: SearchItem[]; open: boolean; onClose: () => void }) {
  const { t, L } = useApp();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const fuse = useMemo(() => new Fuse(items, { keys: ['name.en', 'name.ar', 'name.hi', 'category', 'family', 'notes'], threshold: 0.35 }), [items]);
  const results = q.trim() ? fuse.search(q).slice(0, 8).map((r) => r.item) : items.slice(0, 5);
  useEffect(() => { if (open) setTimeout(() => ref.current?.focus(), 50); else setQ(''); }, [open]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-charcoal-900/60 p-4 pt-[10vh] backdrop-blur-sm animate-in fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('common.search')}>
      <div className="card w-full max-w-xl overflow-hidden !bg-surface" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line/20 px-4">
          <Search size={18} className="text-mute" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('nav.search')} className="w-full bg-transparent py-4 text-base outline-none placeholder:text-mute/70" />
          <button onClick={onClose} aria-label={t('common.close')} className="p-1 text-mute"><X size={18} /></button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {results.map((r) => (
            <li key={r.slug}>
              <Link href={`/product/${r.slug}`} onClick={onClose} className="flex items-center gap-3 rounded-xl p-2 hover:bg-gold-500/10">
                <ProductImage images={r.image ? [{ url: r.image, alt: '' }] : []} category={r.category} className="h-14 w-12 shrink-0 rounded-lg" sizes="48px" />
                <span className="flex-1"><span className="block font-medium">{L(r.name)}</span><span className="text-xs text-mute">{r.category.replace('-', ' ')} · {r.family}</span></span>
                <Price value={r.price} className="text-sm text-accent" />
              </Link>
            </li>
          ))}
          {!results.length && <li className="p-6 text-center text-sm text-mute">{t('shop.empty')}</li>}
        </ul>
      </div>
    </div>
  );
}
