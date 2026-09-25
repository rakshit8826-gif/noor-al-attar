import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, getProducts, getCategories } from '@/lib/data';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductCard';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { LAYER_PAIRS } from '@/lib/product';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return { title: p.seo.title || p.name.en, description: p.seo.description || p.shortDescription.en, openGraph: { images: [`/api/og?title=${encodeURIComponent(p.name.en)}`] } };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [p, all, cats] = await Promise.all([getProduct(params.slug), getProducts(), getCategories()]);
  if (!p) notFound();
  const cat = cats.find((c) => c.slug === p.category);
  const sameFamily = all.filter((x) => x.id !== p.id && x.fragranceFamily === p.fragranceFamily).slice(0, 4);
  const others = all.filter((x) => x.id !== p.id && !sameFamily.includes(x)).sort((a, b) => b.rating - a.rating).slice(0, 4);
  const layer = (LAYER_PAIRS[p.category] || []).map((c) => all.find((x) => x.category === c && x.id !== p.id)).filter(Boolean).map((x) => ({ name: x!.name.en, slug: x!.slug }));
  return (
    <div className="section !pt-6">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-mute">
        <Link href="/" className="hover:text-accent">Home</Link> / <Link href="/shop" className="hover:text-accent">Shop</Link> / <Link href={`/shop/${p.category}`} className="hover:text-accent">{cat?.name.en ?? p.category}</Link> / <span className="text-ink">{p.name.en}</span>
      </nav>
      <ProductDetail product={p} layerNames={layer} />
      {sameFamily.length > 0 && <section className="mt-16"><h2 className="mb-6 text-2xl font-bold">Complete the look</h2><ProductGrid products={sameFamily} /></section>}
      <section className="mt-16"><h2 className="mb-6 text-2xl font-bold">You may also like</h2><ProductGrid products={others} /></section>
      <RecentlyViewed products={all} currentId={p.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd(p), breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Shop', url: '/shop' }, { name: p.name.en, url: `/product/${p.slug}` }])]) }} />
    </div>
  );
}
