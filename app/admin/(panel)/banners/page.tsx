'use client';
import { CrudPage } from '@/components/admin/CrudPage';
export default function Page() {
  return <CrudPage entity="banners" title="Banners" labelKey="title" sub="Homepage hero slides & promos. Schedule festive campaigns with start and end dates."
    blank={{ title: '', subtitle: '', image: '', ctaText: 'Shop now', ctaLink: '/shop', position: 'hero', startDate: '', endDate: '', active: true, tone: 'oud' }}
    fields={[{ key: 'title', label: 'Title', type: 'text', span: 2 }, { key: 'subtitle', label: 'Subtitle', type: 'textarea' }, { key: 'image', label: 'Image (optional)', type: 'image' }, { key: 'ctaText', label: 'Button text', type: 'text' }, { key: 'ctaLink', label: 'Button link', type: 'text' }, { key: 'position', label: 'Position', type: 'select', options: ['hero', 'promo', 'category'] }, { key: 'tone', label: 'Bottle art style', type: 'select', options: ['oud', 'rose', 'amber'] }, { key: 'startDate', label: 'Starts', type: 'date' }, { key: 'endDate', label: 'Ends (shows a countdown)', type: 'date' }, { key: 'active', label: 'Active', type: 'checkbox' }]}
    columns={[{ key: 'title', label: 'Title' }, { key: 'position', label: 'Position' }, { key: 'endDate', label: 'Ends', render: (i) => (i.endDate ? new Date(i.endDate).toLocaleDateString('en-IN') : '—') }, { key: 'active', label: 'Active', toggle: true }]} />;
}
