import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { CompareView } from '@/components/product/ListPages';
export const metadata: Metadata = { title: 'Compare attars', robots: { index: false } };
export default async function Page() { return <CompareView products={await getProducts()} />; }
