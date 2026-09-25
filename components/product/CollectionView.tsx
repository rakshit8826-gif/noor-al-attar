import { notFound } from 'next/navigation';
import { getCollections, getProducts } from '@/lib/data';
import { ProductGrid } from './ProductCard';

export async function CollectionView({ slug }: { slug: string }) {
  const [cols, products] = await Promise.all([getCollections(), getProducts()]);
  const col = cols.find((c) => c.slug === slug);
  if (!col) notFound();
  const items = products.filter((p) => col.productIds.includes(p.id) || p.collections.includes(slug));
  return (
    <>
      <section className="pattern bg-deep">
        <div className="section text-center !py-14">
          <h1 className="text-4xl font-bold sm:text-5xl">{col.name.en}</h1>
          <p lang="ar" className="mt-1 font-arabic text-3xl text-accent">{col.name.ar}</p>
          <p className="mx-auto mt-3 max-w-xl text-mute">{col.description}</p>
        </div>
      </section>
      <div className="section"><ProductGrid products={items} /></div>
    </>
  );
}
