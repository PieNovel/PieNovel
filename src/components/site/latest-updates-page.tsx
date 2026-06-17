"use client";

import { Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { GenrePill } from "@/components/site/genre-pill";
import { NovelCard } from "@/components/site/novel-card";
import { GENRES, catalogNovels } from "@/lib/site/mock-novels";

const STATUS_TABS = ["All", "Ongoing", "Completed", "Hiatus"];

type LatestUpdatesPageProps = {
  locale: string;
};

export function LatestUpdatesPage({ locale }: LatestUpdatesPageProps): ReactElement {
  const [genre, setGenre] = useState("All");
  const [statusTab, setStatusTab] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = catalogNovels
    .filter((n) => genre === "All" || n.genre === genre || n.tags.includes(genre))
    .filter((n) => statusTab === "All" || n.status === statusTab.toUpperCase());

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Clock className="size-4 text-[var(--primary)]" />
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
            Fresh Chapters
          </p>
        </div>
        <h1 className="font-serif text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-[var(--foreground)]">
          Latest Updates
        </h1>
        <p className="mt-2 text-[0.88rem] text-[var(--muted-foreground)]">
          Stay up to date with the newest chapters from all your favourite novels.
        </p>
      </div>

      <AdSlot className="mb-8" />

      <div className="mb-5 flex items-center gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusTab(s); setPage(1); }}
            className="px-4 py-2.5 text-[0.82rem] transition-all"
            style={{
              fontWeight: statusTab === s ? 600 : 400,
              color: statusTab === s ? "var(--primary)" : "var(--muted-foreground)",
              borderBottom: statusTab === s ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <GenrePill key={g} label={g} active={genre === g} onClick={() => { setGenre(g); setPage(1); }} />
        ))}
      </div>

      <AdSlot className="mb-8" />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-[0.78rem] text-[var(--muted-foreground)]">
          Showing {paginated.length} of {filtered.length} novels
        </p>
        <div className="flex items-center gap-1.5 text-[0.72rem] text-[var(--muted-foreground)]">
          <RefreshCw className="size-3" />
          Updated hourly
        </div>
      </div>

      <div className="mb-8 grid gap-3">
        {paginated.map((n) => (
          <NovelCard key={n.id} locale={locale} novel={n} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-serif text-[1.4rem] font-bold text-[var(--muted-foreground)]">Nothing here yet</p>
          <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">Try adjusting your filters.</p>
        </div>
      )}

      <AdSlot className="mb-8" />

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 rounded-xl border px-6 py-3 text-[0.85rem] font-semibold transition-all"
            style={{
              color: "var(--primary)",
              borderColor: "color-mix(in_srgb, var(--primary) 25%, transparent)",
              background: "color-mix(in_srgb, var(--primary) 6%, transparent)",
            }}
          >
            <RefreshCw className="size-4" />
            Load More
          </button>
        </div>
      )}
    </main>
  );
}
