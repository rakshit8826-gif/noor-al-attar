'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Plus, ImageIcon, Inbox } from 'lucide-react';
import type { ActivityLog, Inquiry, Product } from '@/lib/types';
import { list } from '@/lib/adminApi';
import { PageTitle, Skeleton } from './Bits';
import { formatINR } from '@/lib/format';

function LineChart({ data }: { data: { label: string; v: number }[] }) {
  const w = 600, h = 180, pad = 24, max = Math.max(3, ...data.map((d) => d.v));
  const x = (i: number) => pad + (i * (w - pad * 2)) / (data.length - 1), y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const pts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="WhatsApp clicks over the last 30 days">
      {[0, 0.5, 1].map((t) => <g key={t}><line x1={pad} x2={w - pad} y1={y(max * t)} y2={y(max * t)} stroke="#C9A961" strokeOpacity=".25" /><text x={4} y={y(max * t) + 4} fontSize="10" fill="currentColor" opacity=".5">{Math.round(max * t)}</text></g>)}
      <polygon points={`${pad},${h - pad} ${pts} ${w - pad},${h - pad}`} fill="#C9A961" fillOpacity=".15" />
      <polyline points={pts} fill="none" stroke="#B08F4A" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (i % 7 === 0 || i === data.length - 1) && <text key={i} x={x(i)} y={h - 6} fontSize="10" textAnchor="middle" fill="currentColor" opacity=".55">{d.label}</text>)}
    </svg>
  );
}
function BarChart({ data }: { data: { label: string; v: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.v));
  return <div className="space-y-2">{data.map((d) => <div key={d.label} className="flex items-center gap-2 text-xs"><span className="w-24 shrink-0 truncate capitalize">{d.label}</span><div className="h-4 flex-1 overflow-hidden rounded-full bg-deep"><div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600" style={{ width: `${(d.v / max) * 100}%` }} /></div><span className="w-5 text-end text-mute">{d.v}</span></div>)}</div>;
}

export function Dashboard() {
  const [p, setP] = useState<Product[] | null>(null);
  const [inq, setInq] = useState<Inquiry[]>([]);
  const [log, setLog] = useState<ActivityLog[]>([]);
  useEffect(() => { Promise.all([list<Product>('products'), list<Inquiry>('inquiries'), list<ActivityLog>('activity')]).then(([a, b, c]) => { setP(a.items); setInq(b.items); setLog(c.items); }).catch(() => setP([])); }, []);

  const s = useMemo(() => {
    const prods = p ?? [];
    const week = Date.now() - 7 * 864e5;
    const out = prods.filter((x) => x.variants.every((v) => v.stock <= 0));
    const counts: Record<string, number> = {}; inq.forEach((i) => i.productNames.forEach((n) => { counts[n] = (counts[n] || 0) + 1; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const cc: Record<string, number> = {}; inq.forEach((i) => i.productIds.forEach((id) => { const c = prods.find((x) => x.id === id)?.category; if (c) cc[c] = (cc[c] || 0) + 1; }));
    const topCat = Object.entries(cc).sort((a, b) => b[1] - a[1])[0];
    const days = Array.from({ length: 30 }, (_, k) => { const d = new Date(Date.now() - (29 - k) * 864e5); return { key: d.toDateString(), label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), v: 0 }; });
    inq.forEach((i) => { const d = days.find((x) => x.key === new Date(i.createdAt).toDateString()); if (d) d.v++; });
    const byCat: Record<string, number> = {}; prods.forEach((x) => { byCat[x.category] = (byCat[x.category] || 0) + 1; });
    return {
      cards: [['Total products', prods.length], ['Published', prods.filter((x) => x.status === 'published').length], ['Drafts', prods.filter((x) => x.status === 'draft').length], ['Out of stock', out.length], ['Total inquiries', inq.length], ['WhatsApp clicks (7d)', inq.filter((i) => +new Date(i.createdAt) > week).length], ['Top product', top?.[0] ?? '—'], ['Top category', topCat?.[0]?.replace('-', ' ') ?? '—']] as [string, string | number][],
      days, byCat: Object.entries(byCat).map(([label, v]) => ({ label: label.replace('-', ' '), v })),
      low: prods.flatMap((x) => x.variants.filter((v) => v.stock <= 5).map((v) => ({ name: x.name.en, size: v.size, stock: v.stock, id: x.id }))),
    };
  }, [p, inq]);

  if (!p) return <Skeleton rows={6} />;
  return (
    <div>
      <PageTitle title="Dashboard" sub="Shukriya for keeping the store fragrant.">
        <Link href="/admin/products/new" className="btn-gold !py-2"><Plus size={15} />Add product</Link>
        <Link href="/admin/banners" className="btn-outline !py-2"><ImageIcon size={15} />Add banner</Link>
        <Link href="/admin/inquiries" className="btn-outline !py-2"><Inbox size={15} />Inquiries</Link>
      </PageTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {s.cards.map(([l, v]) => <div key={l} className="card !bg-surface p-4"><p className="text-xs text-mute">{l}</p><p className="mt-1 truncate font-display text-2xl font-bold capitalize">{v}</p></div>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card !bg-surface p-5 lg:col-span-2"><h2 className="mb-2 font-semibold">WhatsApp clicks — last 30 days</h2><LineChart data={s.days} /></div>
        <div className="card !bg-surface p-5"><h2 className="mb-3 font-semibold">Products by category</h2><BarChart data={s.byCat} /></div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card !bg-surface p-5"><h2 className="mb-3 font-semibold">Recent inquiries</h2>
          {inq.length === 0 ? <p className="text-sm text-mute">No WhatsApp clicks logged yet.</p> : <ul className="divide-y divide-gold-500/15 text-sm">{inq.slice(0, 10).map((i) => <li key={i.id} className="flex justify-between gap-3 py-2"><span className="truncate">{i.productNames.join(', ') || i.kind}</span><span className="shrink-0 text-xs text-mute">{i.cartValue ? formatINR(i.cartValue) + ' · ' : ''}{new Date(i.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></li>)}</ul>}</div>
        <div className="card !bg-surface p-5"><h2 className="mb-3 flex items-center gap-2 font-semibold"><AlertTriangle size={16} className="text-amber-600" />Low-stock alerts</h2>
          {s.low.length === 0 ? <p className="text-sm text-mute">All sizes are well stocked.</p> : <ul className="divide-y divide-gold-500/15 text-sm">{s.low.map((l, k) => <li key={k} className="flex justify-between py-2"><Link href={`/admin/products/${l.id}`} className="hover:text-accent">{l.name} · {l.size}</Link><b className={l.stock === 0 ? 'text-red-600' : 'text-amber-600'}>{l.stock}</b></li>)}</ul>}</div>
      </div>
      <div className="card mt-4 !bg-surface p-5"><h2 className="mb-3 font-semibold">Activity log</h2>
        {log.length === 0 ? <p className="text-sm text-mute">Actions you take in the admin will be listed here.</p> : <ul className="divide-y divide-gold-500/15 text-sm">{log.slice(0, 8).map((l) => <li key={l.id} className="flex justify-between gap-3 py-2"><span><b className="capitalize">{l.action}</b> {l.entity}: {l.target}</span><span className="shrink-0 text-xs text-mute">{new Date(l.at).toLocaleString('en-IN')}</span></li>)}</ul>}</div>
    </div>
  );
}
