"use client";

import { Bookmark, BookOpen, Eye, Flame, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { catalogNovels } from "@/lib/site/mock-novels";
import type { SiteNovel } from "@/lib/site/mock-novels";

const PERIODS = ["Monthly", "Season", "Year", "All Time"];

const SORT_OPTIONS = [
  { key: "rating", label: "Rating", icon: Star },
  { key: "views", label: "Views", icon: Eye },
  { key: "chapters", label: "Chapters", icon: BookOpen },
  { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { key: "comments", label: "Comments", icon: MessageSquare },
];

const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7c54"];

function mockStats(novel: SiteNovel) {
  const seed = Number(novel.id) * 137;
  return {
    bookmarks: `${((seed % 90) + 10).toFixed(0)}.${seed % 9}K`,
    comments: `${((seed % 40) + 2).toFixed(0)}.${(seed * 3) % 9}K`,
  };
}

type PopularCardProps = {
  locale: string;
  novel: SiteNovel;
  rank: number;
  sortKey: string;
};

function PopularCard({ locale, novel, rank, sortKey }: PopularCardProps): ReactElement {
  const rankColor = rank <= 3 ? RANK_COLORS[rank - 1] : "var(--muted-foreground)";
  const statusColor = novel.status === "COMPLETED" ? "#6366f1" : "var(--primary)";
  const statusLabel = novel.status === "COMPLETED" ? "Done" : "Live";
  const stats = mockStats(novel);

  const statItems = [
    { key: "rating", icon: Star, value: novel.rating.toString(), color: "#f59e0b", fill: true },
    { key: "views", icon: Eye, value: novel.views, color: "var(--muted-foreground)", fill: false },
    { key: "chapters", icon: BookOpen, value: `${novel.chapters} ch`, color: "var(--muted-foreground)", fill: false },
    { key: "bookmarks", icon: Bookmark, value: stats.bookmarks, color: "var(--muted-foreground)", fill: false },
    { key: "comments", icon: MessageSquare, value: stats.comments, color: "var(--muted-foreground)", fill: false },
  ];

  return (
    <Link
      href={`/${locale}/novels/${novel.slug}`}
      className="group flex gap-4 rounded-2xl border p-4 transition-all"
      style={{
        background: "var(--card)",
        borderColor: rank <= 3 ? `color-mix(in_srgb, ${rankColor} 13%, transparent)` : "var(--border)",
      }}
    >
      <div className="flex w-9 shrink-0 items-center justify-center">
        <span
          className="font-serif font-extrabold leading-none"
          style={{
            fontSize: rank <= 3 ? "1.6rem" : "1.1rem",
            color: rankColor,
          }}
        >
          {rank}
        </span>
      </div>

      <div className="size-[60px] shrink-0 overflow-hidden rounded-xl" style={{ height: "84px" }}>
        <img
          src={novel.coverUrl}
          alt={novel.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <p className="truncate text-[0.92rem] font-bold text-[var(--foreground)]">{novel.title}</p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-bold text-white"
            style={{ background: statusColor }}
          >
            {statusLabel}
          </span>
        </div>
        <p className="mb-1.5 text-[0.74rem] text-[var(--muted-foreground)]">{novel.author}</p>
        <p className="mb-2.5 line-clamp-2 text-[0.73rem] leading-relaxed text-[var(--muted-foreground)]">{novel.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          {statItems.map(({ key, icon: Icon, value, color, fill }) => (
            <span
              key={key}
              className="flex items-center gap-1 text-[0.74rem] transition-all"
              style={{
                color: sortKey === key ? "var(--primary)" : color,
                fontWeight: sortKey === key ? 700 : 400,
              }}
            >
              <Icon
                className="size-3"
                style={{
                  fill: fill && sortKey === key ? "var(--primary)" : fill ? color : "none",
                  color: sortKey === key ? "var(--primary)" : color,
                }}
              />
              {value}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function PopularPage({ locale }: { locale: string }): ReactElement {
  const [period, setPeriod] = useState("Monthly");
  const [sortKey, setSortKey] = useState("rating");

  const periodSeeds: Record<string, number[]> = {
    Monthly: [0, 1, 2, 3, 4, 5, 6, 7],
    Season: [3, 0, 4, 1, 5, 2, 6, 7],
    Year: [2, 0, 5, 3, 4, 1, 7, 6],
    "All Time": [2, 0, 1, 3, 4, 5, 7, 6],
  };

  const reordered = (periodSeeds[period] || [0, 1, 2, 3, 4, 5, 6, 7])
    .map((i) => catalogNovels[i])
    .filter(Boolean) as SiteNovel[];

  const sorted = [...reordered].sort((a, b) => {
    if (sortKey === "rating") return b.rating - a.rating;
    if (sortKey === "chapters") return b.chapters - a.chapters;
    if (sortKey === "views") return Number.parseFloat(b.views) - Number.parseFloat(a.views);
    if (sortKey === "bookmarks") return mockStats(b).bookmarks.localeCompare(mockStats(a).bookmarks) * -1;
    if (sortKey === "comments") return mockStats(b).comments.localeCompare(mockStats(a).comments) * -1;
    return 0;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight text-[var(--foreground)]">
          Popular
        </h1>
        <p className="text-[0.85rem] text-[var(--muted-foreground)]">Rankings update every day</p>
      </div>

      <div className="mb-5 flex items-center gap-2">
        <Flame className="size-4 shrink-0 text-[var(--primary)]" />
        <div className="flex flex-wrap items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-lg px-3.5 py-1.5 text-[0.8rem] transition-all"
              style={{
                fontWeight: period === p ? 600 : 400,
                background: period === p ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent",
                color: period === p ? "var(--primary)" : "var(--muted-foreground)",
                border: period === p ? "1px solid color-mix(in_srgb, var(--primary) 30%, transparent)" : "1px solid transparent",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <AdSlot className="mb-8" />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-[0.72rem] font-medium text-[var(--muted-foreground)]">Sort by</span>
        {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.75rem] transition-all"
            style={{
              fontWeight: sortKey === key ? 600 : 400,
              background: sortKey === key ? "color-mix(in_srgb, var(--primary) 10%, transparent)" : "transparent",
              borderColor: sortKey === key ? "color-mix(in_srgb, var(--primary) 40%, transparent)" : "var(--border)",
              color: sortKey === key ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            <Icon className="size-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {sorted.slice(0, 4).map((n, i) => (
          <PopularCard key={n.id} locale={locale} novel={n} rank={i + 1} sortKey={sortKey} />
        ))}
      </div>

      <AdSlot className="my-6" />

      <div className="grid gap-3 lg:grid-cols-2">
        {sorted.slice(4).map((n, i) => (
          <PopularCard key={n.id} locale={locale} novel={n} rank={i + 5} sortKey={sortKey} />
        ))}
      </div>

      <AdSlot className="mt-8" />
    </main>
  );
}
