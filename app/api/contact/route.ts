import { NextResponse } from 'next/server';
/** Optional: emails the contact form via Resend (free tier). The site always also opens WhatsApp. */
export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return NextResponse.json({ ok: true, emailed: false });
  const d = (await req.json().catch(() => ({}))) as Record<string, string>;
  const esc = (s = '') => s.replace(/[<>&]/g, '');
  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Noor Al Attar <onboarding@resend.dev>', to: [to], subject: `[Website] ${esc(d.subject)}`, html: `<p>${esc(d.message)}</p><p>${esc(d.name)} · ${esc(d.phone)} · ${esc(d.email)} · ${esc(d.city)}</p>` }),
  }).catch(() => {});
  return NextResponse.json({ ok: true, emailed: true });
}
