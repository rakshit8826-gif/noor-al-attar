import { getProducts, getCategories } from '@/lib/data';
import { minPrice } from '@/lib/product';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat, MobileBar, BackToTop } from '@/components/layout/Floating';
import { CookieBanner, ExitIntent } from '@/components/shared/Popups';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const items = products.map((p) => ({
    slug: p.slug, name: p.name, category: p.category, family: p.fragranceFamily,
    notes: [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' '), price: minPrice(p), image: p.images[0]?.url ?? '',
  }));
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-[100] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2">Skip to content</a>
      <AnnouncementBar />
      <Navbar items={items} />
      <main id="main">{children}</main>
      <Footer categories={categories} />
      <WhatsAppFloat /><MobileBar /><BackToTop /><CookieBanner /><ExitIntent />
    </>
  );
}
