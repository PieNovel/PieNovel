# Pie Novel

Pie Novel adalah platform baca novel gratis berbasis Next.js App Router yang ditargetkan berjalan di Cloudflare Pages Edge Runtime.

## Stack

- Next.js + TypeScript
- Cloudflare Pages dengan `@cloudflare/next-on-pages`
- Cloudflare D1 melalui Prisma Adapter
- Cloudflare KV untuk cache metadata/chapter
- Cloudinary untuk cover novel dan aset gambar
- Shadcn UI + Tailwind CSS

## Setup Lokal

```bash
npm install
npm run prisma:generate
npm run dev
```

Untuk preview mendekati Cloudflare Pages:

```bash
npm run pages:preview
```

## Cloudflare Bindings

Binding utama berada di `wrangler.toml`:

- `DB` untuk Cloudflare D1
- `KV_CACHE` untuk Cloudflare KV
- `CLOUDINARY_CLOUD_NAME` dan `CLOUDINARY_UPLOAD_FOLDER` sebagai variabel non-rahasia

Secret berikut harus dibuat lewat Cloudflare Pages, bukan disimpan di repo:

```bash
wrangler pages secret put CLOUDINARY_API_KEY --project-name pie-novel
wrangler pages secret put CLOUDINARY_API_SECRET --project-name pie-novel
wrangler pages secret put ADMIN_UPLOAD_TOKEN --project-name pie-novel
```

## Upload Cover

Endpoint admin untuk upload cover:

```txt
POST /api/admin/uploads/cover
```

Kirim sebagai `multipart/form-data`:

- `file`: gambar AVIF, JPEG, PNG, atau WebP, maksimal 5 MB
- `publicId`: opsional, untuk nama asset Cloudinary

Header wajib:

```txt
x-admin-upload-token: <ADMIN_UPLOAD_TOKEN>
```

Response berisi `coverUrl`, `publicId`, ukuran gambar, byte, dan format. Simpan `coverUrl` ke field `Novel.coverUrl` di D1.

## Server Action Cover

Untuk UI admin berbasis React, gunakan komponen:

```tsx
<NovelCoverUploadForm
  locale="id"
  novelId={novel.id}
  novelTitle={novel.title}
  currentCoverUrl={novel.coverUrl}
/>
```

Komponen ini memanggil server action di `src/app/[locale]/admin/novels/actions.ts`, mengunggah gambar ke Cloudinary, menyimpan URL ke `Novel.coverUrl` melalui Prisma D1 Adapter, lalu menghapus cache KV terkait novel tersebut.
