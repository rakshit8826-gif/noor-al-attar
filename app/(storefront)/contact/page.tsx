import type { Metadata } from 'next';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { getSettings } from '@/lib/data';
import { PageHero } from '@/components/shared/PageBits';
import { ContactForm } from '@/components/shared/ContactForm';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
export const metadata: Metadata = { title: 'Contact us', description: 'Visit our store, call, email or chat instantly on WhatsApp.' };
export default async function Contact() {
  const { contact: c } = await getSettings();
  return (
    <>
      <PageHero title="Get in touch" ar="تواصل معنا" sub="Questions about an attar, a wedding order or a gift for family abroad? We reply fastest on WhatsApp." />
      <div className="section grid gap-8 lg:grid-cols-2">
        <ContactForm />
        <div className="space-y-5">
          <WhatsAppButton label="Chat instantly on WhatsApp" className="w-full !py-4 text-base" />
          <ul className="card space-y-4 p-6 text-sm">
            <li className="flex gap-3"><MapPin className="shrink-0 text-accent" size={18} />{c.address}</li>
            <li className="flex gap-3"><Phone className="shrink-0 text-accent" size={18} /><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>
            <li className="flex gap-3"><Mail className="shrink-0 text-accent" size={18} /><a href={`mailto:${c.email}`}>{c.email}</a></li>
            <li className="flex gap-3"><Clock className="shrink-0 text-accent" size={18} />{c.hours}</li>
          </ul>
          {c.mapEmbed && <iframe title="Store location map" src={c.mapEmbed} loading="lazy" className="h-64 w-full rounded-2xl border border-gold-500/30" referrerPolicy="no-referrer-when-downgrade" />}
        </div>
      </div>
    </>
  );
}
