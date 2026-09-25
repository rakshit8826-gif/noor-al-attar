'use client';
import { CrudPage } from '@/components/admin/CrudPage';
export default function Page() {
  return <CrudPage entity="categories" title="Categories" ordered sub="Shown on the homepage tiles, shop filters and footer. Use the arrows to reorder."
    blank={{ slug: '', name: { en: '', ar: '', hi: '' }, icon: '🌸', image: '', description: '', order: 0, visible: true }}
    fields={[{ key: 'name', label: 'Name (EN / AR / HI)', type: 'l10n' }, { key: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate' }, { key: 'icon', label: 'Icon (emoji)', type: 'text' }, { key: 'image', label: 'Image', type: 'image' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'visible', label: 'Visible', type: 'checkbox' }]}
    columns={[{ key: 'icon', label: '' }, { key: 'name.en', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'visible', label: 'Visible', toggle: true }]} />;
}
