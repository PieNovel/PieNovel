import { useState } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { GenrePill, NovelListCard } from "../components/page-shell";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS, GENRES } from "../data/novels";

const STATUS_TABS = ["All", "Ongoing", "Completed", "Hiatus"];

export function LatestUpdatesPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const [genre, setGenre] = useState("All");
  const [statusTab, setStatusTab] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_NOVELS
    .filter((n) => genre === "All" || n.genre === genre || n.tags.includes(genre))
    .filter((n) => statusTab === "All" || n.status === statusTab.toLowerCase());

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Page title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="size-4" style={{ color: ts.sectionLabel }} />
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", color: ts.sectionLabel }}>
            Fresh Chapters
          </p>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.4rem)", color: ts.sectionTitle, marginBottom: "8px" }}>
          Latest Updates
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: ts.subtext }}>
          Stay up to date with the newest chapters from all your favourite novels.
        </p>
      </div>

      {/* Ad Slot 1 — below header */}
      <AdSlot type="leaderboard" label="728×90" className="mb-8" />

      {/* Status tabs */}
      <div className="flex items-center gap-1 mb-5 border-b" style={{ borderColor: ts.border }}>
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusTab(s); setPage(1); }}
            className="px-4 py-2.5 transition-all"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem",
              fontWeight: statusTab === s ? 600 : 400,
              color: statusTab === s ? ts.sectionLabel : ts.subtext,
              borderBottom: `2px solid ${statusTab === s ? ts.sectionLabel : "transparent"}`,
              marginBottom: "-1px",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {GENRES.map((g) => <GenrePill key={g} label={g} active={genre === g} onClick={() => { setGenre(g); setPage(1); }} />)}
      </div>

      {/* Ad Slot 2 — between genre pills and list */}
      <AdSlot type="leaderboard" label="728×90" className="mb-8" />

      {/* Update time note */}
      <div className="flex items-center justify-between mb-5">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.muted }}>
          Showing {paginated.length} of {filtered.length} novels
        </p>
        <div className="flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.muted }}>
          <RefreshCw className="size-3" />
          Updated hourly
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 mb-8">
        {paginated.map((n) => <NovelListCard key={n.id} novel={n} />)}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.subtext, marginBottom: "8px" }}>Nothing here yet</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.muted }}>Try adjusting your filters.</p>
        </div>
      )}

      {/* Ad Slot 3 — before load more */}
      <AdSlot type="leaderboard" label="728×90" className="mb-8" />

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 rounded-xl px-6 py-3 border transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: ts.sectionLabel, borderColor: "rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.12)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.06)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; }}
          >
            <RefreshCw className="size-4" />
            Load More
          </button>
        </div>
      )}
    </main>
  );
}
