import type { Metadata } from 'next';
import { getCoupons } from '@/lib/data';
import { CartView } from '@/components/product/ListPages';
export const metadata: Metadata = { title: 'Your cart', robots: { index: false } };
export default async function Page() {
  const coupons = (await getCoupons()).filter((c) => c.active);
  return <CartView coupons={coupons} />;
}
