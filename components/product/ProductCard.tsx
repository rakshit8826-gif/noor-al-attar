'use client';
import Link from 'next/link';
import { Heart, ArrowRightLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { useApp } from '@/components/shared/Providers';
import { useWhatsApp } from '@/components/shared/useWhatsApp';
import { ProductImage } from '@/components/shared/ProductImage';
import { Price, Stars } from '@/components/shared/Bits';
import { useWishlist, useCompare, useHydrated } from '@/lib/stores';
import { defaultVariant, inStock, minPrice } from '@/lib/product';
import { discountPct } from '@/lib/format';
import { productMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export function ProductCard({ product: p, list = false, priority = false }: { product: Product; list?: boolean; priority?: boolean }) {
  const { t, L, settings } = useApp();
  const { open } = useWhatsApp();
  const hydrated = useHydrated();
  const wished = useWishlist((s) => s.ids.includes(p.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const compared = useCompare((s) => s.ids.includes(p.id));
  const toggleCompare = useCompare((s) => s.toggle);
  const v = defaultVariant(p);
  const off = discountPct(v.price, v.mrp);
  const stock = inStock(p);
  const single = p.variants.length === 1;

  const order = () => {
    open(productMessage({ product: p, size: v.size, price: v.price, qty: 1 }), { kind: 'product', productIds: [p.id], productNames: [p.name.en], cartValue: v.price });
  };
  return (
    <article className={cn('group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-goldlg', list && 'flex')}>
      <div className={cn('relative', list ? 'w-40 shrink-0 sm:w-56' : '')}>
        <Link href={`/product/${p.slug}`} aria-label={L(p.name)}>
          <ProductImage images={p.images} category={p.category} alt={p.name.en} className={cn('transition duration-500 group-hover:scale-[1.05]', list ? 'h-full min-h-[10rem]' : 'aspect-[4/5]')} priority={priority} />
        </Link>
        <div className="pointer-events-none absolute start-2 top-2 flex flex-col gap-1">
          {off > 0 && <span className="rounded-full bg-rosegold-500 px-2 py-0.5 text-[11px] font-semibold text-white">{off}{t('common.off')}</span>}
          {p.tags.includes('new') && <span className="rounded-full bg-emerald_ar px-2 py-0.5 text-[11px] font-semibold text-white">New</span>}
          {p.tags.includes('limited') && <span className="rounded-full bg-charcoal-800 px-2 py-0.5 text-[11px] font-semibold text-gold-300">Limited</span>}
        </div>
        <div className="absolute end-2 top-2 flex flex-col gap-1.5">
          {settings.features?.wishlist !== false && (
            <button aria-label={t('product.wishlist')} aria-pressed={hydrated && wished}
              onClick={() => { toggleWish(p.id); toast(wished ? 'Removed from wishlist' : 'Saved to wishlist'); }}
              className="grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-rosegold-600 shadow transition hover:scale-110">
              <Heart size={17} className={hydrated && wished ? 'fill-rosegold-500' : ''} />
            </button>
          )}
          {settings.features?.compare !== false && (
            <button aria-label={t('product.compare')} aria-pressed={hydrated && compared}
              onClick={() => { const ok = toggleCompare(p.id); if (!ok) toast('You can compare up to 3 attars'); }}
              className={cn('grid h-9 w-9 place-items-center rounded-full bg-surface/90 shadow transition hover:scale-110 max-md:hidden', hydrated && compared ? 'text-emerald_ar' : 'text-ink/60')}>
              <ArrowRightLeft size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${p.slug}`} className="font-display text-lg font-semibold leading-snug hover:text-accent">{L(p.name)}</Link>
        {list && <p className="mt-1 line-clamp-2 text-sm text-mute">{L(p.shortDescription)}</p>}
        <div className="mt-1.5 flex items-center gap-2 text-xs text-mute"><Stars value={p.rating} /><span>{p.rating} ({p.reviewCount})</span></div>
        <div className="mt-2 flex items-baseline gap-2">
          {!single && <span className="text-xs text-mute">{t('common.from')}</span>}
          <Price value={minPrice(p)} className="text-lg font-semibold text-accent" />
          {off > 0 && single && <Price value={v.mrp} className="text-sm text-mute line-through" />}
        </div>
        <div className="mt-auto pt-4">
          {stock ? (
            <button onClick={order} className="btn-wa w-full !py-2.5"><MessageCircle size={16} />{t('product.order')}</button>
          ) : (
            <button disabled className="btn w-full border border-line/30 !py-2.5 text-mute">{t('product.outOfStock')}</button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, list, cols = 'lg:grid-cols-4' }: { products: Product[]; list?: boolean; cols?: string }) {
  return (
    <div className={cn(list ? 'grid gap-4' : `grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 ${cols}`)}>
      {products.map((p, i) => <ProductCard key={p.id} product={p} list={list} priority={i < 2} />)}
    </div>
  );
}
