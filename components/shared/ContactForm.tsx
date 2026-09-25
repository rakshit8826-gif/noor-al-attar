'use client';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useWhatsApp } from './useWhatsApp';

const schema = z.object({ name: z.string().min(2, 'Please enter your name'), phone: z.string().regex(/^[+\d][\d\s-]{7,14}$/, 'Enter a valid phone number'), email: z.string().email('Enter a valid email').or(z.literal('')), subject: z.string().min(2), message: z.string().min(5, 'Tell us a little more') });
const CITIES = ['Mumbai', 'Delhi', 'Hyderabad', 'Lucknow', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Kannauj', 'Bhopal', 'Kochi'];

export function ContactForm() {
  const { open } = useWhatsApp();
  const [f, setF] = useState({ name: '', phone: '', email: '', city: '', subject: '', message: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErr({});
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }).catch(() => {}); // optional email via Resend
    toast.success('Opening WhatsApp…');
    open(`Assalamu Alaikum Noor Al Attar 🌙\n\nSubject: ${f.subject}\n${f.message}\n\nName: ${f.name}\nPhone: ${f.phone}${f.email ? `\nEmail: ${f.email}` : ''}${f.city ? `\nCity: ${f.city}` : ''}`, { kind: 'generic' });
  };
  const field = (k: keyof typeof f, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div><label className="label" htmlFor={k}>{label}</label><input id={k} className="input" value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} {...props} />{err[k] && <p className="mt-1 text-xs text-red-600" role="alert">{err[k]}</p>}</div>
  );
  return (
    <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">{field('name', 'Name', { autoComplete: 'name' })}{field('phone', 'Phone / WhatsApp', { inputMode: 'tel', autoComplete: 'tel' })}</div>
      <div className="grid gap-4 sm:grid-cols-2">{field('email', 'Email (optional)', { type: 'email', autoComplete: 'email' })}{field('city', 'City', { list: 'cities' })}<datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist></div>
      {field('subject', 'Subject')}
      <div><label className="label" htmlFor="message">Message</label><textarea id="message" className="input min-h-32" value={f.message} onChange={set('message')} />{err.message && <p className="mt-1 text-xs text-red-600" role="alert">{err.message}</p>}</div>
      <button className="btn-wa w-full"><MessageCircle size={16} />Send via WhatsApp</button>
    </form>
  );
}
