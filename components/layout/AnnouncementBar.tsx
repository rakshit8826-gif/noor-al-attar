'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/components/shared/Providers';

export function AnnouncementBar() {
  const { settings } = useApp();
  const msgs = settings.announcements?.length ? settings.announcements : [];
  const [i, setI] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => { if (sessionStorage.getItem('noor-ann') === '1') setHidden(true); }, []);
  useEffect(() => {
    if (msgs.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % msgs.length), 4500);
    return () => clearInterval(id);
  }, [msgs.length]);
  if (hidden || !msgs.length) return null;
  return (
    <div className="relative bg-charcoal-900 text-center text-xs text-gold-300 sm:text-sm" role="region" aria-label="Announcements">
      <p key={i} className="animate-in fade-in slide-in-from-bottom-1 px-10 py-2">{msgs[i]}</p>
      <button aria-label="Dismiss announcement" className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 text-gold-300/80 hover:text-gold-300"
        onClick={() => { sessionStorage.setItem('noor-ann', '1'); setHidden(true); }}><X size={14} /></button>
    </div>
  );
}
