import { BookOpen, Clock, Star } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import type { SiteNovel } from "@/lib/site/mock-novels";

type NovelCardProps = {
  locale: string;
  novel: SiteNovel;
  compact?: boolean;
  rank?: number;
};

export function NovelCard({
  locale,
  novel,
  compact = false,
  rank,
}: NovelCardProps): ReactElement {
  return (
    <Link
      className={
        compact
          ? "group grid gap-2"
          : "group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--card-foreground)] transition hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_6%,var(--card))]"
      }
      href={`/${locale}/novels/${novel.slug}`}
    >
      <div
        className={
          compact
            ? "relative aspect-[2/3] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--secondary)]"
            : "relative h-28 w-20 shrink-0 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--secondary)]"
        }
      >
        <img
          alt={`Cover ${novel.title}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={novel.coverUrl}
        />
        {rank ? (
          <span className="absolute left-2 top-2 rounded bg-[var(--primary)] px-2 py-1 text-xs font-black text-[var(--primary-foreground)]">
            #{rank}
          </span>
        ) : null}
      </div>

      <div className={compact ? "min-w-0" : "min-w-0 flex-1"}>
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
            {novel.title}
          </h3>
          {!compact ? (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
              <Star className="size-3 fill-current" />
              {novel.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <p className="truncate text-xs text-[var(--muted-foreground)]">by {novel.author}</p>

        {!compact ? (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                {novel.genre}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <BookOpen className="size-3" />
                {novel.chapters} ch
              </span>
            </div>
            <p className="mt-3 flex items-center gap-2 truncate text-xs text-[var(--muted-foreground)]">
              <Clock className="size-3 shrink-0" />
              {novel.latestChapter}
            </p>
          </>
        ) : (
          <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
            <span className="truncate">{novel.genre}</span>
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="size-3 fill-current" />
              {novel.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
