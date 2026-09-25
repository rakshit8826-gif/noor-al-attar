import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: 'Uploads need BLOB_READ_WRITE_TOKEN (Vercel Blob). You can paste an image URL instead.' }, { status: 501 });
  const file = (await req.formData()).get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!/^image\/(jpeg|png|webp|avif|gif)$/.test(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WebP or AVIF images.' }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'Max 4 MB per image (compress it first).' }, { status: 400 });
  const blob = await put(`noor/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`, file, { access: 'public' });
  return NextResponse.json({ url: blob.url });
}
