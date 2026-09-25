import type { Product, Variant } from './types';
export const defaultVariant = (p: Product): Variant => p.variants.find((v) => v.stock > 0) ?? p.variants[0];
export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const inStock = (p: Product) => p.variants.some((v) => v.stock > 0);
export const isNew = (p: Product) => p.tags.includes('new');
/** Layering pairs: which category complements which (used for the layering guide). */
export const LAYER_PAIRS: Record<string, string[]> = {
  oud: ['rose', 'musk'], musk: ['amber', 'oud'], rose: ['oud', 'sandal-khus'], amber: ['musk', 'rose'],
  'sandal-khus': ['rose', 'amber'], bakhoor: ['oud', 'musk'], 'gift-sets': ['oud'], dhoop: ['musk'],
};
