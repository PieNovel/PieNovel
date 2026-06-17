import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { GenrePill, NovelGridCard, NovelListCard } from "../components/page-shell";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS, GENRES } from "../data/novels";

const SORT_OPTIONS = ["Most Popular", "Highest Rated", "Most Chapters", "Recently Completed"];

export function CompletedPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("Most Popular");
  const [view, setView] = useState<"grid" | "list">("list");

  const completed = ALL_NOVELS
    .filter((n) => n.status === "completed")
    .filter((n) => genre === "All" || n.genre === genre || n.tags.includes(genre))
    .sort((a, b) => {
      if (sort === "Highest Rated") return b.rating - a.rating;
      if (sort === "Most Chapters") return b.chapters - a.chapters;
      return b.rating - a.rating;
    });

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: ts.sectionTitle, marginBottom: "4px" }}>Completed</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.muted }}>Finished stories — no waiting for new chapters</p>
      </div>

      {/* Ad Slot 1 — below header */}
      <AdSlot type="leaderboard" label="728×90" className="mb-8" />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Completed", value: ALL_NOVELS.filter((n) => n.status === "completed").length.toString() },
          { label: "Avg. Chapters", value: Math.round(ALL_NOVELS.filter((n) => n.status === "completed").reduce((s, n) => s + n.chapters, 0) / ALL_NOVELS.filter((n) => n.status === "completed").length).toString() },
          { label: "Avg. Rating", value: (ALL_NOVELS.filter((n) => n.status === "completed").reduce((s, n) => s + n.rating, 0) / ALL_NOVELS.filter((n) => n.status === "completed").length).toFixed(1) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 border text-center" style={{ background: ts.cardBg, borderColor: ts.border }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.6rem", color: ts.sectionLabel }}>{stat.value}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => <GenrePill key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />)}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border px-3 py-2 outline-none"
            style={{ background: ts.cardBg, borderColor: ts.border, fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: ts.text, cursor: "pointer" }}
          >
            {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-0.5 rounded-xl border p-1" style={{ background: ts.cardBg, borderColor: ts.border }}>
            {(["list", "grid"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className="rounded-lg px-2.5 py-1 transition-all" style={{ fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, background: view === v ? "rgba(16,185,129,0.12)" : "transparent", color: view === v ? "#10b981" : ts.muted }}>
                {v === "list" ? "≡ List" : "⊞ Grid"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ad Slot 2 — between controls and list */}
      <AdSlot type="leaderboard" label="728×90" className="mb-6" />

      {/* Completed badge legend */}
      <div className="flex items-center gap-2 mb-5">
        <CheckCircle2 className="size-4" style={{ color: "#6366f1" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: ts.subtext }}>{completed.length} fully completed novels</p>
      </div>

      {view === "list" ? (
        <div className="space-y-3">
          {completed.map((n) => <NovelListCard key={n.id} novel={n} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {completed.map((n) => <NovelGridCard key={n.id} novel={n} />)}
        </div>
      )}

      {/* Ad Slot 3 — bottom */}
      <AdSlot type="leaderboard" label="728×90" className="mt-8" />

      {completed.length === 0 && (
        <div className="py-24 text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.subtext, marginBottom: "8px" }}>No completed novels here yet</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.muted }}>Try a different genre filter.</p>
        </div>
      )}
    </main>
  );
}
