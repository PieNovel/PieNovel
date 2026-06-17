import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Flame, Clock, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { FeaturedHero } from "../components/featured-hero";
import { NovelCard } from "../components/novel-card";
import { TrendingCompactCard } from "../components/trending-compact-card";
import { ReadingHistoryCard } from "../components/reading-history-card";
import { NavigationTabs } from "../components/navigation-tabs";
import { SectionHeader } from "../components/page-shell";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS } from "../data/novels";

const heroSlides = [
  {
    id: 1,
    title: "Shadow Monarch's Ascension",
    author: "Lee Sung-woo",
    genre: "Action Fantasy",
    rating: 4.9,
    chapters: 542,
    views: "12.4M",
    description: "Sung Jin-Woo, the weakest hunter of all mankind, finds himself trapped in a deadly double dungeon. Facing certain death, he discovers a mysterious quest — one that will transform him into the most powerful being the world has ever seen.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&auto=format",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&h=600&fit=crop&auto=format",
    tags: ["Action", "Fantasy", "Reincarnation", "Op MC", "System", "Manhwa"],
  },
  {
    id: 2,
    title: "Celestial Emperor's Legacy",
    author: "Wang Xiao",
    genre: "Xianxia",
    rating: 4.7,
    chapters: 328,
    views: "8.1M",
    description: "A fallen emperor is reborn with memories of his past life and vows to reclaim his throne. Armed with forbidden cultivation techniques, he treads the path between heaven and mortal, rewriting fate itself.",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop&auto=format",
    bannerUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=600&fit=crop&auto=format",
    tags: ["Xianxia", "Cultivation", "Rebirth", "Revenge", "Emperor"],
  },
  {
    id: 3,
    title: "Infinite Regression Chronicles",
    author: "Park Ji-hun",
    genre: "Regression",
    rating: 4.8,
    chapters: 412,
    views: "9.7M",
    description: "Every time he dies, the world resets. After a thousand loops watching humanity fall, the Last Regressor decides this time will be different — even if he has to carry the weight of a thousand lifetimes alone.",
    coverUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=450&fit=crop&auto=format",
    bannerUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&h=600&fit=crop&auto=format",
    tags: ["Regression", "Time Loop", "Action", "Apocalypse", "Op MC"],
  },
  {
    id: 4,
    title: "Mystic Cultivation Chronicles",
    author: "Chen Wei",
    genre: "Cultivation",
    rating: 4.9,
    chapters: 612,
    views: "15.2M",
    description: "An orphan with blocked meridians stumbles upon an ancient jade slip containing the lost techniques of a supreme cultivator. Against all odds, he embarks on a journey to reach the peak of immortality.",
    coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop&auto=format",
    bannerUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=600&fit=crop&auto=format",
    tags: ["Cultivation", "Wuxia", "Immortality", "Martial Arts", "Adventure"],
  },
  {
    id: 5,
    title: "The Void Sorcerer",
    author: "Kang Min-jun",
    genre: "Dark Fantasy",
    rating: 4.6,
    chapters: 287,
    views: "5.3M",
    description: "Condemned for a crime he didn't commit, a court mage discovers that the void magic banned by the kingdom is the only power capable of stopping the darkness threatening to swallow the continent.",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop&auto=format",
    bannerUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1600&h=600&fit=crop&auto=format",
    tags: ["Dark Fantasy", "Magic", "Antihero", "Political", "Adventure"],
  },
];

const trendingByPeriod: Record<string, { id: number; title: string; rating: number; genre: string; coverUrl: string }[]> = {
  weekly: ALL_NOVELS.slice(0, 5).map((n) => ({ id: n.id, title: n.title, rating: n.rating, genre: n.genre, coverUrl: n.coverUrl })),
  monthly: [ALL_NOVELS[3], ALL_NOVELS[0], ALL_NOVELS[4], ALL_NOVELS[1], ALL_NOVELS[5]].map((n) => ({ id: n.id, title: n.title, rating: n.rating, genre: n.genre, coverUrl: n.coverUrl })),
  season: [ALL_NOVELS[2], ALL_NOVELS[3], ALL_NOVELS[0], ALL_NOVELS[4], ALL_NOVELS[1]].map((n) => ({ id: n.id, title: n.title, rating: n.rating, genre: n.genre, coverUrl: n.coverUrl })),
  year: [ALL_NOVELS[2], ALL_NOVELS[0], ALL_NOVELS[5], ALL_NOVELS[3], ALL_NOVELS[4]].map((n) => ({ id: n.id, title: n.title, rating: n.rating, genre: n.genre, coverUrl: n.coverUrl })),
  alltime: [ALL_NOVELS[2], ALL_NOVELS[0], ALL_NOVELS[1], ALL_NOVELS[3], ALL_NOVELS[4]].map((n) => ({ id: n.id, title: n.title, rating: n.rating, genre: n.genre, coverUrl: n.coverUrl })),
};

const readingHistory = [
  { id: 1, title: "Shadow Monarch's Ascension", chapter: "Chapter 127: The Awakening", progress: 68, timeAgo: "2 hours ago", coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&auto=format" },
  { id: 2, title: "Mystic Cultivation Chronicles", chapter: "Chapter 89: Breaking Through", progress: 45, timeAgo: "1 day ago", coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop&auto=format" },
];

const latestTabs = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
  { id: "completed", label: "Completed" },
];

const trendingPeriods = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "season", label: "Season" },
  { id: "year", label: "Year" },
  { id: "alltime", label: "All Time" },
];

// Newest additions — last 6 novels in the list (simulates recently published)
const newNovels = ALL_NOVELS.slice(-6).reverse();

const latestUpdates = ALL_NOVELS.filter((n) => n.status === "ongoing").slice(0, 4).map((n) => ({
  id: n.id,
  title: n.title,
  author: n.author,
  genre: n.genre,
  rating: n.rating,
  chapters: n.chapters,
  latestChapter: n.latestChapter,
  coverUrl: n.coverUrl,
}));

export function HomePage() {
  const [activeLatestTab, setActiveLatestTab] = useState("all");
  const [activePeriod, setActivePeriod] = useState("weekly");
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const navigate = useNavigate();

  const isDark = theme === "dark";

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-10 sm:space-y-14 relative">
      {/* Ambient background radial glow — dark only */}
      {isDark && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)",
            zIndex: 0,
          }}
        />
      )}

      {/* Hero */}
      <FeaturedHero slides={heroSlides} />

      {/* Continue Reading */}
      <section>
        <SectionHeader icon={<Clock className="size-3" />} label="Continue Reading" title="Pick Up Where You Left Off" action="View Library" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {readingHistory.map((n) => <ReadingHistoryCard key={n.id} {...n} />)}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div className="flex items-start gap-3">
            {isDark && <div className="flex-shrink-0 mt-0.5" style={{ width: "3px", height: "36px", borderRadius: "2px", background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.2))", boxShadow: "0 0 8px rgba(16,185,129,0.4)" }} />}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", color: ts.sectionLabel, textShadow: isDark ? "0 0 12px rgba(16,185,129,0.4)" : "none" }}>
                <Flame className="size-3" />Hot Right Now
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.45rem", color: ts.sectionTitle, letterSpacing: "-0.01em" }}>Trending</h2>
            </div>
          </div>
          <button onClick={() => navigate("/popular")} className="flex items-center gap-1 transition-colors hover:opacity-80" style={{ fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", color: ts.subtext }}>
            See Popular<ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1 scrollbar-none" style={{ fontFamily: "'Inter', sans-serif" }}>
          {trendingPeriods.map((p) => (
            <button key={p.id} onClick={() => setActivePeriod(p.id)} className="rounded-lg px-3.5 py-1.5 transition-all flex-shrink-0" style={{ fontSize: "0.75rem", fontWeight: activePeriod === p.id ? 600 : 400, background: activePeriod === p.id ? "rgba(16,185,129,0.12)" : "transparent", color: activePeriod === p.id ? "#10b981" : ts.subtext, border: `1px solid ${activePeriod === p.id ? "rgba(16,185,129,0.3)" : "transparent"}` }}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {trendingByPeriod[activePeriod].map((novel, index) => (
            <TrendingCompactCard key={novel.id} rank={index + 1} {...novel} />
          ))}
        </div>
      </section>

      {/* Ad Slot 1 — between Trending and New on PieNovel */}
      <AdSlot type="leaderboard" label="728×90" />

      {/* New on Website */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div className="flex items-start gap-3">
            {isDark && <div className="flex-shrink-0 mt-0.5" style={{ width: "3px", height: "36px", borderRadius: "2px", background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.2))", boxShadow: "0 0 8px rgba(16,185,129,0.4)" }} />}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", color: ts.sectionLabel, textShadow: isDark ? "0 0 12px rgba(16,185,129,0.4)" : "none" }}>
                <Sparkles className="size-3" />Just Added
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.45rem", color: ts.sectionTitle, letterSpacing: "-0.01em" }}>New on PieNovel</h2>
            </div>
          </div>
          <button onClick={() => navigate("/browse")} className="flex items-center gap-1 transition-colors hover:opacity-80" style={{ fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", color: ts.subtext }}>
            Browse all<ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {newNovels.map((novel) => (
            <div
              key={novel.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/novel/${novel.id}`)}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div
                className="relative rounded-xl overflow-hidden mb-2.5 transition-all duration-300"
                style={{
                  aspectRatio: "2/3",
                }}
              >
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-full h-full object-cover transition-transform duration-400"
                  style={{ transition: "transform 0.4s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 55%)" }} />
                {/* NEW badge */}
                <div
                  className="absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-white"
                  style={{ fontSize: "0.55rem", fontWeight: 800, background: "#10b981", letterSpacing: "0.08em", boxShadow: "0 0 8px rgba(16,185,129,0.5)" }}
                >
                  NEW
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="rounded px-1.5 py-0.5 text-white" style={{ fontSize: "0.6rem", fontWeight: 600, background: "rgba(0,0,0,0.6)" }}>{novel.genre}</span>
                  <span className="text-white" style={{ fontSize: "0.65rem", background: "rgba(0,0,0,0.55)", padding: "2px 6px", borderRadius: "6px" }}>⭐ {novel.rating}</span>
                </div>
              </div>
              <p
                className="truncate transition-colors duration-200 group-hover:text-emerald-400"
                style={{ fontSize: "0.85rem", fontWeight: 600, color: ts.text, marginBottom: "2px" }}
              >
                {novel.title}
              </p>
              <p className="truncate" style={{ fontSize: "0.72rem", color: ts.subtext }}>{novel.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Slot 2 — between New on PieNovel and Latest Updates */}
      <AdSlot type="leaderboard" label="728×90" />

      {/* Latest Updates */}
      <section>
        <SectionHeader icon={<TrendingUp className="size-3" />} label="Fresh Chapters" title="Latest Updates" />
        <NavigationTabs tabs={latestTabs} activeTab={activeLatestTab} onTabChange={setActiveLatestTab} className="mb-5" />
        <div className="space-y-2">
          {latestUpdates.map((novel) => <NovelCard key={novel.id} {...novel} />)}
        </div>

        {/* Ad Slot 3 — bottom of Latest Updates */}
        <AdSlot type="leaderboard" label="728×90" className="mt-8 mb-2" />

        {/* More Updates */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/latest")}
            className="flex items-center gap-2 rounded-xl px-6 py-3 border transition-all group"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: ts.sectionLabel, borderColor: "rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.12)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.06)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; }}
          >
            More Updates
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </main>
  );
}
