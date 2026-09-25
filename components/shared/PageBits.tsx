export function PageHero({ title, sub, ar }: { title: string; sub?: string; ar?: string }) {
  return (
    <section className="pattern bg-deep">
      <div className="section text-center !py-12 md:!py-16">
        {ar && <p lang="ar" className="font-arabic text-3xl text-accent">{ar}</p>}
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        {sub && <p className="mx-auto mt-3 max-w-2xl text-mute">{sub}</p>}
      </div>
    </section>
  );
}
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed text-ink/90 sm:px-6 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:ms-5 [&_li]:list-disc [&_a]:text-accent [&_a]:underline">{children}</div>;
}
