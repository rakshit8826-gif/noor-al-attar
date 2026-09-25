import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/data';
import { ShopClient } from '@/components/product/ShopClient';
export const metadata: Metadata = { title: 'Shop attars, oud, musk & bakhoor', description: 'Browse authentic attars, oud, musk, rose, amber and bakhoor. Order on WhatsApp.' };
export default async function Shop() {
  const [p, c] = await Promise.all([getProducts(), getCategories()]);
  return <ShopClient products={p} categories={c} />;
}
