'use client';
import { CrudPage } from '@/components/admin/CrudPage';
export default function Page() {
  return <CrudPage entity="blog" title="Blog posts" labelKey="title" sub="Write in plain text. Start a line with “## ” for a heading; separate paragraphs with a blank line."
    blank={{ slug: '', title: '', cover: '', excerpt: '', content: '', author: 'Noor Al Attar Editorial', tags: [], publishedAt: new Date().toISOString(), status: 'draft', seoTitle: '', seoDescription: '' }}
    fields={[{ key: 'title', label: 'Title', type: 'text', span: 2 }, { key: 'slug', label: 'Slug', type: 'text' }, { key: 'author', label: 'Author', type: 'text' }, { key: 'cover', label: 'Cover image', type: 'image' }, { key: 'tags', label: 'Tags', type: 'tags' }, { key: 'excerpt', label: 'Excerpt', type: 'textarea' }, { key: 'content', label: 'Content', type: 'textarea' }, { key: 'publishedAt', label: 'Publish date', type: 'date' }, { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] }, { key: 'seoTitle', label: 'SEO title', type: 'text' }, { key: 'seoDescription', label: 'SEO description', type: 'text' }]}
    columns={[{ key: 'title', label: 'Title' }, { key: 'publishedAt', label: 'Date', render: (i) => new Date(i.publishedAt).toLocaleDateString('en-IN') }, { key: 'status', label: 'Status' }]} />;
}
