'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tags, Layers, Image as ImageIcon, MessageSquareQuote, BookOpen, Ticket, Inbox, Settings, Menu, LogOut, ExternalLink, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { LanguageSwitcher, ThemeToggle } from '@/components/shared/Switchers';
import { cn } from '@/lib/utils';

const NAV = [
  ['/admin/dashboard', 'Dashboard', LayoutDashboard], ['/admin/products', 'Products', Package], ['/admin/categories', 'Categories', Tags], ['/admin/collections', 'Collections', Layers],
  ['/admin/banners', 'Banners', ImageIcon], ['/admin/testimonials', 'Testimonials', MessageSquareQuote], ['/admin/blog', 'Blog', BookOpen], ['/admin/coupons', 'Coupons', Ticket],
  ['/admin/inquiries', 'Inquiries', Inbox], ['/admin/settings', 'Settings', Settings],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => setMobile(false), [path]);
  // Keyboard shortcut: N → new product (when not typing)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable || e.metaKey || e.ctrlKey) return;
      if (e.key.toLowerCase() === 'n') router.push('/admin/products/new');
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [router]);
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); location.href = '/admin/login'; };

  const Nav = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
      {NAV.map(([href, label, Icon]) => (
        <Link key={href} href={href} title={label} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-gold-500/10', path.startsWith(href) && 'bg-gold-500/20 text-accent')}>
          <Icon size={18} className="shrink-0" />{!collapsed && label}
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gold-500/30 bg-surface/90 px-4 backdrop-blur">
        <button className="btn-ghost !p-2 lg:hidden" aria-label="Menu" onClick={() => setMobile(true)}><Menu size={20} /></button>
        <Link href="/admin/dashboard" className="flex items-baseline gap-2"><span className="font-arabic text-2xl font-bold text-accent">نور</span><span className="font-display font-bold">Admin</span></Link>
        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitcher className="max-sm:hidden" /><ThemeToggle />
          <Link href="/" target="_blank" className="btn-ghost !py-1.5 text-xs"><ExternalLink size={14} />View site</Link>
          <button className="btn-ghost !py-1.5 text-xs" onClick={logout}><LogOut size={14} />Logout</button>
        </div>
      </header>
      <div className="flex">
        <aside className={cn('sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto border-e border-gold-500/30 bg-surface/60 transition-all lg:block', collapsed ? 'w-16' : 'w-56')}>
          {Nav}
          <button className="m-3 hidden rounded-xl p-2 text-mute hover:bg-gold-500/10 lg:block" aria-label="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}</button>
        </aside>
        {mobile && <div className="fixed inset-0 z-40 bg-charcoal-900/50 lg:hidden" onClick={() => setMobile(false)}><aside className="h-full w-64 bg-surface" onClick={(e) => e.stopPropagation()}>{Nav}</aside></div>}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
