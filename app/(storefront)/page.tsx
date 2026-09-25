import { getProducts, getCategories, getCollections, getBanners, getTestimonials, getPosts, getSettings } from '@/lib/data';
import { Hero } from '@/components/home/Hero';
import { TrustStrip, CategoryTiles, Bestsellers, Story, Quiz, CollectionsRow, Spotlight, Testimonials, InstagramStrip, BlogTeaser, Newsletter, FaqAccordion } from '@/components/home/Sections';
import { SectionHead } from '@/components/shared/Bits';
import { faqJsonLd } from '@/lib/seo';
import { FAQS } from '@/lib/content';

export default async function Home() {
  const [products, cats, cols, banners, tests, posts, settings] = await Promise.all([getProducts(), getCategories(), getCollections(), getBanners(), getTestimonials(), getPosts(), getSettings()]);
  const counts: Record<string, number> = {};
  products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
  const best = products.filter((p) => p.bestseller || p.featured).slice(0, 8);
  const f = settings.features;
  return (
    <>
      <Hero banners={banners.filter((b) => b.position === 'hero')} />
      <TrustStrip />
      <CategoryTiles categories={cats} counts={counts} />
      <Bestsellers products={best} />
      <Story />
      {f?.quiz !== false && <Quiz products={products} />}
      <CollectionsRow collections={cols} />
      <Spotlight />
      <Testimonials items={tests.slice(0, 6)} />
      {f?.instagram !== false && <InstagramStrip handle="@nooralattar" url={settings.social?.instagram || '#'} />}
      {f?.blog !== false && <BlogTeaser posts={posts.slice(0, 3)} />}
      <Newsletter />
      <section className="section">
        <SectionHead title="Questions, answered" />
        <FaqAccordion limit={6} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      </section>
    </>
  );
}
