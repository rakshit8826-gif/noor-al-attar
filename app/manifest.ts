import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Noor Al Attar — Authentic Attar & Oud', short_name: 'Noor Al Attar', description: 'Authentic Arabic attars, oud, musk and bakhoor. Order on WhatsApp.',
    start_url: '/', display: 'standalone', background_color: '#FAF7F2', theme_color: '#C9A961',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
