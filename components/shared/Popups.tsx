'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from './Providers';
import { useWhatsApp } from './useWhatsApp';

/** DPDP / GDPR-friendly consent banner — analytics only load after "Accept". */
export function CookieBanner() {
  const { t } = useApp();
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem('noor-consent')) setShow(true); }, []);
  if (!show) return null;
  const set = (v: string) => { localStorage.setItem('noor-consent', v); setShow(false); window.dispatchEvent(new Event('noor-consent')); };
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-xl card !bg-surface p-4 md:bottom-4 md:start-4 md:mx-0">
      <p className="text-sm text-mute">{t('cookie.text')}</p>
      <div className="mt-3 flex gap-2"><button className="btn-gold !py-2" onClick={() => set('all')}>{t('cookie.accept')}</button><button className="btn-outline !py-2" onClick={() => set('essential')}>{t('cookie.decline')}</button></div>
    </div>
  );
}

/** Desktop exit-intent offer: once per session, dismissible. */
export function ExitIntent() {
  const { t, settings } = useApp();
  const { open } = useWhatsApp();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (settings.features?.exitIntent === false || sessionStorage.getItem('noor-exit')) return;
    if (!window.matchMedia('(hover: hover)').matches) return; // desktop pointers only
    const start = Date.now();
    const h = (e: MouseEvent) => {
      // cursor left through the top edge, after the visitor has browsed for a while
      if (e.clientY <= 0 && !e.relatedTarget && Date.now() - start > 10000 && !sessionStorage.getItem('noor-exit')) { sessionStorage.setItem('noor-exit', '1'); setShow(true); }
    };
    document.addEventListener('mouseout', h); return () => document.removeEventListener('mouseout', h);
  }, [settings.features?.exitIntent]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-charcoal-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setShow(false)}>
      <div className="card relative max-w-md !bg-surface p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <button aria-label={t('common.close')} className="absolute end-3 top-3 p-1" onClick={() => setShow(false)}><X size={18} /></button>
        <p className="font-arabic text-5xl text-accent">نور</p>
        <h2 className="mt-2 text-2xl font-bold">{t('exit.title')}</h2>
        <p className="mt-2 text-mute">{t('exit.body')}</p>
        <button className="btn-wa mt-5" onClick={() => { open('I would like the 10% welcome offer (WELCOME10).', { kind: 'generic' }); setShow(false); }}>{t('exit.cta')}</button>
      </div>
    </div>
  );
}

/** Registers the tiny service worker (offline shell) + shows an install prompt hook via beforeinstallprompt. */
export function PwaRegister() {
  useEffect(() => { if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register('/sw.js').catch(() => {}); }, []);
  return null;
}

/** Loads GA4 / Meta Pixel only after consent. */
export function Analytics3P({ ga, pixel }: { ga?: string; pixel?: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk(localStorage.getItem('noor-consent') === 'all');
    check(); window.addEventListener('noor-consent', check); return () => window.removeEventListener('noor-consent', check);
  }, []);
  useEffect(() => {
    if (!ok) return;
    if (ga) {
      const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`; document.head.appendChild(s);
      const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
      w.dataLayer = w.dataLayer || []; w.gtag = function () { w.dataLayer.push(arguments); }; w.gtag('js', new Date()); w.gtag('config', ga);
    }
    if (pixel) {
      const s = document.createElement('script');
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, [ok, ga, pixel]);
  return null;
}
