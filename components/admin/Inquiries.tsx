'use client';
import { useEffect, useMemo, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Inquiry } from '@/lib/types';
import { list, update, remove, download, toCSV } from '@/lib/adminApi';
import { Confirm, EmptyState, PageTitle, Skeleton } from './Bits';
import { formatINR } from '@/lib/format';

const STATUSES: Inquiry['status'][] = ['new', 'contacted', 'converted', 'lost'];
const COLORS: Record<string, string> = { new: 'bg-gold-500/25', contacted: 'bg-sky-500/20', converted: 'bg-emerald_ar/20', lost: 'bg-charcoal-700/15' };

export function Inquiries() {
  const [items, setItems] = useState<Inquiry[] | null>(null);
  const [q, setQ] = useState(''); const [st, setSt] = useState(''); const [kind, setKind] = useState('');
  const [del, setDel] = useState<Inquiry | null>(null);
  const load = () => list<Inquiry>('inquiries').then((r) => setItems(r.items)).catch((e) => { toast.error(e.message); setItems([]); });
  useEffect(() => { load(); }, []);
  const shown = useMemo(() => (items ?? []).filter((i) => (!st || i.status === st) && (!kind || i.kind === kind) && (!q || JSON.stringify(i).toLowerCase().includes(q.toLowerCase()))), [items, q, st, kind]);
  const patch = async (i: Inquiry, p: Partial<Inquiry>) => {
    setItems((c) => (c ?? []).map((x) => (x.id === i.id ? { ...x, ...p } : x)));
    try { await update('inquiries', { ...i, ...p }); } catch (e) { toast.error((e as Error).message); load(); }
  };
  return (
    <div>
      <PageTitle title="Inquiries & leads" sub="Every WhatsApp click on the site, logged automatically.">
        <button className="btn-outline !py-2" onClick={() => download('inquiries.csv', toCSV(shown.map((i) => ({ date: i.createdAt, type: i.kind, products: i.productNames, cartValue: i.cartValue, page: i.pageUrl, referrer: i.referrer, device: i.device, city: i.city, status: i.status, note: i.note }))), 'text/csv')}><Download size={15} />Export CSV</button>
      </PageTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input !w-56" placeholder="Search" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input !w-36" aria-label="Status" value={st} onChange={(e) => setSt(e.target.value)}><option value="">All status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="input !w-36" aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value)}><option value="">All types</option>{['product', 'cart', 'generic', 'quiz', 'bulk', 'notify'].map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {items === null ? <Skeleton /> : shown.length === 0 ? <EmptyState text="No inquiries yet. They appear here when visitors tap a WhatsApp button." /> : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/30 bg-surface">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-deep text-xs text-mute"><tr>{['When', 'Type', 'Products', 'Value', 'Device / City', 'Status', 'Note', ''].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
            <tbody>{shown.map((i) => (
              <tr key={i.id} className="border-t border-gold-500/15 align-top">
                <td className="whitespace-nowrap p-3 text-xs">{new Date(i.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                <td className="p-3 capitalize">{i.kind}</td>
                <td className="max-w-[220px] p-3">{i.productNames.join(', ') || <a className="text-accent underline" href={i.pageUrl} target="_blank" rel="noreferrer">page</a>}</td>
                <td className="p-3">{i.cartValue ? formatINR(i.cartValue) : '—'}</td>
                <td className="p-3 text-xs">{i.device}{i.city && ` · ${i.city}`}</td>
                <td className="p-3"><select aria-label="Lead status" className={`rounded-full border-0 px-2 py-1 text-xs ${COLORS[i.status]}`} value={i.status} onChange={(e) => patch(i, { status: e.target.value as Inquiry['status'] })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                <td className="p-3"><input className="input !py-1.5 !text-xs" aria-label="Note" defaultValue={i.note} placeholder="Add note" onBlur={(e) => e.target.value !== i.note && patch(i, { note: e.target.value })} /></td>
                <td className="p-3"><button aria-label="Delete" className="text-red-600" onClick={() => setDel(i)}><Trash2 size={15} /></button></td>
              </tr>))}</tbody>
          </table>
        </div>)}
      {del && <Confirm title="Delete this inquiry?" message="It will be removed from the lead list." onConfirm={() => remove('inquiries', [del.id]).then(load)} onClose={() => setDel(null)} />}
    </div>
  );
}
