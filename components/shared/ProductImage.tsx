import Image from 'next/image';
import { cn } from '@/lib/utils';

// 1×1 warm-sand pixel used as blur placeholder for every remote/uploaded image
const BLUR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjEwIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0YzRURFMyIvPjwvc3ZnPg==';

const TONES: Record<string, [string, string]> = {
  oud: ['#7A4E2A', '#3B2412'], musk: ['#F1E8D8', '#D9C9A8'], rose: ['#E8A0AC', '#B76E79'], amber: ['#E6B04F', '#A8721C'],
  'sandal-khus': ['#D8BE94', '#8C7A4B'], bakhoor: ['#8B5A34', '#4A2C17'], dhoop: ['#A97C50', '#5A3A1E'], 'gift-sets': ['#B76E79', '#7E3E4B'],
  amber2: ['#E6B04F', '#A8721C'], rose2: ['#E8A0AC', '#B76E79'], oud2: ['#7A4E2A', '#3B2412'],
};
const shape = (c: string) => (c === 'bakhoor' || c === 'dhoop' ? 'jar' : c === 'gift-sets' ? 'box' : 'bottle');

/** Illustrated placeholder used until real photos are uploaded — keeps the catalogue looking finished. */
export function BottleArt({ category = 'oud', className }: { category?: string; className?: string }) {
  const [a, b] = TONES[category] || ['#D4B978', '#8E7239'];
  const s = shape(category);
  const id = `g-${category}`;
  return (
    <svg viewBox="0 0 200 250" className={cn('h-full w-full', className)} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#FFFDF9" /><stop offset="1" stopColor="#EFE6D6" /></radialGradient>
        <linearGradient id={`${id}-liq`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E0C98A" /><stop offset=".55" stopColor="#C9A961" /><stop offset="1" stopColor="#8E7239" /></linearGradient>
      </defs>
      <rect width="200" height="250" fill={`url(#${id}-bg)`} />
      <g opacity=".12" stroke="#B08F4A" fill="none"><rect x="70" y="30" width="60" height="60" /><rect x="70" y="30" width="60" height="60" transform="rotate(45 100 60)" /></g>
      <ellipse cx="100" cy="222" rx="52" ry="7" fill="#3B342E" opacity=".14" />
      {s === 'bottle' && (
        <g>
          <rect x="88" y="78" width="24" height="26" rx="4" fill="#E8DCC8" stroke="#C9A961" strokeOpacity=".6" />
          <rect x="80" y="44" width="40" height="38" rx="8" fill={`url(#${id}-gold)`} />
          <rect x="84" y="50" width="4" height="26" rx="2" fill="#fff" opacity=".35" />
          <path d="M62 128 Q62 100 90 100 H110 Q138 100 138 128 V196 Q138 218 116 218 H84 Q62 218 62 196 Z" fill="#FFFDF9" fillOpacity=".55" stroke="#C9A961" strokeOpacity=".7" />
          <path d="M66 148 H134 V196 Q134 214 116 214 H84 Q66 214 66 196 Z" fill={`url(#${id}-liq)`} opacity=".92" />
          <rect x="72" y="112" width="6" height="90" rx="3" fill="#fff" opacity=".45" />
          <rect x="84" y="158" width="32" height="34" rx="5" fill="#FAF7F2" opacity=".92" />
          <text x="100" y="184" textAnchor="middle" fontSize="24" fill="#8E7239" fontFamily="Amiri, serif" fontWeight="700">ن</text>
        </g>
      )}
      {s === 'jar' && (
        <g>
          <path d="M96 84 C86 68 108 58 98 42 M108 90 C100 74 118 66 110 52" stroke="#B08F4A" strokeOpacity=".4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="52" y="112" width="96" height="30" rx="10" fill={`url(#${id}-gold)`} />
          <path d="M56 140 H144 V190 Q144 218 116 218 H84 Q56 218 56 190 Z" fill={`url(#${id}-liq)`} />
          <rect x="66" y="150" width="6" height="56" rx="3" fill="#fff" opacity=".3" />
          <text x="100" y="196" textAnchor="middle" fontSize="28" fill="#FAF7F2" fontFamily="Amiri, serif" fontWeight="700">ن</text>
        </g>
      )}
      {s === 'box' && (
        <g>
          <rect x="44" y="112" width="112" height="106" rx="8" fill={`url(#${id}-liq)`} />
          <rect x="38" y="96" width="124" height="30" rx="8" fill={b} />
          <rect x="93" y="96" width="14" height="122" fill={`url(#${id}-gold)`} />
          <ellipse cx="86" cy="88" rx="16" ry="11" fill="none" stroke="#C9A961" strokeWidth="5" transform="rotate(-20 86 88)" />
          <ellipse cx="114" cy="88" rx="16" ry="11" fill="none" stroke="#C9A961" strokeWidth="5" transform="rotate(20 114 88)" />
          <circle cx="100" cy="92" r="6" fill="#C9A961" />
        </g>
      )}
    </svg>
  );
}

export function ProductImage({ images, category, alt, className, sizes = '(max-width:768px) 50vw, 25vw', priority, imgClassName }: {
  images?: { url: string; alt: string }[]; category?: string; alt?: string; className?: string; sizes?: string; priority?: boolean; imgClassName?: string;
}) {
  const img = images?.[0];
  const isPlaceholder = !img?.url || img.url.includes('placeholder');
  return (
    <div className={cn('relative overflow-hidden bg-cream-200', className)}>
      {isPlaceholder ? <BottleArt category={category} className={imgClassName} /> : (
        <Image src={img!.url} alt={img!.alt || alt || ''} fill sizes={sizes} priority={priority} placeholder="blur" blurDataURL={BLUR} className={cn('object-cover', imgClassName)} />
      )}
    </div>
  );
}
