'use client';
import type { Product } from '@/lib/types';
import { useRecent, useHydrated } from '@/lib/stores';
import { useApp } from '@/components/shared/Providers';
import { ProductGrid } from './ProductCard';

export function RecentlyViewed({ products, currentId }: { products: Product[]; currentId?: string }) {
  const { t } = useApp();
  const ids = useRecent((s) => s.ids);
  const hydrated = useHydrated();
  const items = ids.filter((i) => i !== currentId).map((i) => products.find((p) => p.id === i)).filter(Boolean).slice(0, 4) as Product[];
  if (!hydrated || !items.length) return null;
  return <section className="mt-16"><h2 className="mb-6 text-2xl font-bold">{t('product.recent')}</h2><ProductGrid products={items} /></section>;
}
