import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/shared/PageBits';
export const metadata: Metadata = { title: 'Accessibility statement' };
export default function Page() {
  return (<><PageHero title="Accessibility statement" /><Prose>
    <p>We aim for WCAG 2.1 AA: keyboard navigation with visible gold focus rings, alt text on product images, sufficient colour contrast, reduced-motion support and full right-to-left layout in Arabic.</p>
    <p>If something is hard to use, please tell us on WhatsApp and we will fix it.</p></Prose></>);
}
