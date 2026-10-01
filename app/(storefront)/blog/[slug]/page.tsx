import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/data';
import { fmtDate, readTime, slugify } from '@/lib/format';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ShareButtons } from '@/components/shared/ShareButtons';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = (await getPosts()).find((x) => x.slug === params.slug);
  return p ? { title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt } : {};
}
export default async function Post({ params }: { params: { slug: string } }) {
  const all = await getPosts();
  const p = all.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const blocks = p.content.split(/\n{2,}/);
  const toc = blocks.filter((b) => b.startsWith('## ')).map((b) => b.slice(3).split('\n')[0]);
  const related = all.filter((x) => x.id !== p.id).slice(0, 2);
  return (
    <article className="section max-w-3xl !pt-10">
      <p className="text-sm text-accent">{p.tags.join(' · ')}</p>
      <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{p.title}</h1>
      <p className="mt-3 text-sm text-mute">{p.author} · {fmtDate(p.publishedAt)} · {readTime(p.content)} min read</p>
      <div className="pattern my-8 aspect-[16/8] rounded-2xl border border-gold-500/30 bg-deep"><div className="grid h-full place-items-center font-arabic text-8xl text-accent/60">ن</div></div>
      {toc.length > 0 && <nav aria-label="Contents" className="card mb-8 p-5 text-sm"><p className="mb-2 font-semibold">In this guide</p><ul className="space-y-1">{toc.map((h) => <li key={h}><a className="text-accent hover:underline" href={`#${slugify(h)}`}>{h}</a></li>)}</ul></nav>}
      <div className="space-y-5 text-lg leading-relaxed text-ink/90">
        {blocks.map((b, i) => {
          if (!b.startsWith('## ')) return <p key={i}>{b}</p>;
          const [h, ...rest] = b.slice(3).split('\n');
          return <div key={i}><h2 id={slugify(h)} className="pb-2 pt-4 text-2xl font-bold">{h}</h2>{rest.length > 0 && <p>{rest.join(' ')}</p>}</div>;
        })}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gold-500/30 pt-6"><ShareButtons title={p.title} /><WhatsAppButton label="Ask us on WhatsApp" message={`I read "${p.title}" and have a question.`} /></div>
      {related.length > 0 && <div className="mt-12"><h2 className="mb-4 text-xl font-bold">Keep reading</h2><div className="grid gap-3 sm:grid-cols-2">{related.map((r) => <Link key={r.id} href={`/blog/${r.slug}`} className="card p-4 hover:text-accent"><span className="font-semibold">{r.title}</span></Link>)}</div></div>}
    </article>
  );
}
