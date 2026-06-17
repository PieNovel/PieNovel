"use client";

import { BookOpen, Clock, Eye, Heart, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { catalogNovels, type SiteNovel } from "@/lib/site/mock-novels";
import { useAuth } from "@/lib/site/auth-context";

type NovelDetailPageProps = {
  locale: string;
  slug: string;
};

export function NovelDetailPage({ locale, slug }: NovelDetailPageProps): ReactElement {
  const novel = catalogNovels.find((n) => n.slug === slug);
  const { isLoggedIn, toggleFavorite, isFavorite } = useAuth();
  const [showAllChapters, setShowAllChapters] = useState(false);

  if (!novel) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-4">
        <BookOpen className="size-16 opacity-20" style={{ color: "var(--muted-foreground)" }} />
        <p className="font-serif text-xl font-bold" style={{ color: "var(--foreground)" }}>Novel not found</p>
        <Link href={`/${locale}/browse`} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
          Browse Novels
        </Link>
      </div>
    );
  }

  const chapters = Array.from({ length: Math.min(novel.chapters, 15) }, (_, i) => ({
    id: `${novel.id}-ch${novel.chapters - i}`,
    number: novel.chapters - i,
    title: `Ch. ${novel.chapters - i}: Chapter ${novel.chapters - i}`,
    wordCount: Math.floor(Math.random() * 3000) + 2000,
    publishedAt: `${i === 0 ? "2h" : i === 1 ? "1d" : i + "d"} ago`,
  }));

  const fav = isLoggedIn && isFavorite(Number(novel.id));

  return (
    <main className="mx-auto max-w-4xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <AdSlot className="mb-6" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <Link href={`/${locale}`} className="hover:text-[var(--primary)] transition-colors">Home</Link>
        <ChevronRight className="size-3" />
        <Link href={`/${locale}/browse`} className="hover:text-[var(--primary)] transition-colors">Browse</Link>
        <ChevronRight className="size-3" />
        <span style={{ color: "var(--foreground)" }}>{novel.title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-48 flex-shrink-0">
          <img src={novel.coverUrl} alt={novel.title} className="w-full rounded-xl object-cover shadow-lg" style={{ aspectRatio: "2/3" }} />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>{novel.title}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>by {novel.author}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--primary)" }}>
              <Star className="size-3.5 fill-current" /> {novel.rating}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <Eye className="size-3.5" /> {novel.views}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <BookOpen className="size-3.5" /> {novel.chapters} chapters
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <Clock className="size-3.5" /> {novel.updatedAt}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {novel.tags.map((tag) => (
              <span key={tag} className="rounded-full px-3 py-1 text-xs" style={{ background: "color-mix(in_srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/${locale}/read/${novel.slug}/${novel.chapters}`}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
            >
              <BookOpen className="size-4" />
              Read Now
            </Link>
            {isLoggedIn && (
              <button
                onClick={() => toggleFavorite(Number(novel.id))}
                className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all"
                style={{ borderColor: "var(--border)", color: fav ? "#ef4444" : "var(--muted-foreground)" }}
              >
                <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
                {fav ? "Favorited" : "Favorite"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h2 className="mb-3 font-serif text-base font-bold" style={{ color: "var(--foreground)" }}>Synopsis</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{novel.description}</p>
      </div>

      <AdSlot className="my-6" />

      {/* Chapters */}
      <div className="rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-serif text-base font-bold" style={{ color: "var(--foreground)" }}>Chapters</h2>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{novel.chapters} total</span>
        </div>
        <div className="flex flex-col">
          {chapters.slice(0, showAllChapters ? chapters.length : 10).map((ch) => (
            <Link
              key={ch.id}
              href={`/${locale}/read/${novel.slug}/${ch.number}`}
              className="flex items-center justify-between border-b px-5 py-3 transition-colors last:border-0 hover:bg-[color-mix(in_srgb,var(--foreground)_2%,transparent)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>{ch.title}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{ch.wordCount.toLocaleString()} words &middot; {ch.publishedAt}</p>
              </div>
            </Link>
          ))}
        </div>
        {novel.chapters > 10 && (
          <button
            onClick={() => setShowAllChapters(!showAllChapters)}
            className="w-full border-t px-5 py-3 text-center text-sm font-medium transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--primary)" }}
          >
            {showAllChapters ? "Show less" : `Show all ${novel.chapters} chapters`}
          </button>
        )}
      </div>
    </main>
  );
}
