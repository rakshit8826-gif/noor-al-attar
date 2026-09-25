import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageBits';
import { TrackForm } from '@/components/shared/TrackForm';
export const metadata: Metadata = { title: 'Track your order' };
export default function Page() {
  return (<><PageHero title="Track your order" sub="Enter your order ID or the phone number used on the order. We will send the latest status on WhatsApp." /><div className="section max-w-xl"><TrackForm /></div></>);
}
