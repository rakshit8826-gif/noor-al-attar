'use client';
import { useCallback } from 'react';
import { useApp } from './Providers';
import { waUrl } from '@/lib/whatsapp';
import type { Inquiry } from '@/lib/types';

type Meta = Partial<Pick<Inquiry, 'kind' | 'productIds' | 'productNames' | 'cartValue'>>;

/**
 * Opens WhatsApp with a pre-filled message and logs the click as an inquiry
 * (fire-and-forget; never blocks the redirect).
 */
export function useWhatsApp() {
  const { settings } = useApp();
  const number = settings.contact?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const open = useCallback((text: string, meta: Meta = {}) => {
    try {
      const body = JSON.stringify({ kind: 'generic', productIds: [], productNames: [], cartValue: 0, ...meta, pageUrl: location.href, referrer: document.referrer });
      navigator.sendBeacon?.('/api/inquiries', new Blob([body], { type: 'application/json' })) ||
        fetch('/api/inquiries', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
    } catch {}
    window.open(waUrl(text, number), '_blank', 'noopener');
  }, [number]);
  return { open, number };
}
