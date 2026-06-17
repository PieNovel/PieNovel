"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import type { FormEvent, ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { catalogNovels } from "@/lib/site/mock-novels";

const ALL_GENRES = ["Action", "Fantasy", "Romance", "Comedy", "Horror", "Mystery", "Sci-Fi", "Xianxia", "Cultivation", "Regression"];
const ALL_STATUS = ["All", "Ongoing", "Completed", "Hiatus"];

type SearchPageProps = {
  locale: string;
};

export function SearchPage({ locale }: SearchPageProps): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(q);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const results = catalogNovels.filter((n) => {
    const matchesQ =
      q === "" ||
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      n.author.toLowerCase().includes(q.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
    const matchesGenre = selectedGenre === "All" || n.genre.toLowerCase() === selectedGenre.toLowerCase() || n.tags.some((t) => t.toLowerCase() === selectedGenre.toLowerCase());
    const matchesStatus = selectedStatus === "All" || n.status === selectedStatus.toUpperCase();
    return matchesQ && matchesGenre && matchesStatus;
  });

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (inputValue) params.set("q", inputValue);
    router.push(`/${locale}/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const clearSearch = useCallback(() => {
    setInputValue("");
    router.push(`/${locale}/search`);
  }, [locale, router]);

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <AdSlot className="mb-6" />

        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search novels, authors, tags..."
            className="w-full rounded-2xl border bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] py-3.5 pl-12 pr-16 text-[0.95rem] text-[var(--foreground)] outline-none transition-all"
            style={{ borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
          />
          {inputValue && (
            <button type="button" className="absolute right-12 top-1/2 -translate-y-1/2" onClick={clearSearch}>
              <X className="size-4 text-[var(--muted-foreground)]" />
            </button>
          )}
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 transition-all"
            style={{ background: showFilters ? "color-mix(in_srgb, var(--primary) 15%, transparent)" : "transparent", color: showFilters ? "var(--primary)" : "var(--muted-foreground)" }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </form>

        {showFilters && (
          <div className="mb-6 rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}>
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Genre</p>
              <div className="flex flex-wrap gap-2">
                {["All", ...ALL_GENRES].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className="rounded-full border px-3 py-1 text-xs transition-all"
                    style={{
                      background: selectedGenre === g ? "color-mix(in_srgb, var(--primary) 15%, transparent)" : "transparent",
                      borderColor: selectedGenre === g ? "var(--primary)" : "color-mix(in_srgb, var(--foreground) 8%, transparent)",
                      color: selectedGenre === g ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Status</p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className="rounded-full border px-3 py-1 text-xs transition-all"
                    style={{
                      background: selectedStatus === s ? "color-mix(in_srgb, var(--primary) 15%, transparent)" : "transparent",
                      borderColor: selectedStatus === s ? "var(--primary)" : "color-mix(in_srgb, var(--foreground) 8%, transparent)",
                      color: selectedStatus === s ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-5 flex items-center justify-between">
          <p className="text-[0.82rem] text-[var(--muted-foreground)]">
            {q ? (
              <>
                <span className="font-medium text-[var(--foreground)]">{results.length}</span> results for{" "}
                <span className="font-medium text-[var(--primary)]">&quot;{q}&quot;</span>
              </>
            ) : (
              <><span className="font-medium text-[var(--foreground)]">{results.length}</span> novels found</>
            )}
          </p>
        </div>

        <AdSlot className="mb-6" />

        {results.length === 0 ? (
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 size-12 opacity-20 text-[var(--foreground)]" />
            <p className="font-serif text-[1.2rem] font-semibold text-[var(--foreground)]">No results found</p>
            <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">Try different keywords or adjust your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((novel) => (
              <Link
                key={novel.id}
                href={`/${locale}/novels/${novel.slug}`}
                className="group flex gap-4 rounded-xl border p-4 transition-all"
                style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-lg" style={{ height: "90px" }}>
                  <img src={novel.coverUrl} alt={novel.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-[0.9rem] font-semibold font-serif text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                    {novel.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">by {novel.author}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded border px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-[var(--primary)]" style={{ borderColor: "color-mix(in_srgb, var(--primary) 40%, transparent)" }}>
                      {novel.genre}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">★ {novel.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{novel.chapters} chapters</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <AdSlot className="mt-8" />
      </div>
    </div>
  );
}
