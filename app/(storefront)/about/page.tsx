import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageBits';
import { BottleArt } from '@/components/shared/ProductImage';
export const metadata: Metadata = { title: 'Our story — Crafted in India, inspired by Arabia' };
const VALUES = [['Purity', 'No alcohol, no synthetic fillers — only botanical distillates and aged woods.'], ['Tradition', 'Copper degs, bhapka distillation and patient ageing, as practised in Kannauj for centuries.'], ['Sustainability', 'Responsibly sourced agarwood and sandalwood, refillable glass, minimal plastic.'], ['Craft', 'Small batches, hand-blended and hand-labelled by our perfumers.']];
const TIMELINE = [['2015', 'Founded in Kannauj by a family of attar distillers.'], ['2018', 'First store opens; oud and musk from Arabia join the range.'], ['2021', 'We go online — orders on WhatsApp across India.'], ['2024', 'Pan-India delivery with NRI gifting to the UAE, UK and USA.']];
export default function About() {
  return (
    <>
      <PageHero title="Crafted in India, inspired by Arabia" ar="عطر الشرق الأصيل" sub="Noor Al Attar brings the patience of Kannauj's distillers together with the oud and musk traditions of the Arabian Peninsula." />
      <section className="section grid items-center gap-10 md:grid-cols-2">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-t-[999px] rounded-b-2xl border border-gold-500/50 shadow-goldlg"><div className="aspect-[4/5]"><BottleArt category="oud" /></div></div>
        <div className="space-y-4 text-lg leading-relaxed text-mute">
          <h2 className="font-display text-3xl font-bold text-ink">From the degs of Kannauj</h2>
          <p>In Kannauj, flowers are still distilled in copper vessels over wood fire, and the vapour is captured in sandalwood oil — a craft called <em>deg-bhapka</em>. It takes days to produce a few grams of rose attar, and it cannot be hurried.</p>
          <p>We pair that craft with agarwood from Assam and Cambodia and with musks and ambers in the style of the Haramain and the Gulf. The result: attars that feel familiar to an Indian wardrobe and worthy of an Arabian majlis.</p>
        </div>
      </section>
      <section className="bg-deep"><div className="section"><h2 className="mb-8 text-center text-3xl font-bold">What we stand for</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{VALUES.map(([t, d]) => <div key={t} className="card p-6"><h3 className="text-xl font-semibold text-accent">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p></div>)}</div></div></section>
      <section className="section"><h2 className="mb-8 text-center text-3xl font-bold">Our journey</h2>
        <ol className="mx-auto max-w-2xl border-s border-gold-500/50">{TIMELINE.map(([y, d]) => <li key={y} className="relative pb-8 ps-6"><span className="absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full bg-gold-500" /><p className="font-display text-xl font-bold text-accent">{y}</p><p className="text-mute">{d}</p></li>)}</ol></section>
      <section className="section text-center"><h2 className="text-3xl font-bold">Our authenticity promise</h2><p className="mx-auto mt-3 max-w-xl text-mute">Every batch is tested for purity. If an attar is not what we described, we will replace it — no questions asked.</p><Link href="/contact" className="btn-gold mt-6">Visit our store</Link></section>
    </>
  );
}
