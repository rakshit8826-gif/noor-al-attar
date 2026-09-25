import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/data';
import { ShopClient } from '@/components/product/ShopClient';
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const c = (await getCategories()).find((x) => x.slug === params.category);
  return c ? { title: `${c.name.en} attars`, description: c.description } : {};
}
export default async function Category({ params }: { params: { category: string } }) {
  const [p, cats] = await Promise.all([getProducts(), getCategories()]);
  const cat = cats.find((c) => c.slug === params.category);
  if (!cat) notFound();
  return <ShopClient key={cat.slug} products={p} categories={cats} initialCategory={cat.slug} title={cat.name.en} intro={cat.description} />;
}
