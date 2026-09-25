import { readKey, writeKey } from './store';
import type { Product, Category, Collection, Banner, Testimonial, BlogPost, Coupon, Inquiry, Settings, ActivityLog, EntityName } from './types';

const empty = [] as never[];
export const getProducts = async (all = false) => {
  const list = await readKey<Product[]>('products', []);
  return all ? list : list.filter((p) => p.status === 'published');
};
export const getProduct = async (slug: string) => (await getProducts()).find((p) => p.slug === slug) ?? null;
export const getCategories = async (all = false) => {
  const l = (await readKey<Category[]>('categories', [])).sort((a, b) => a.order - b.order);
  return all ? l : l.filter((c) => c.visible);
};
export const getCollections = async (all = false) => {
  const l = (await readKey<Collection[]>('collections', [])).sort((a, b) => a.order - b.order);
  return all ? l : l.filter((c) => c.visible);
};
export const getBanners = async (all = false) => {
  const l = await readKey<Banner[]>('banners', []);
  if (all) return l;
  const now = Date.now();
  return l.filter((b) => b.active && (!b.startDate || new Date(b.startDate).getTime() <= now) && (!b.endDate || new Date(b.endDate).getTime() >= now));
};
export const getTestimonials = async (all = false) => {
  const l = (await readKey<Testimonial[]>('testimonials', [])).sort((a, b) => a.order - b.order);
  return all ? l : l.filter((t) => t.visible);
};
export const getPosts = async (all = false) => {
  const l = (await readKey<BlogPost[]>('blog', [])).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return all ? l : l.filter((p) => p.status === 'published');
};
export const getCoupons = async () => readKey<Coupon[]>('coupons', []);
export const getInquiries = async () => readKey<Inquiry[]>('inquiries', empty);
export const getSettings = async () => readKey<Settings>('settings', {} as Settings);

/** Append to the admin activity log (kept to last 200 entries). Failures never block the caller. */
export async function logActivity(action: string, entity: string, target: string) {
  try {
    const log = await readKey<ActivityLog[]>('activity', []);
    log.unshift({ id: crypto.randomUUID(), action, entity, target, at: new Date().toISOString() });
    await writeKey('activity', log.slice(0, 200));
  } catch {}
}

export const ENTITIES: EntityName[] = ['products', 'categories', 'collections', 'banners', 'testimonials', 'blog', 'coupons', 'inquiries', 'activity'];
