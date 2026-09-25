'use client';
import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-charcoal-900/50 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={`card my-8 w-full !bg-surface p-6 ${wide ? 'max-w-3xl' : 'max-w-lg'}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button aria-label="Close" onClick={onClose}><X size={20} /></button></div>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ title, message, confirmLabel = 'Delete', requireText, onConfirm, onClose }: { title: string; message: string; confirmLabel?: string; requireText?: string; onConfirm: () => void; onClose: () => void }) {
  const [typed, setTyped] = useState('');
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-mute">{message}</p>
      {requireText && <div className="mt-3"><label className="label">Type “{requireText}” to confirm</label><input className="input" value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus /></div>}
      <div className="mt-5 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn bg-red-600 text-white hover:bg-red-700" disabled={!!requireText && typed !== requireText} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button></div>
    </Modal>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-gold-500' : 'bg-charcoal-700/30'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'start-[22px]' : 'start-0.5'}`} />
    </button>
  );
}

/** Paste-a-URL image field with optional upload to Vercel Blob. */
export function ImageInput({ value, onChange, label = 'Image URL' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) { onChange(j.url); toast.success('Uploaded'); } else toast.error(j.error || 'Upload failed');
  };
  return (
    <div className="flex gap-2">
      <input className="input" placeholder={label} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />
      <button type="button" className="btn-outline shrink-0 !px-3" disabled={busy} onClick={() => ref.current?.click()} aria-label="Upload image"><Upload size={16} /></button>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
    </div>
  );
}

export const PageTitle = ({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>{sub && <p className="text-sm text-mute">{sub}</p>}</div><div className="flex flex-wrap gap-2">{children}</div></div>
);
export const EmptyState = ({ text, action }: { text: string; action?: React.ReactNode }) => (
  <div className="card grid place-items-center p-12 text-center"><p className="font-arabic text-5xl text-accent/60">ن</p><p className="mt-2 text-mute">{text}</p>{action && <div className="mt-4">{action}</div>}</div>
);
export const Skeleton = ({ rows = 5 }: { rows?: number }) => <div className="space-y-3">{Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>;
