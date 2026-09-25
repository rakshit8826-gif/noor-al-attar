import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-page px-4 text-center pattern">
      <div>
        <p className="font-arabic text-8xl text-accent">٤٠٤</p>
        <h1 className="mt-2 text-3xl font-bold">This fragrance has evaporated</h1>
        <p className="mx-auto mt-2 max-w-md text-mute">The page you are looking for is not here. Let us guide you back to the attars.</p>
        <Link href="/shop" className="btn-gold mt-6">Explore the shop</Link>
      </div>
    </div>
  );
}
