import type { Product, Settings } from './types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooralattar.in';

export const productJsonLd = (p: Product) => {
  const prices = p.variants.map((v) => v.price);
  return {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name.en, description: p.shortDescription.en,
    sku: p.sku, image: p.images.map((i) => (i.url.startsWith('http') ? i.url : SITE + i.url)),
    brand: { '@type': 'Brand', name: 'Noor Al Attar' },
    aggregateRating: p.reviewCount ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount } : undefined,
    offers: {
      '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: p.variants.length,
      availability: p.variants.some((v) => v.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE}/product/${p.slug}`,
    },
  };
};
export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.url })),
});
export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const businessJsonLd = (s: Settings) => ({
  '@context': 'https://schema.org', '@type': 'Store', name: s.brand?.name?.en, url: SITE,
  telephone: s.contact?.phone, address: { '@type': 'PostalAddress', streetAddress: s.contact?.address, addressCountry: 'IN' },
  priceRange: '₹₹', sameAs: Object.values(s.social || {}).filter(Boolean),
});
