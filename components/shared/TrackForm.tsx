'use client';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useWhatsApp } from './useWhatsApp';
import { trackMessage } from '@/lib/whatsapp';
export function TrackForm() {
  const { open } = useWhatsApp();
  const [v, setV] = useState('');
  return (
    <form className="card space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); if (v.trim()) open(trackMessage(v.trim())); }}>
      <label className="label" htmlFor="oid">Order ID or phone number</label>
      <input id="oid" className="input" value={v} onChange={(e) => setV(e.target.value)} placeholder="e.g. NAA-1042 or 98xxxxxx10" required />
      <button className="btn-wa w-full"><MessageCircle size={16} />Track on WhatsApp</button>
    </form>
  );
}
