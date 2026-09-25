export type Locale = 'en' | 'hi' | 'ar';
export type LocalizedString = { en: string; ar?: string; hi?: string };

export interface Variant { size: string; price: number; mrp: number; stock: number }
export interface ProductImage { url: string; alt: string }

export interface Product {
  id: string;
  slug: string;
  name: LocalizedString;
  sku?: string;
  category: string;
  collections: string[];
  tags: string[]; // 'bestseller' | 'new' | 'limited' | 'festive'
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  fragranceFamily: 'floral' | 'woody' | 'oriental' | 'fresh' | 'gourmand';
  gender: 'men' | 'women' | 'unisex';
  occasions: string[];
  intensity: 'light' | 'medium' | 'strong'; // used by the fragrance quiz
  notes: { top: string[]; heart: string[]; base: string[] };
  variants: Variant[];
  currency: 'INR';
  images: ProductImage[];
  seo: { title: string; description: string };
  status: 'published' | 'draft';
  featured: boolean;
  bestseller: boolean;
  giftWrapAvailable: boolean;
  codAvailable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category { id: string; slug: string; name: LocalizedString; icon: string; image: string; description: string; order: number; visible: boolean }
export interface Collection { id: string; slug: string; name: LocalizedString; description: string; banner: string; productIds: string[]; order: number; visible: boolean }
export interface Banner { id: string; title: string; subtitle: string; image: string; ctaText: string; ctaLink: string; position: 'hero' | 'promo' | 'category'; startDate: string; endDate: string; active: boolean; tone: string }
export interface Testimonial { id: string; name: string; city: string; rating: number; text: string; avatar: string; verified: boolean; order: number; visible: boolean }
export interface BlogPost { id: string; slug: string; title: string; cover: string; excerpt: string; content: string; author: string; tags: string[]; publishedAt: string; status: 'published' | 'draft'; seoTitle: string; seoDescription: string }
export interface Coupon { id: string; code: string; type: 'flat' | 'percent'; value: number; minOrder: number; expiry: string; usageLimit: number; active: boolean }
export interface Inquiry { id: string; kind: 'product' | 'cart' | 'generic' | 'quiz' | 'bulk' | 'notify'; productIds: string[]; productNames: string[]; cartValue: number; pageUrl: string; referrer: string; device: string; city: string; createdAt: string; status: 'new' | 'contacted' | 'converted' | 'lost'; note: string }
export interface ActivityLog { id: string; action: string; entity: string; target: string; at: string }

export interface Settings {
  brand: { name: LocalizedString; tagline: LocalizedString; logo: string; favicon: string };
  contact: { whatsapp: string; phone: string; email: string; address: string; mapEmbed: string; hours: string };
  business: { legalName: string; gstin: string; pan: string };
  shipping: { freeThreshold: number; flatRate: number; deliveryText: string; codNote: string; table: { zone: string; time: string; charge: string }[] };
  social: { instagram: string; facebook: string; youtube: string; x: string; pinterest: string };
  seo: { title: string; description: string; ogImage: string; keywords: string };
  analytics: { ga4: string; metaPixel: string };
  announcements: string[];
  currencyRates: { USD: number; AED: number };
  features: { darkMode: boolean; wishlist: boolean; compare: boolean; blog: boolean; quiz: boolean; instagram: boolean; exitIntent: boolean };
}

export type EntityName = 'products' | 'categories' | 'collections' | 'banners' | 'testimonials' | 'blog' | 'coupons' | 'inquiries' | 'activity';
