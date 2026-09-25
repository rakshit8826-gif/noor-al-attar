'use client';
import { CrudPage } from '@/components/admin/CrudPage';
export default function Page() {
  return <CrudPage entity="testimonials" title="Testimonials" labelKey="name" ordered
    blank={{ name: '', city: '', rating: 5, text: '', avatar: '', verified: true, order: 0, visible: true }}
    fields={[{ key: 'name', label: 'Name', type: 'text' }, { key: 'city', label: 'City', type: 'text' }, { key: 'rating', label: 'Rating (1–5)', type: 'number' }, { key: 'text', label: 'Review', type: 'textarea' }, { key: 'avatar', label: 'Avatar (optional)', type: 'image' }, { key: 'verified', label: 'Verified buyer', type: 'checkbox' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'visible', label: 'Visible', type: 'checkbox' }]}
    columns={[{ key: 'name', label: 'Name' }, { key: 'city', label: 'City' }, { key: 'rating', label: 'Rating', render: (i) => '★'.repeat(i.rating) }, { key: 'visible', label: 'Visible', toggle: true }]} />;
}
