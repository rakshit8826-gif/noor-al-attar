import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageBits';
import { FaqAccordion } from '@/components/home/Sections';
import { faqJsonLd } from '@/lib/seo';
import { FAQS } from '@/lib/content';
export const metadata: Metadata = { title: 'FAQ — attar, shipping, COD, returns' };
export default function Page() {
  return (<><PageHero title="Frequently asked questions" /><div className="section"><FaqAccordion /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} /></>);
}
