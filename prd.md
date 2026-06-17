# Product Requirements Document (PRD)
**Product Name:** Pie Novel
**Version:** 1.0 (MVP)  
**Target Timeline:** 1-Week Sprint  

## 1. Product Vision & Objective
To build a blazing-fast, SEO-friendly, and highly customizable novel aggregator platform. The core focus is providing an exceptional reading experience and a strong community ecosystem. 
**Crucial Note:** The platform operates on a **100% Free, Community-Driven, and Ad-Supported** model. There are absolutely no coins, no paywalls, and no payment gateways.

## 2. Target Audience
- Novel enthusiasts (Light Novels, Web Novels) who read daily.
- Users who need extreme customizability in their reading interface.
- Readers who track their reading progress meticulously.

## 3. User Personas
1. **The Binge Reader:** Reads 50+ chapters a day. Needs fast page-loads (Cloudflare Edge cached).
2. **The Critic:** Loves writing reviews and discussing chapters with other readers.
3. **The Admin (Content Manager):** Needs to quickly upload hundreds of chapters without system timeouts, utilizing background queues.

## 4. Core Features & User Stories

### A. Authentication & Profile
- **Feature:** User Registration & Login (Email/Password & OAuth).
- **Feature:** Public Profile & Activity Log.

### B. Discovery & Navigation (Homepage & Catalog)
- **Feature:** Advanced Search & Filtering (Language, Genre, Status).
- **Feature:** Popular & Trending Rankings (Weekly, Monthly).

### C. Reading Experience (The Reader)
- **Feature:** Customizable Reader Interface (Font, Size, Theme).
- **Feature:** Auto-Resume (Reading History).

### D. Community & Engagement
- **Feature:** Ratings & Reviews (Novel Level).
- **Feature:** Threaded Comments (Chapter Level).

### E. Multilingual System (i18n)
- **Feature:** UI & Content Language Switcher (EN/ID) using `next-intl`.

### F. Ad-Monetization Zones (Non-Intrusive)
- **Feature:** Dedicated Ad Slots for Revenue.
- **User Story:** As an Admin, I have dedicated, layout-safe components (`<AdSlot />`) in the Homepage feed, Sidebar, and Chapter End to place AdSense/Ad network scripts seamlessly.

### G. Admin & Content Management
- **Feature:** Bulk Content Importer (Runs on Cloudflare Queues/Background functions to prevent Edge timeouts).

## 5. Acceptance Criteria (Definition of Done)
1. **Performance:** Page transitions feel instantaneous (Leveraging Cloudflare KV for caching).
2. **SEO:** Standard HTML (SSR) with Schema.org JSON-LD (Book schema) and Standard Pagination.
3. **Infrastructure:** Fully deployable on Cloudflare Pages with Cloudflare D1 (Database) and Cloudinary (Storage). No Vercel dependencies.

## 6. Out of Scope for V1
- Real-time Chat functionality.
- Mobile App (React Native / Flutter)

# PRD Pie Novel - MVP V1.0

## 1. Objective
Platform agregator novel gratis dengan pengalaman membaca sinematik (Dark Mode) dan loading instan di seluruh dunia via Cloudflare Edge.

## 2. Key Features
- **Cloudinary Integration:** Optimasi cover novel secara dinamis untuk menghemat bandwidth.
- **Ad-Injections:** Penempatan iklan yang strategis tanpa merusak LCP (Largest Contentful Paint).
- **Edge Caching:** Menggunakan KV untuk menyimpan metadata novel yang sering diakses.

## 3. Success Metrics
- LCP < 1.2s pada koneksi 4G.
- Zero local storage usage (semua gambar di Cloudinary).