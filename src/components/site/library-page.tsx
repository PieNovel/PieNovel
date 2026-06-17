"use client";

import { BookOpen, Grid3X3, Heart, List, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";

import { useAuth } from "@/lib/site/auth-context";
import { catalogNovels } from "@/lib/site/mock-novels";

type SortMode = "recent" | "title" | "rating";

type LibraryPageProps = {
  locale: string;
};

export function LibraryPage({ locale }: LibraryPageProps): ReactElement {
  const router = useRouter();
  const { isLoggedIn, favorites, toggleFavorite } = useAuth();
  const [sort, setSort] = useState<SortMode>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
        <Heart className="size-12 text-[var(--primary)]" />
        <p className="font-serif text-[1.4rem] font-bold text-[var(--foreground)]">Sign in to view your library</p>
        <button onClick={() => router.push(`/${locale}/signin`)} className="rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white">
          Sign In
        </button>
      </div>
    );
  }

  const favoriteNovels = favorites
    .map((f) => ({ ...f, novel: catalogNovels.find((n) => Number(n.id) === f.novelId) }))
    .filter((f) => f.novel)
    .filter((f) => f.novel!.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "recent") return b.addedAt - a.addedAt;
      if (sort === "title") return a.novel!.title.localeCompare(b.novel!.title);
      return b.novel!.rating - a.novel!.rating;
    });

  return (
    <div className="min-h-[calc(100vh-56px)] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-[2rem] font-extrabold text-[var(--foreground)]">My Library</h1>
            <p className="mt-1 text-[0.82rem] text-[var(--muted-foreground)]">{favorites.length} saved {favorites.length === 1 ? "novel" : "novels"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border" style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="p-2 transition-all"
                  style={{ background: view === v ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent", color: view === v ? "var(--primary)" : "var(--muted-foreground)" }}
                >
                  {v === "grid" ? <Grid3X3 className="size-4" /> : <List className="size-4" />}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="rounded-xl border px-3 py-2 text-sm text-[var(--foreground)] outline-none"
              style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title A–Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search your library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-[var(--card)] py-2.5 pl-9 pr-4 text-sm text-[var(--foreground)] outline-none"
            style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
          />
        </div>

        {favoriteNovels.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Heart className="size-14 opacity-20 text-[var(--muted-foreground)]" />
            <p className="font-serif text-[1.2rem] font-bold text-[var(--foreground)]">
              {search ? "No results found" : "Your library is empty"}
            </p>
            <p className="max-w-xs text-center text-[0.82rem] text-[var(--muted-foreground)]">
              {search ? "Try a different search term." : "Add novels to your library by clicking the heart icon on any novel."}
            </p>
            {!search && (
              <Link href={`/${locale}/browse`} className="rounded-xl bg-[var(--primary)] px-5 py-2 text-sm text-white">
                Browse Novels
              </Link>
            )}
          </div>
        )}

        {view === "grid" && favoriteNovels.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favoriteNovels.map(({ novel }) => (
              <div key={novel!.id} className="group relative">
                <Link href={`/${locale}/novels/${novel!.slug}`} className="block">
                  <div className="relative mb-2 aspect-[2/3] overflow-hidden rounded-xl">
                    <img src={novel!.coverUrl} alt={novel!.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-1 text-xs font-semibold text-white">
                        <BookOpen className="size-3" /> {novel!.chapters} ch.
                      </span>
                    </div>
                  </div>
                  <p className="mb-1 line-clamp-2 text-sm font-medium text-[var(--foreground)]">{novel!.title}</p>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="text-[0.72rem] text-[var(--muted-foreground)]">{novel!.rating}</span>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFavorite(Number(novel!.id))}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
                  style={{ background: "rgba(239,68,68,0.85)" }}
                  title="Remove from library"
                >
                  <Trash2 className="size-3.5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {view === "list" && favoriteNovels.length > 0 && (
          <div className="flex flex-col gap-3">
            {favoriteNovels.map(({ novel }) => (
              <div
                key={novel!.id}
                className="group flex items-center gap-4 rounded-2xl border p-4"
                style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
              >
                <Link href={`/${locale}/novels/${novel!.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <img src={novel!.coverUrl} alt={novel!.title} className="size-16 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif font-semibold text-[var(--foreground)]">{novel!.title}</p>
                    <p className="mt-0.5 text-[0.78rem] text-[var(--muted-foreground)]">{novel!.author}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[0.72rem] text-[var(--muted-foreground)]">
                        <Star className="size-3 fill-amber-400 text-amber-400" /> {novel!.rating}
                      </span>
                      <span className="text-[0.72rem] text-[var(--muted-foreground)]">{novel!.chapters} chapters</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          background: novel!.status === "COMPLETED" ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "color-mix(in_srgb, #f59e0b 12%, transparent)",
                          color: novel!.status === "COMPLETED" ? "var(--primary)" : "#f59e0b",
                        }}
                      >
                        {novel!.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFavorite(Number(novel!.id))}
                  className="shrink-0 rounded-xl p-2 text-red-400 opacity-0 transition-all group-hover:opacity-100"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
