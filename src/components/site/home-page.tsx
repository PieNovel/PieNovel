"use client";

import { ArrowRight, ChevronRight, Clock, Flame, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { FeaturedHero } from "@/components/site/featured-hero";
import { NavigationTabs } from "@/components/site/navigation-tabs";
import type { Tab } from "@/components/site/navigation-tabs";
import { NovelCard } from "@/components/site/novel-card";
import { ReadingHistoryCard } from "@/components/site/reading-history-card";
import { SectionHeading } from "@/components/site/section-heading";
import { catalogNovels, featuredNovels } from "@/lib/site/mock-novels";

type HomePageProps = {
  locale: string;
};

const trendingPeriods = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "season", label: "Season" },
  { id: "year", label: "Year" },
  { id: "alltime", label: "All Time" },
];

const latestTabs: Tab[] = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
  { id: "completed", label: "Completed" },
];

const readingHistory = [
  { novelSlug: "shadow-monarchs-ascension", title: "Shadow Monarch's Ascension", chapter: "Chapter 127: The Awakening", progress: 68, timeAgo: "2 hours ago", coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&auto=format" },
  { novelSlug: "mystic-cultivation-chronicles", title: "Mystic Cultivation Chronicles", chapter: "Chapter 89: Breaking Through", progress: 45, timeAgo: "1 day ago", coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop&auto=format" },
];

export function HomePage({ locale }: HomePageProps): ReactElement {
  const [activePeriod, setActivePeriod] = useState("weekly");
  const [activeLatestTab, setActiveLatestTab] = useState("all");

  const trending = catalogNovels.slice(0, 5);
  const newest = [...catalogNovels].reverse().slice(0, 6);
  const latestUpdates = catalogNovels.filter((n) => n.status === "ONGOING").slice(0, 4);

  return (
    <main className="relative mx-auto grid max-w-7xl gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_65%)]" />

      <FeaturedHero locale={locale} slides={featuredNovels} />

      <section>
        <SectionHeading
          action={
            <Link
              className="hidden items-center gap-1 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)] sm:inline-flex"
              href={`/${locale}/library`}
            >
              View Library
              <ChevronRight className="size-4" />
            </Link>
          }
          eyebrow="Continue Reading"
          icon={<Clock className="size-3" />}
          title="Pick Up Where You Left Off"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {readingHistory.map((item) => (
            <ReadingHistoryCard key={item.novelSlug} locale={locale} {...item} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          action={
            <Link
              className="hidden items-center gap-1 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)] sm:inline-flex"
              href={`/${locale}/popular`}
            >
              See Popular
              <ChevronRight className="size-4" />
            </Link>
          }
          eyebrow="Hot Right Now"
          icon={<Flame className="size-3" />}
          title="Trending"
        />

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {trendingPeriods.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePeriod(p.id)}
              className="shrink-0 rounded-md border px-3 py-2 text-xs font-bold transition-all"
              style={{
                borderColor: activePeriod === p.id ? "color-mix(in_srgb, var(--primary) 35%, transparent)" : "transparent",
                background: activePeriod === p.id ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent",
                color: activePeriod === p.id ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {trending.map((novel, index) => (
            <NovelCard key={`${activePeriod}-${novel.slug}`} compact locale={locale} novel={novel} rank={index + 1} />
          ))}
        </div>
      </section>

      <AdSlot />

      <section>
        <SectionHeading
          action={
            <Link
              className="hidden items-center gap-1 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)] sm:inline-flex"
              href={`/${locale}/browse`}
            >
              Browse all
              <ChevronRight className="size-4" />
            </Link>
          }
          eyebrow="Just Added"
          icon={<Sparkles className="size-3" />}
          title="New on Pie Novel"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {newest.map((novel) => (
            <NovelCard compact key={novel.slug} locale={locale} novel={novel} />
          ))}
        </div>
      </section>

      <AdSlot />

      <section>
        <SectionHeading
          eyebrow="Fresh Chapters"
          icon={<TrendingUp className="size-3" />}
          title="Latest Updates"
        />
        <NavigationTabs
          tabs={latestTabs}
          activeTab={activeLatestTab}
          onTabChange={setActiveLatestTab}
          className="mb-5"
        />
        <div className="grid gap-3">
          {latestUpdates.map((novel) => (
            <NovelCard key={novel.slug} locale={locale} novel={novel} />
          ))}
        </div>

        <AdSlot className="mb-2 mt-8" />

        <div className="mt-6 flex justify-center">
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-md border px-5 text-sm font-bold text-[var(--primary)] transition-all"
            href={`/${locale}/latest`}
            style={{
              borderColor: "color-mix(in_srgb, var(--primary) 28%, transparent)",
              background: "color-mix(in_srgb, var(--primary) 8%, transparent)",
            }}
          >
            More Updates
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
