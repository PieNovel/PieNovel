"use client";

import { ArrowRight, ChevronRight, Clock, Flame, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { FeaturedHero } from "@/components/site/featured-hero";
import { NavigationTabs } from "@/components/site/navigation-tabs";
import type { Tab } from "@/components/site/navigation-tabs";
import { NovelCard } from "@/components/site/novel-card";
import { ReadingHistoryCard } from "@/components/site/reading-history-card";
import { SectionHeader } from "@/components/site/page-shell";
import { catalogNovels, featuredNovels } from "@/lib/site/mock-novels";
import { useTheme, THEME_STYLES } from "@/lib/site/theme-context";

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
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const router = useRouter();
  const isDark = theme === "dark";

  const trendingByPeriod: Record<string, typeof catalogNovels> = {
    weekly: catalogNovels.slice(0, 5),
    monthly: [catalogNovels[3], catalogNovels[0], catalogNovels[4], catalogNovels[1], catalogNovels[5]],
    season: [catalogNovels[2], catalogNovels[3], catalogNovels[0], catalogNovels[4], catalogNovels[1]],
    year: [catalogNovels[2], catalogNovels[0], catalogNovels[5], catalogNovels[3], catalogNovels[4]],
    alltime: [catalogNovels[2], catalogNovels[0], catalogNovels[1], catalogNovels[3], catalogNovels[4]],
  };

  const newNovels = [...catalogNovels].slice(-6).reverse();
  const latestUpdates = catalogNovels.filter((n) => n.status === "ONGOING").slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-10 sm:space-y-14 relative">
      {isDark && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)",
            zIndex: 0,
          }}
        />
      )}

      <FeaturedHero locale={locale} slides={featuredNovels} />

      <section>
        <SectionHeader
          icon={<Clock className="size-3" />}
          label="Continue Reading"
          title="Pick Up Where You Left Off"
          action="View Library"
          actionHref={`/${locale}/library`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {readingHistory.map((item) => (
            <ReadingHistoryCard key={item.novelSlug} {...item} locale={locale} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <div className="flex items-start gap-3">
            {isDark && (
              <div
                className="flex-shrink-0 mt-0.5"
                style={{
                  width: "3px",
                  height: "36px",
                  borderRadius: "2px",
                  background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.2))",
                  boxShadow: "0 0 8px rgba(16,185,129,0.4)",
                }}
              />
            )}
            <div>
              <div
                className="flex items-center gap-1.5 mb-1.5"
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  color: ts.sectionLabel,
                  textShadow: isDark ? "0 0 12px rgba(16,185,129,0.4)" : "none",
                }}
              >
                <Flame className="size-3" />Hot Right Now
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.25rem, 4vw, 1.45rem)",
                  color: ts.sectionTitle,
                  letterSpacing: "-0.01em",
                }}
              >
                Trending
              </h2>
            </div>
          </div>
          <button
            onClick={() => router.push(`/${locale}/popular`)}
            className="flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", color: ts.subtext }}
          >
            See Popular<ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1 scrollbar-none" style={{ fontFamily: "'Inter', sans-serif" }}>
          {trendingPeriods.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePeriod(p.id)}
              className="rounded-lg px-3.5 py-1.5 transition-all flex-shrink-0"
              style={{
                fontSize: "0.75rem",
                fontWeight: activePeriod === p.id ? 600 : 400,
                background: activePeriod === p.id ? "rgba(16,185,129,0.12)" : "transparent",
                color: activePeriod === p.id ? "#10b981" : ts.subtext,
                border: `1px solid ${activePeriod === p.id ? "rgba(16,185,129,0.3)" : "transparent"}`,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {trendingByPeriod[activePeriod].map((novel, index) => (
            <NovelCard key={`${activePeriod}-${novel.slug}`} compact locale={locale} novel={novel} rank={index + 1} />
          ))}
        </div>
      </section>

      <AdSlot label="728×90" />

      <section>
        <div className="flex items-end justify-between mb-5">
          <div className="flex items-start gap-3">
            {isDark && (
              <div
                className="flex-shrink-0 mt-0.5"
                style={{
                  width: "3px",
                  height: "36px",
                  borderRadius: "2px",
                  background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.2))",
                  boxShadow: "0 0 8px rgba(16,185,129,0.4)",
                }}
              />
            )}
            <div>
              <div
                className="flex items-center gap-1.5 mb-1.5"
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  color: ts.sectionLabel,
                  textShadow: isDark ? "0 0 12px rgba(16,185,129,0.4)" : "none",
                }}
              >
                <Sparkles className="size-3" />Just Added
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.25rem, 4vw, 1.45rem)",
                  color: ts.sectionTitle,
                  letterSpacing: "-0.01em",
                }}
              >
                New on Pie Novel
              </h2>
            </div>
          </div>
          <Link
            href={`/${locale}/browse`}
            className="flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", color: ts.subtext }}
          >
            Browse all<ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {newNovels.map((novel) => (
            <NovelCard key={novel.slug} compact locale={locale} novel={novel} />
          ))}
        </div>
      </section>

      <AdSlot label="728×90" />

      <section>
        <SectionHeader
          icon={<TrendingUp className="size-3" />}
          label="Fresh Chapters"
          title="Latest Updates"
        />
        <NavigationTabs
          tabs={latestTabs}
          activeTab={activeLatestTab}
          onTabChange={setActiveLatestTab}
          className="mb-5"
        />
        <div className="space-y-2">
          {latestUpdates.map((novel) => (
            <NovelCard key={novel.slug} locale={locale} novel={novel} />
          ))}
        </div>

        <AdSlot className="mt-8 mb-2" label="728×90" />

        <div className="mt-6 flex justify-center">
          <Link
            href={`/${locale}/latest`}
            className="flex items-center gap-2 rounded-xl px-6 py-3 border transition-all group"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: ts.sectionLabel,
              borderColor: "rgba(16,185,129,0.25)",
              background: "rgba(16,185,129,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.12)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.06)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; }}
          >
            More Updates
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
