import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/shared/PageBits';
export const metadata: Metadata = { title: 'Terms & Conditions' };
export default function Page() {
  return (<><PageHero title="Terms & Conditions" /><Prose>
    <h2>Orders</h2><p>Prices shown are indicative and inclusive of GST. An order is confirmed only after our team confirms availability and the total on WhatsApp.</p>
    <h2>Payment</h2><p>This website does not process payments. Payment options (UPI, bank transfer, COD) are arranged directly on WhatsApp.</p>
    <h2>Coupons</h2><p>Coupon codes are applied by our team at confirmation and are subject to minimum order and expiry.</p>
    <h2>Product information</h2><p>Attars are natural products; colour and fragrance may vary slightly between batches.</p>
    <h2>Governing law</h2><p>These terms are governed by the laws of India.</p></Prose></>);
}
