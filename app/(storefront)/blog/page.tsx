import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/data';
import { PageHero } from '@/components/shared/PageBits';
import { fmtDate, readTime } from '@/lib/format';
export const metadata: Metadata = { title: 'The Attar Journal', description: 'Guides on attar, oud, bakhoor, gifting and culture.' };
export default async function Blog({ searchParams }: { searchParams: { tag?: string } }) {
  const all = await getPosts();
  const tags = Array.from(new Set(all.flatMap((p) => p.tags)));
  const posts = searchParams.tag ? all.filter((p) => p.tags.includes(searchParams.tag!)) : all;
  return (
    <>
      <PageHero title="The Attar Journal" sub="Guides, gifting ideas and stories from the world of attar and oud." />
      <div className="section">
        <div className="mb-8 flex flex-wrap justify-center gap-2"><Link href="/blog" className={`chip ${!searchParams.tag ? 'chip-on' : ''}`}>All</Link>{tags.map((t) => <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={`chip ${searchParams.tag === t ? 'chip-on' : ''}`}>{t}</Link>)}</div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-goldlg">
              <div className="pattern aspect-[16/9] bg-deep"><div className="grid h-full place-items-center font-arabic text-6xl text-accent/60">ن</div></div>
              <div className="p-5"><p className="text-xs text-accent">{p.tags.join(' · ')} · {fmtDate(p.publishedAt)} · {readTime(p.content)} min read</p><h2 className="mt-1 text-xl font-semibold group-hover:text-accent">{p.title}</h2><p className="mt-2 text-sm text-mute">{p.excerpt}</p></div>
            </Link>))}
        </div>
      </div>
    </>
  );
}
