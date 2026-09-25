import { CollectionView } from '@/components/product/CollectionView';
export default function Page({ params }: { params: { slug: string } }) { return <CollectionView slug={params.slug} />; }
