'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export default function Login() {
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) { location.href = '/admin/dashboard'; return; }
    toast.error((await res.json().catch(() => ({}))).error || 'Login failed'); setBusy(false);
  };
  return (
    <div className="pattern grid min-h-screen place-items-center bg-page p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 !bg-surface p-8 text-center">
        <p className="font-arabic text-5xl text-accent">نور</p>
        <h1 className="text-2xl font-bold">Admin sign in</h1>
        <div className="relative"><Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-mute" />
          <input type="password" autoFocus autoComplete="current-password" className="input !ps-10" placeholder="Password" aria-label="Password" value={pw} onChange={(e) => setPw(e.target.value)} required /></div>
        <button className="btn-gold w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-xs text-mute">OTP / Google sign-in can be added here later.</p>
      </form>
    </div>
  );
}
