# Pie Novel

Pie Novel adalah platform baca novel gratis berbasis Next.js App Router yang ditargetkan berjalan di Cloudflare Workers (menggunakan `@opennextjs/cloudflare`).

> Catatan: repo ini pernah menggunakan Cloudflare Pages + `@cloudflare/next-on-pages`. Saat ini sudah dipindahkan ke Workers agar lebih kompatibel dengan Next.js 15.

## Stack

- Next.js + TypeScript
- Cloudflare Workers dengan `@opennextjs/cloudflare`
- Cloudflare D1 melalui Prisma Adapter
- Cloudflare KV untuk cache metadata/chapter
- Cloudinary untuk cover novel dan aset gambar
- Shadcn UI + Tailwind CSS

## Setup Lokal

```bash
npm install
npm run dev
```

Untuk preview mendekati Cloudflare Workers:

```bash
npm run pages:preview
```

## Deploy

```bash
npm run pages:build
npx wrangler deploy
```

## Cloudflare Bindings

Binding utama berada di `wrangler.toml`:

- `DB` untuk Cloudflare D1
- `KV_CACHE` untuk Cloudflare KV
- `ASSETS` untuk static assets
- `CLOUDINARY_CLOUD_NAME` dan `CLOUDINARY_UPLOAD_FOLDER` sebagai variabel non-rahasia

Secret berikut harus dibuat lewat Wrangler, bukan disimpan di repo:

```bash
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
npx wrangler secret put ADMIN_UPLOAD_TOKEN
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
