'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Settings } from '@/lib/types';
import { api, getPath, setPath } from '@/lib/adminApi';
import { ImageInput, PageTitle, Skeleton, Toggle } from './Bits';

export function SettingsForm() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api<{ settings: Settings }>('/api/admin/settings').then((r) => setS(r.settings)).catch((e) => toast.error(e.message)); }, []);
  if (!s) return <Skeleton rows={8} />;
  const u = (path: string, v: unknown) => setS((c) => setPath(c!, path, v));
  const save = async () => { setSaving(true); try { await api('/api/admin/settings', 'PUT', s); toast.success('Settings saved'); } catch (e) { toast.error((e as Error).message); } setSaving(false); };
  const F = ({ path, label, type = 'text', ...rest }: { path: string; label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div><label className="label">{label}</label><input className="input" type={type} value={getPath(s, path) ?? ''} onChange={(e) => u(path, type === 'number' ? +e.target.value : e.target.value)} {...rest} /></div>
  );
  const Box = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="card !bg-surface p-5"><h2 className="mb-4 text-lg font-bold">{title}</h2><div className="grid gap-4 sm:grid-cols-2">{children}</div></section>;
  const feats = ['darkMode', 'wishlist', 'compare', 'blog', 'quiz', 'instagram', 'exitIntent'] as const;
  return (
    <div className="space-y-5">
      <PageTitle title="Settings"><button className="btn-gold !py-2" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save settings'}</button></PageTitle>
      <Box title="Brand"><F path="brand.name.en" label="Name (EN)" /><F path="brand.name.ar" label="Name (AR)" dir="rtl" /><F path="brand.name.hi" label="Name (HI)" /><F path="brand.tagline.en" label="Tagline (EN)" /><F path="brand.tagline.ar" label="Tagline (AR)" dir="rtl" /><F path="brand.tagline.hi" label="Tagline (HI)" />
        <div><label className="label">Logo</label><ImageInput value={s.brand.logo} onChange={(v) => u('brand.logo', v)} /></div><div><label className="label">Favicon</label><ImageInput value={s.brand.favicon} onChange={(v) => u('brand.favicon', v)} /></div></Box>
      <Box title="Contact"><F path="contact.whatsapp" label="WhatsApp number (91XXXXXXXXXX, no +)" inputMode="numeric" /><F path="contact.phone" label="Phone" /><F path="contact.email" label="Email" /><F path="contact.hours" label="Hours" /><div className="sm:col-span-2"><F path="contact.address" label="Address" /></div><div className="sm:col-span-2"><F path="contact.mapEmbed" label="Google Maps embed URL" /></div></Box>
      <Box title="Business"><F path="business.legalName" label="Legal name" /><F path="business.gstin" label="GSTIN" /><F path="business.pan" label="PAN" /></Box>
      <Box title="Shipping"><F path="shipping.freeThreshold" label="Free-shipping threshold (₹)" type="number" /><F path="shipping.flatRate" label="Flat rate (₹)" type="number" /><div className="sm:col-span-2"><F path="shipping.deliveryText" label="Delivery estimate text" /></div><div className="sm:col-span-2"><F path="shipping.codNote" label="COD note" /></div>
        <div className="sm:col-span-2"><label className="label">Shipping & COD table</label>
          {s.shipping.table.map((r, i) => <div key={i} className="mb-2 grid gap-2 sm:grid-cols-[2fr_1fr_1.5fr_auto]">{(['zone', 'time', 'charge'] as const).map((k) => <input key={k} className="input" aria-label={k} value={r[k]} onChange={(e) => u('shipping.table', s.shipping.table.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} />)}<button aria-label="Remove row" className="text-red-600" onClick={() => u('shipping.table', s.shipping.table.filter((_, j) => j !== i))}><Trash2 size={15} /></button></div>)}
          <button className="btn-outline !py-1.5" onClick={() => u('shipping.table', [...s.shipping.table, { zone: '', time: '', charge: '' }])}><Plus size={14} />Add row</button></div></Box>
      <Box title="Social"><F path="social.instagram" label="Instagram" /><F path="social.facebook" label="Facebook" /><F path="social.youtube" label="YouTube" /><F path="social.x" label="X" /><F path="social.pinterest" label="Pinterest" /></Box>
      <Box title="SEO"><div className="sm:col-span-2"><F path="seo.title" label="Default meta title" /></div><div className="sm:col-span-2"><F path="seo.description" label="Default meta description" /></div><F path="seo.keywords" label="Keywords" /><div><label className="label">Default OG image</label><ImageInput value={s.seo.ogImage} onChange={(v) => u('seo.ogImage', v)} /></div></Box>
      <Box title="Analytics (loads only after cookie consent)"><F path="analytics.ga4" label="GA4 measurement ID" placeholder="G-XXXXXXXXXX" /><F path="analytics.metaPixel" label="Meta Pixel ID" /></Box>
      <Box title="Announcement bar messages"><div className="space-y-2 sm:col-span-2">{s.announcements.map((a, i) => <div key={i} className="flex gap-2"><input className="input" aria-label={`Message ${i + 1}`} value={a} onChange={(e) => u('announcements', s.announcements.map((x, j) => (j === i ? e.target.value : x)))} /><button aria-label="Remove" className="text-red-600" onClick={() => u('announcements', s.announcements.filter((_, j) => j !== i))}><Trash2 size={15} /></button></div>)}
        <button className="btn-outline !py-1.5" onClick={() => u('announcements', [...s.announcements, ''])}><Plus size={14} />Add message</button></div></Box>
      <Box title="Currency display (NRI toggle, approximate)"><F path="currencyRates.USD" label="1 INR in USD" type="number" step="0.0001" /><F path="currencyRates.AED" label="1 INR in AED" type="number" step="0.0001" /></Box>
      <Box title="Feature toggles">{feats.map((k) => <div key={k} className="flex items-center justify-between rounded-xl border border-gold-500/20 p-3"><span className="text-sm capitalize">{k.replace(/([A-Z])/g, ' $1')}</span><Toggle label={k} checked={s.features[k] !== false} onChange={(v) => u(`features.${k}`, v)} /></div>)}</Box>
      <div className="flex justify-end"><button className="btn-gold" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save settings'}</button></div>
    </div>
  );
}
