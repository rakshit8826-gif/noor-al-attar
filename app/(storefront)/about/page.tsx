import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageBits';
export const metadata: Metadata = { title: 'Our story — Crafted in India, inspired by Arabia' };
const VALUES = [['Purity', 'No alcohol, no synthetic fillers — only botanical distillates and aged woods.'], ['Tradition', 'Copper degs, bhapka distillation and patient ageing, as practised in Kannauj for centuries.'], ['Sustainability', 'Responsibly sourced agarwood and sandalwood, refillable glass, minimal plastic.'], ['Craft', 'Small batches, hand-blended and hand-labelled by our perfumers.']];
export default function About() {
  return (
    <>
      <PageHero title="Crafted in India, inspired by Arabia" ar="عطر الشرق الأصيل" sub="Noor Al Attar brings the patience of Kannauj's distillers together with the oud and musk traditions of the Arabian Peninsula." />
      <section className="section mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Attars, made to be worn</h2>
        <p className="mt-4 text-lg leading-relaxed text-mute">Noor Al Attar brings together classic Indian attars and Arabian-style oud, musk and amber — alcohol-free oils chosen for people who love a fragrance that lasts and feels personal.</p>
      </section>
      <section className="bg-deep"><div className="section"><h2 className="mb-8 text-center text-3xl font-bold">What we stand for</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{VALUES.map(([t, d]) => <div key={t} className="card p-6"><h3 className="text-xl font-semibold text-accent">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p></div>)}</div></div></section>
    </>
  );
}
