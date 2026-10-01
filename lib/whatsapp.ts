import type { Product } from './types';
import { formatINR } from './format';

const DEFAULT_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918826838804';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooralattar.in';

export const waUrl = (text: string, number = DEFAULT_NUMBER) =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export const genericMessage = () =>
  process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE || 'I have a question about your attars.';

export interface ProductOrderInput {
  product: Product; size: string; price: number; qty: number;
  giftWrap?: boolean; giftNote?: string; coupon?: string; gst?: boolean;
}

/** Product-page order message (Section 5.5 of the brief). */
export function productMessage(i: ProductOrderInput) {
  const lines = [
    "I'd like to order:", '',
    `🛍️ Product: ${i.product.name.en}`,
    `📦 Size: ${i.size}`,
    `💰 Price: ${formatINR(i.price)}`,
    `🔢 Quantity: ${i.qty}`,
    `🎁 Gift wrap: ${i.giftWrap ? 'Yes' : 'No'}`,
  ];
  if (i.giftWrap && i.giftNote) lines.push(`💌 Gift message: ${i.giftNote}`);
  if (i.coupon) lines.push(`🔖 Coupon: ${i.coupon} (to be applied by your team)`);
  lines.push(`🔗 Link: ${SITE}/product/${i.product.slug}`, '',
    'My details:', 'Name: ', 'City: ', 'PIN: ',
    'Need GST invoice? Yes/No (GSTIN if yes): ', '',
    'Please confirm availability and total amount. Shukriya!');
  return lines.join('\n');
}

export interface CartLine { name: string; slug: string; size: string; price: number; qty: number }
export function cartMessage(lines: CartLine[], o: { subtotal: number; shipping: number; discount: number; total: number; coupon?: string; giftWrap?: boolean; giftNote?: string }) {
  const out = ['I would like to place this order:', ''];
  lines.forEach((l, i) => out.push(`${i + 1}. ${l.name} — ${l.size} × ${l.qty} = ${formatINR(l.price * l.qty)}`));
  out.push('', `Subtotal: ${formatINR(o.subtotal)}`);
  if (o.discount) out.push(`Discount (${o.coupon}): −${formatINR(o.discount)}`);
  out.push(`Shipping: ${o.shipping ? formatINR(o.shipping) : 'FREE'}`, `*Estimated total: ${formatINR(o.total)}*`);
  if (o.coupon) out.push(`🔖 Coupon: ${o.coupon}`);
  if (o.giftWrap) out.push(`🎁 Gift wrap: Yes${o.giftNote ? ` — "${o.giftNote}"` : ''}`);
  out.push('', 'My details:', 'Name: ', 'Address: ', 'City: ', 'PIN: ', 'Need GST invoice? Yes/No (GSTIN if yes): ', '', 'Please confirm availability and payment options (UPI / COD). Shukriya!');
  return out.join('\n');
}

export const bulkMessage = () => 'I need a bulk order for a wedding / event.\nApprox. quantity: \nEvent date: \nCity: ';
export const trackMessage = (id: string) => `Track my order: ${id}`;
export const notifyMessage = (name: string, size: string) => `Please notify me when ${name} (${size}) is back in stock.`;
export const optInMessage = (phone: string) => `Please add me to your WhatsApp list for offers and new arrivals.${phone ? `\nMy number: ${phone}` : ''} (10% off first order)`;
