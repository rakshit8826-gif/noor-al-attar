# Data persistence — JSON → KV upgrade path

## MVP (default, zero setup)
All content (products, categories, banners, testimonials, blog, coupons, inquiries, settings) lives in
`/data/*.json` inside the repo. The admin panel reads and writes these files **on the local filesystem**
when you run `npm run dev` — so on your machine, admin edits persist immediately.

## On Vercel (important)
Vercel's filesystem is **read-only** at runtime. Without a database:
- The site reads the seed JSON fine (your storefront works).
- Any admin **write** (add/edit/delete product, save settings, etc.) will fail with a clear error:
  _"Cannot save: this deployment has no database. Add Vercel KV and redeploy."_

## Recommended: add Vercel KV (free tier, ~2 minutes)
1. Vercel Dashboard → your project → **Storage** tab → **Create Database** → choose **KV** (Upstash Redis).
2. Connect it to your project — Vercel automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   to your Environment Variables.
3. Redeploy (Vercel does this automatically after linking storage, or trigger a redeploy manually).
4. That's it — the app auto-detects these env vars (`lib/store.ts`) and every admin write now goes to KV
   instantly, live, with no redeploy needed. The first read of each key falls back to the seed JSON,
   so your 12 seed products appear immediately even before you've saved anything to KV.

## Image uploads (optional)
The admin image field always accepts a **pasted URL** (Cloudinary, imgbb, Instagram CDN, etc.) — free and
requires no setup. If you'd like drag-and-drop uploads instead:
1. Vercel Dashboard → Storage → Create Database → **Blob**.
2. Copy `BLOB_READ_WRITE_TOKEN` into your env vars.
3. The upload button in the admin's image fields will then work (see `/api/upload`).

## Local development
No setup needed — `npm run dev` writes straight to `/data/*.json`, so you can watch the files change in
your editor as you use the admin panel. Run `npm run seed` any time to reset all content back to the
original demo data.

## Why not a full database (Postgres/Mongo) for the MVP?
This keeps the project genuinely free and simple to deploy for a small business — no server to manage,
no connection strings, no cold-start latency. If you outgrow it (very high traffic, need relational
queries, multiple admins with roles), the natural next step is Vercel Postgres or Supabase (both have
free tiers) — `lib/data.ts` is the single place that would need new read/write functions.
