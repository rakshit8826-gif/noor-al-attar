import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/shared/PageBits';
export const metadata: Metadata = { title: 'Privacy Policy' };
export default function Page() {
  return (<><PageHero title="Privacy Policy" sub="Aligned with India's Digital Personal Data Protection Act, 2023." /><Prose>
    <h2>What we collect</h2><p>We do not take payments or create accounts on this site. When you message us on WhatsApp we receive your number and the details you type. We also log each WhatsApp button click (product, page, device type and approximate city) to understand demand and follow up on enquiries.</p>
    <h2>Local storage</h2><p>Your cart, wishlist, language and theme are stored in your browser only.</p>
    <h2>Cookies & analytics</h2><p>Essential storage is always on. Analytics (Google Analytics / Meta Pixel, if enabled) load only after you accept.</p>
    <h2>Your rights</h2><p>You may ask us to access, correct or erase your data at any time by messaging us on WhatsApp or emailing us. We do not sell personal data.</p>
    <p className="text-sm text-mute">This template is not legal advice — please have it reviewed for your business.</p></Prose></>);
}
