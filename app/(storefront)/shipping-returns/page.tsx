import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';
import { PageHero, Prose } from '@/components/shared/PageBits';
export const metadata: Metadata = { title: 'Shipping & Returns' };
export default async function Page() {
  const { shipping: s } = await getSettings();
  return (
    <>
      <PageHero title="Shipping & Returns" />
      <Prose>
        <p>{s.deliveryText}. Orders are confirmed on WhatsApp and dispatched within 24–48 hours of confirmation.</p>
        <h2>Shipping charges</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-sm"><thead><tr className="border-b border-gold-500/40"><th className="p-2 text-start">Zone</th><th className="p-2 text-start">Delivery</th><th className="p-2 text-start">Charge</th></tr></thead>
          <tbody>{s.table.map((r) => <tr key={r.zone} className="border-b border-gold-500/20"><td className="p-2">{r.zone}</td><td className="p-2">{r.time}</td><td className="p-2">{r.charge}</td></tr>)}</tbody></table></div>
        <h2>Cash on Delivery</h2><p>{s.codNote}</p>
        <h2>Returns & replacements</h2>
        <ul><li>7-day replacement for damaged or wrong items.</li><li>Please record an unboxing video and share it on WhatsApp within 48 hours of delivery.</li><li>Opened or used attars cannot be returned as they are personal-care products.</li></ul>
        <h2>NRI gifting & international</h2><p>Shipping to the USA, UK or UAE? Message us on WhatsApp for rates and timelines.</p>
      </Prose>
    </>
  );
}
