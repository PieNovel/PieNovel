# Pie Novel Platform
# Project Specification V1.3 (Cloudflare Edge Architecture)

## Scope
Development planning document aligned with V1 Hi-Fi Wireframes, PRD, SEO best practices, i18n, and Ad monetization strategies.

---

# 1. Project Overview
A blazing-fast, SEO-friendly, 100% free web-based novel reading platform powered entirely by the Cloudflare ecosystem to ensure zero egress fees and infinite scalability.

---

# 2. Technology Stack
Frontend:
- Next.js App Router (React 18+) configured for Edge Runtime (`@cloudflare/next-on-pages`)
- TypeScript, Tailwind CSS, Shadcn UI
- Zustand (Client State for Reader Settings)
- next-intl (For EN/ID i18n Routing)

Backend & Infrastructure (100% Cloudflare):
- **Hosting:** Cloudflare Pages
- **Database:** Cloudflare D1 (Serverless SQLite)
- **ORM:** Prisma (using `@prisma/adapter-d1`)
- **Storage:** Cloudinary SDK (For Cover Images & Assets)
- **Caching & Rate Limiting:** Cloudflare KV
- **Background Jobs:** Cloudflare Queues (For Bulk Imports)

Authentication & Security:
- Auth.js (NextAuth) optimized for Edge
- Zod (Schema Validation)

---

# 3. System Architecture
Browser / Client
      ↓
Cloudflare Pages (Next.js Edge Runtime `/[locale]/...`)
      ↓
Cloudflare KV (Cache layer for Chapters & Novel list)
      ↓
Prisma ORM (via adapter-d1)
      ↓
Cloudflare D1 (SQLite Database)

---

# 4. API Design (High Performance & SEO)
Public:
- GET /api/novels (Standard Offset Pagination, cached in Cloudflare KV)
- GET /api/novels/[slug] (Cached in KV)
- GET /api/novels/[slug]/chapters
- GET /api/search (Debounced)

User & Admin:
- POST /api/bookmarks, POST /api/comments, POST /api/reviews
- POST /api/admin/import/bulk (Triggers Cloudflare Queue)

---

# 5. UI/UX Specification
- **Homepage:** Hero Banner, Continue Reading, Trending, Paginated Novel Grid. Includes `<AdSlot />`.
- **Reader Page:** Configurable Settings. `<AdSlot />` at the bottom.
- **Admin Dashboard:** Drag & Drop Import Center.

---

# 6. Next.js Folder Structure (i18n ready)
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── (user)/
│   │   └── admin/
│   ├── api/
│   │   └── ...routes
├── components/
│   ├── ui/ (Shadcn)
│   ├── ads/ (AdSlot.tsx)
│   ├── reader/ 
│   └── seo/
├── env.d.ts (Cloudflare Bindings)
├── lib/
│   ├── prisma.ts (Configured with D1 Adapter)
│   └── cloudflare.ts (KV & R2 utilities)
└── types/

---

# 7. Development Rules for AI Developer
1. **ARCHITECTURE FIRST:** This project runs on Cloudflare Pages. Do NOT use Vercel-specific features. Maximize Edge compatibility.
2. **DATABASE:** We are using Cloudflare D1 (SQLite). Prisma schema must NOT contain Enums or scalar arrays.
3. **MONETIZATION:** Inject `<AdSlot className="my-4" />` in layout gaps. No payment features.
4. **PERFORMANCE:** Use Cloudflare KV for caching chapter contents.

# Blueprint Pie Novel V1.4 (Cloudinary & Edge Native)

## 1. Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Runtime:** Cloudflare Edge Runtime (@cloudflare/next-on-pages)
- **Database:** Cloudflare D1 via Prisma Adapter
- **Assets Storage:** Cloudinary (Gantikan R2)
- **Caching:** Cloudflare KV (Konten Chapter)

## 2. Infrastructure Rules
- **Cloudinary Helper:** Wajib menggunakan `src/lib/cloudinary.ts` untuk upload.
- **Image Loader:** Gunakan loader Cloudinary untuk transformasi gambar otomatis (auto-format, auto-quality).
- **Edge Compatibility:** Jangan gunakan library Node.js native (fs, path) di dalam `src/app`.

## 3. Directory Structure
src/
├── app/          # Routing & Page
├── components/   # UI (Shadcn) + AdSlot
├── lib/          # Database & Cloudinary Helpers
└── store/        # Zustand (Reader State)