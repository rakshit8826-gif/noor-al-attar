'use client';
import { CrudPage } from '@/components/admin/CrudPage';
export default function Page() {
  return <CrudPage entity="coupons" title="Coupons" labelKey="code" sub="Validated in the cart, and pre-filled into the WhatsApp message. Your team applies the final discount."
    blank={{ code: '', type: 'percent', value: 10, minOrder: 0, expiry: '', usageLimit: 0, active: true }}
    fields={[{ key: 'code', label: 'Code', type: 'text' }, { key: 'type', label: 'Type', type: 'select', options: ['percent', 'flat'] }, { key: 'value', label: 'Value (% or ₹)', type: 'number' }, { key: 'minOrder', label: 'Minimum order (₹)', type: 'number' }, { key: 'expiry', label: 'Expiry (YYYY-MM-DD)', type: 'text' }, { key: 'usageLimit', label: 'Usage limit (0 = unlimited)', type: 'number' }, { key: 'active', label: 'Active', type: 'checkbox' }]}
    columns={[{ key: 'code', label: 'Code', render: (i) => <b>{i.code}</b> }, { key: 'value', label: 'Discount', render: (i) => (i.type === 'percent' ? `${i.value}%` : `₹${i.value}`) }, { key: 'minOrder', label: 'Min order' }, { key: 'expiry', label: 'Expiry' }, { key: 'active', label: 'Active', toggle: true }]} />;
}
