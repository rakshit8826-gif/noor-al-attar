import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { WishlistView } from '@/components/product/ListPages';
export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };
export default async function Page() { return <WishlistView products={await getProducts()} />; }
