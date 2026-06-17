"use client";

import { Bookmark, ChevronLeft, ChevronRight, PlayCircle, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";

import type { SiteNovel } from "@/lib/site/mock-novels";

type FeaturedHeroProps = {
  locale: string;
  slides: SiteNovel[];
};

export function FeaturedHero({ locale, slides }: FeaturedHeroProps): ReactElement {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  const goTo = useCallback(
    (nextIndex: number) => {
      setCurrent((nextIndex + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    const timer = window.setInterval(() => goTo(current + 1), 7000);
    return () => window.clearInterval(timer);
  }, [current, goTo]);

  return (
    <section className="relative min-h-[360px] overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--primary)_18%,transparent)] bg-[var(--card)] shadow-2xl shadow-black/40">
      {slides.map((item, index) => (
        <div
          className={
            index === current
              ? "absolute inset-0 opacity-100 transition-opacity duration-700"
              : "absolute inset-0 opacity-0 transition-opacity duration-700"
          }
          key={item.slug}
        >
          <img
            alt=""
            className="h-full w-full object-cover brightness-[0.35] saturate-75"
            src={item.bannerUrl}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_srgb,var(--background)_78%,transparent)_52%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_50%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_58%)]" />
        </div>
      ))}

      <div className="relative grid min-h-[360px] items-center gap-6 p-5 sm:grid-cols-[150px_1fr] sm:p-8 lg:p-10">
        <div className="hidden aspect-[2/3] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--secondary)] shadow-2xl shadow-black/50 sm:block">
          <img alt={`Cover ${slide.title}`} className="h-full w-full object-cover" src={slide.coverUrl} />
        </div>

        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--primary)]">
              Featured
            </span>
            <span className="rounded border border-[var(--border)] bg-[color-mix(in_srgb,var(--secondary)_70%,transparent)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--secondary-foreground)]">
              {slide.genre}
            </span>
          </div>

          <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            by <span className="text-[var(--foreground)]">{slide.author}</span>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="size-4 fill-current" />
              {slide.rating.toFixed(1)}
            </span>
            <span>{slide.chapters} chapters</span>
            <span>{slide.views} views</span>
          </div>

          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            {slide.description}
          </p>

          <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
            {slide.tags.map((tag) => (
              <span
                className="rounded bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] px-2 py-1 text-xs text-[var(--muted-foreground)]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary)] px-5 text-sm font-bold text-[var(--primary-foreground)] transition hover:opacity-90"
              href={`/${locale}/novels/${slide.slug}`}
            >
              <PlayCircle className="size-4" />
              Start Reading
            </Link>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] px-5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              type="button"
            >
              <Bookmark className="size-4" />
              Add to Library
            </button>
          </div>
        </div>
      </div>

      <button
        aria-label="Previous featured novel"
        className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-black/45 text-white backdrop-blur transition hover:border-[var(--primary)] sm:inline-flex"
        onClick={() => goTo(current - 1)}
        type="button"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        aria-label="Next featured novel"
        className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-black/45 text-white backdrop-blur transition hover:border-[var(--primary)] sm:inline-flex"
        onClick={() => goTo(current + 1)}
        type="button"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-4 right-5 flex gap-2">
        {slides.map((item, index) => (
          <button
            aria-label={`Show ${item.title}`}
            className={
              index === current
                ? "h-2 w-7 rounded-full bg-[var(--primary)] transition-all"
                : "size-2 rounded-full bg-white/25 transition-all hover:bg-white/45"
            }
            key={item.slug}
            onClick={() => goTo(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
