'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import type { LocalizedString } from './types';
import type { Currency } from './format';

export interface CartItem {
  key: string; productId: string; slug: string; name: LocalizedString; image: string; category: string;
  size: string; price: number; mrp: number; qty: number;
}
interface CartState {
  items: CartItem[]; coupon: string; giftWrap: boolean; giftNote: string;
  add: (i: Omit<CartItem, 'key'>) => void; setQty: (key: string, qty: number) => void; remove: (key: string) => void;
  clear: () => void; setCoupon: (c: string) => void; setGift: (g: boolean, note?: string) => void;
}
export const useCart = create<CartState>()(persist((set) => ({
  items: [], coupon: '', giftWrap: false, giftNote: '',
  add: (i) => set((s) => {
    const key = `${i.productId}:${i.size}`;
    const ex = s.items.find((x) => x.key === key);
    return { items: ex ? s.items.map((x) => (x.key === key ? { ...x, qty: Math.min(20, x.qty + i.qty) } : x)) : [...s.items, { ...i, key }] };
  }),
  setQty: (key, qty) => set((s) => ({ items: s.items.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(20, qty)) } : x)) })),
  remove: (key) => set((s) => ({ items: s.items.filter((x) => x.key !== key) })),
  clear: () => set({ items: [], coupon: '', giftWrap: false, giftNote: '' }),
  setCoupon: (coupon) => set({ coupon }),
  setGift: (giftWrap, note) => set((s) => ({ giftWrap, giftNote: note ?? s.giftNote })),
}), { name: 'noor-cart' }));

interface ListState { ids: string[]; toggle: (id: string) => boolean; has: (id: string) => boolean; clear: () => void }
const listStore = (name: string, max = 999) =>
  create<ListState>()(persist((set, get) => ({
    ids: [],
    toggle: (id) => {
      const on = get().ids.includes(id);
      if (!on && get().ids.length >= max) return false;
      set({ ids: on ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
      return true;
    },
    has: (id) => get().ids.includes(id),
    clear: () => set({ ids: [] }),
  }), { name }));
export const useWishlist = listStore('noor-wishlist');
export const useCompare = listStore('noor-compare', 3);

interface RecentState { ids: string[]; push: (id: string) => void }
export const useRecent = create<RecentState>()(persist((set) => ({
  ids: [], push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 8) })),
}), { name: 'noor-recent' }));

export const useCurrency = create<{ currency: Currency; set: (c: Currency) => void }>()(persist((set) => ({ currency: 'INR', set: (currency) => set({ currency }) }), { name: 'noor-currency' }));

/** Zustand-persist state differs between server and first client render; gate UI on this. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
