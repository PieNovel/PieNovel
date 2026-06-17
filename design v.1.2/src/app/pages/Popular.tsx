import { useState } from "react";
import { Flame, Star, Eye, BookOpen, MessageSquare, Bookmark } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS } from "../data/novels";
import { useNavigate } from "react-router";
import type { Novel } from "../data/novels";
import { AdSlot } from "../components/ad-slot";

const PERIODS = ["Monthly", "Season", "Year", "All Time"];

// Sort options with icon + key
const SORT_OPTIONS = [
  { key: "rating",    label: "Rating",    icon: Star },
  { key: "views",     label: "Views",     icon: Eye },
  { key: "chapters",  label: "Chapters",  icon: BookOpen },
  { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { key: "comments",  label: "Comments",  icon: MessageSquare },
];

const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7c54"];

// Mock extra stats derived deterministically from id so they stay stable
function mockStats(novel: Novel) {
  const seed = novel.id * 137;
  return {
    bookmarks: `${((seed % 90) + 10).toFixed(0)}.${seed % 9}K`,
    comments: `${((seed % 40) + 2).toFixed(0)}.${(seed * 3) % 9}K`,
  };
}

function PopularCard({ novel, rank, sortKey }: { novel: Novel; rank: number; sortKey: string }) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const navigate = useNavigate();
  const rankColor = rank <= 3 ? RANK_COLORS[rank - 1] : ts.muted;
  const statusColor = novel.status === "completed" ? "#6366f1" : "#10b981";
  const stats = mockStats(novel);

  const statItems = [
    { key: "rating",    icon: Star,           value: novel.rating.toString(), color: "#f59e0b", fill: true },
    { key: "views",     icon: Eye,            value: novel.views,             color: ts.muted,  fill: false },
    { key: "chapters",  icon: BookOpen,       value: `${novel.chapters} ch`,  color: ts.muted,  fill: false },
    { key: "bookmarks", icon: Bookmark,       value: stats.bookmarks,         color: ts.muted,  fill: false },
    { key: "comments",  icon: MessageSquare,  value: stats.comments,          color: ts.muted,  fill: false },
  ];

  return (
    <div
      className="flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer group"
      style={{ background: ts.cardBg, borderColor: rank <= 3 ? `${rankColor}22` : ts.border }}
      onClick={() => navigate(`/novel/${novel.id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = rank <= 3 ? `${rankColor}22` : ts.border)}
    >
      {/* Rank */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "36px" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: rank <= 3 ? "1.6rem" : "1.1rem", color: rankColor, lineHeight: 1 }}>
          {rank}
        </span>
      </div>

      {/* Cover */}
      <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: "60px", height: "84px" }}>
        <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="truncate" style={{ fontSize: "0.92rem", fontWeight: 700, color: ts.text }}>{novel.title}</p>
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-white" style={{ fontSize: "0.6rem", fontWeight: 700, background: statusColor }}>{novel.status === "completed" ? "Done" : "Live"}</span>
        </div>
        <p style={{ fontSize: "0.74rem", color: ts.subtext, marginBottom: "6px" }}>{novel.author}</p>
        <p className="line-clamp-2 mb-2.5" style={{ fontSize: "0.73rem", color: ts.muted, lineHeight: 1.45 }}>{novel.description}</p>

        {/* Stats row — highlight active sort */}
        <div className="flex flex-wrap items-center gap-3">
          {statItems.map(({ key, icon: Icon, value, color, fill }) => (
            <span
              key={key}
              className="flex items-center gap-1 transition-all"
              style={{
                fontSize: "0.74rem",
                color: sortKey === key ? "#10b981" : color,
                fontWeight: sortKey === key ? 700 : 400,
              }}
            >
              <Icon
                className="size-3"
                style={{ fill: fill && sortKey === key ? "#10b981" : fill ? color : "none", color: sortKey === key ? "#10b981" : color }}
              />
              {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PopularPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const [period, setPeriod] = useState("Monthly");
  const [sortKey, setSortKey] = useState("rating");

  // Shuffle slightly per period so each tab feels different
  const periodSeeds: Record<string, number[]> = {
    Monthly:  [0, 1, 2, 3, 4, 5, 6, 7],
    Season:   [3, 0, 4, 1, 5, 2, 6, 7],
    Year:     [2, 0, 5, 3, 4, 1, 7, 6],
    "All Time": [2, 0, 1, 3, 4, 5, 7, 6],
  };

  const reordered = (periodSeeds[period] || [0,1,2,3,4,5,6,7]).map((i) => ALL_NOVELS[i]).filter(Boolean);

  const sorted = [...reordered].sort((a, b) => {
    if (sortKey === "rating")    return b.rating - a.rating;
    if (sortKey === "chapters")  return b.chapters - a.chapters;
    if (sortKey === "views")     return parseFloat(b.views) - parseFloat(a.views);
    if (sortKey === "bookmarks") return mockStats(b).bookmarks.localeCompare(mockStats(a).bookmarks) * -1;
    if (sortKey === "comments")  return mockStats(b).comments.localeCompare(mockStats(a).comments) * -1;
    return 0;
  });

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: ts.sectionTitle, marginBottom: "4px" }}>Popular</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.muted }}>Rankings update every day</p>
      </div>

      {/* Period tabs */}
      <div className="flex items-center gap-2 mb-5">
        <Flame className="size-4 flex-shrink-0" style={{ color: "#10b981" }} />
        <div className="flex items-center gap-1 flex-wrap" style={{ fontFamily: "'Inter', sans-serif" }}>
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-lg px-3.5 py-1.5 transition-all"
              style={{ fontSize: "0.8rem", fontWeight: period === p ? 600 : 400, background: period === p ? "rgba(16,185,129,0.12)" : "transparent", color: period === p ? "#10b981" : ts.subtext, border: `1px solid ${period === p ? "rgba(16,185,129,0.3)" : "transparent"}` }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Ad Slot 1 — below title, before period tabs */}
      <AdSlot type="leaderboard" label="728×90" className="mb-8" />

      {/* Sort by */}
      <div className="flex items-center gap-2 mb-8 flex-wrap" style={{ fontFamily: "'Inter', sans-serif" }}>
        <span style={{ fontSize: "0.72rem", color: ts.muted, fontWeight: 500 }}>Sort by</span>
        {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 border transition-all"
            style={{
              fontSize: "0.75rem",
              fontWeight: sortKey === key ? 600 : 400,
              background: sortKey === key ? "rgba(16,185,129,0.1)" : "transparent",
              borderColor: sortKey === key ? "rgba(16,185,129,0.4)" : ts.border,
              color: sortKey === key ? "#10b981" : ts.subtext,
            }}
          >
            <Icon className="size-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {sorted.slice(0, 4).map((n, i) => <PopularCard key={n.id} novel={n} rank={i + 1} sortKey={sortKey} />)}
      </div>

      {/* Ad Slot 2 — mid list */}
      <AdSlot type="leaderboard" label="728×90" className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {sorted.slice(4).map((n, i) => <PopularCard key={n.id} novel={n} rank={i + 5} sortKey={sortKey} />)}
      </div>

      {/* Ad Slot 3 — bottom */}
      <AdSlot type="leaderboard" label="728×90" className="mt-8" />
    </main>
  );
}
