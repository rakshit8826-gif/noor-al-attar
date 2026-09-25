'use client';
import { CrudPage } from '@/components/admin/CrudPage';
export default function Page() {
  return <CrudPage entity="collections" title="Collections" ordered sub="Hand-picked sets such as Diwali, Wedding, Eid."
    blank={{ slug: '', name: { en: '', ar: '', hi: '' }, description: '', banner: '', productIds: [], order: 0, visible: true }}
    fields={[{ key: 'name', label: 'Name (EN / AR / HI)', type: 'l10n' }, { key: 'slug', label: 'Slug', type: 'text' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'banner', label: 'Banner image', type: 'image' }, { key: 'productIds', label: 'Products in this collection', type: 'products' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'visible', label: 'Visible', type: 'checkbox' }]}
    columns={[{ key: 'name.en', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'productIds', label: 'Products', render: (i) => i.productIds?.length ?? 0 }, { key: 'visible', label: 'Visible', toggle: true }]} />;
}
