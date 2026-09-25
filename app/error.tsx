'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-page px-4 text-center pattern">
      <div>
        <p className="font-arabic text-8xl text-accent">٥٠٠</p>
        <h1 className="mt-2 text-3xl font-bold">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-mute">A small hiccup on our side. Please try again — or message us on WhatsApp.</p>
        <button onClick={reset} className="btn-gold mt-6">Try again</button>
      </div>
    </div>
  );
}
