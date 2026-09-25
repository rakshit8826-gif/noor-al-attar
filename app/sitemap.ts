import type { MetadataRoute } from 'next';
import { getProducts, getCategories, getCollections, getPosts } from '@/lib/data';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooralattar.in';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [p, c, col, b] = await Promise.all([getProducts(), getCategories(), getCollections(), getPosts()]);
  const stat = ['', '/shop', '/about', '/contact', '/blog', '/faq', '/shipping-returns', '/privacy-policy', '/terms', '/track-order', '/wedding', '/eid', '/diwali'].map((u) => ({ url: SITE + u, changeFrequency: 'weekly' as const, priority: u === '' ? 1 : 0.7 }));
  return [
    ...stat,
    ...c.map((x) => ({ url: `${SITE}/shop/${x.slug}`, priority: 0.7 })),
    ...col.map((x) => ({ url: `${SITE}/collections/${x.slug}`, priority: 0.6 })),
    ...p.map((x) => ({ url: `${SITE}/product/${x.slug}`, lastModified: x.updatedAt, priority: 0.9 })),
    ...b.map((x) => ({ url: `${SITE}/blog/${x.slug}`, lastModified: x.publishedAt, priority: 0.6 })),
  ];
}
