'use client';
import { MessageCircle } from 'lucide-react';
import { useWhatsApp } from './useWhatsApp';
import { genericMessage } from '@/lib/whatsapp';
import type { Inquiry } from '@/lib/types';
import { cn } from '@/lib/utils';

export function WhatsAppButton({ label, message, kind = 'generic', className }: { label: string; message?: string; kind?: Inquiry['kind']; className?: string }) {
  const { open } = useWhatsApp();
  return <button className={cn('btn-wa', className)} onClick={() => open(message || genericMessage(), { kind })}><MessageCircle size={18} />{label}</button>;
}
