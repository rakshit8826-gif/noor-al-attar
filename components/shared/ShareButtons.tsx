'use client';
import { Link2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
export function ShareButtons({ title }: { title: string }) {
  const url = () => location.href;
  return (
    <div className="flex gap-2">
      <a className="chip !py-2" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url())}`; }} href="#"><Share2 size={14} />WhatsApp</a>
      <button className="chip !py-2" onClick={async () => { await navigator.clipboard.writeText(url()); toast('Link copied'); }}><Link2 size={14} />Copy link</button>
    </div>
  );
}
