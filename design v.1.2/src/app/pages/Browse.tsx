import { useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { Search, X, ChevronDown, Grid3X3, List } from "lucide-react";
import { NovelGridCard, NovelListCard } from "../components/page-shell";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS, GENRES } from "../data/novels";

const GENRE_LIST = GENRES.filter((g) => g !== "All");

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "chinese", label: "Chinese" },
  { value: "korean", label: "Korean" },
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
];

const ORDER_OPTIONS = [
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
  { value: "update", label: "Update" },
  { value: "added", label: "Added" },
  { value: "popular", label: "Popular" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    ongoing: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
    completed: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
    hiatus: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
  };
  const c = colors[status] || colors.ongoing;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: "0.65rem",
        fontFamily: "'Inter', sans-serif",
        padding: "1px 7px",
        borderRadius: "999px",
        textTransform: "capitalize",
        letterSpacing: "0.02em",
      }}
    >
      {status}
    </span>
  );
}

interface GenreInputProps {
  label: string;
  selected: string[];
  onAdd: (g: string) => void;
  onRemove: (g: string) => void;
  ts: Record<string, string>;
  accentColor?: string;
}

function GenreInput({ label, selected, onAdd, onRemove, ts, accentColor = "#10b981" }: GenreInputProps) {
  const [inputVal, setInputVal] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestions = GENRE_LIST.filter(
    (g) => !selected.includes(g) && g.toLowerCase().includes(inputVal.toLowerCase())
  );

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && suggestions.length > 0) {
      onAdd(suggestions[0]);
      setInputVal("");
      setOpen(false);
    }
    if (e.key === "Backspace" && inputVal === "" && selected.length > 0) {
      onRemove(selected[selected.length - 1]);
    }
  }

  return (
    <div className="flex-1 min-w-0">
      <label style={{ fontSize: "0.75rem", color: ts.muted, fontFamily: "'Inter', sans-serif", display: "block", marginBottom: "6px" }}>{label}</label>
      <div
        ref={containerRef}
        className="flex flex-wrap items-center gap-1.5 rounded-xl border px-3 py-2 min-h-[42px] relative"
        style={{ background: ts.cardBg, borderColor: ts.border, cursor: "text" }}
        onClick={() => (containerRef.current?.querySelector("input") as HTMLInputElement)?.focus()}
      >
        {selected.map((g) => (
          <span
            key={g}
            className="flex items-center gap-1 rounded-md px-2 py-0.5"
            style={{ background: `${accentColor}22`, color: accentColor, fontSize: "0.72rem", fontFamily: "'Inter', sans-serif" }}
          >
            {g}
            <button onClick={(e) => { e.stopPropagation(); onRemove(g); }} className="opacity-70 hover:opacity-100">
              <X className="size-2.5" />
            </button>
          </span>
        ))}
        <input
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          placeholder={selected.length === 0 ? "Action, Fantasy, etc." : ""}
          className="bg-transparent outline-none flex-1 min-w-[80px]"
          style={{ fontSize: "0.82rem", color: ts.text, fontFamily: "'Inter', sans-serif" }}
        />
        {open && suggestions.length > 0 && (
          <div
            className="absolute left-0 top-full mt-1 z-20 rounded-xl border overflow-hidden"
            style={{ background: ts.cardBg, borderColor: ts.border, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", width: "100%", maxHeight: "200px", overflowY: "auto" }}
          >
            {suggestions.map((g) => (
              <button
                key={g}
                className="w-full text-left px-4 py-2 transition-colors"
                style={{ fontSize: "0.82rem", color: ts.text, fontFamily: "'Inter', sans-serif" }}
                onMouseDown={() => { onAdd(g); setInputVal(""); setOpen(false); }}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  options,
  value,
  onChange,
  ts,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  ts: Record<string, string>;
}) {
  const selected = options.find((o) => o.value === value);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 rounded-xl border px-3 py-2 whitespace-nowrap"
        style={{ background: ts.cardBg, borderColor: ts.border, fontSize: "0.82rem", color: ts.text, fontFamily: "'Inter', sans-serif" }}
      >
        {selected?.label}
        <ChevronDown className="size-3.5" style={{ color: ts.muted }} />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-20 rounded-xl border overflow-hidden"
          style={{ background: ts.cardBg, borderColor: ts.border, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: "100%" }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              className="w-full text-left px-4 py-2 transition-colors hover:bg-white/5"
              style={{ fontSize: "0.82rem", color: o.value === value ? "#10b981" : ts.text, fontFamily: "'Inter', sans-serif" }}
              onMouseDown={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BrowsePage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "";

  const [includeGenres, setIncludeGenres] = useState<string[]>(initialGenre ? [initialGenre] : []);
  const [excludeGenres, setExcludeGenres] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [activeOrder, setActiveOrder] = useState("update");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const viewsToNum = (v: string) => parseFloat(v.replace("M", "")) * (v.includes("M") ? 1_000_000 : 1_000);

  const filtered = ALL_NOVELS.filter((n) => {
    const matchQuery = query === "" || n.title.toLowerCase().includes(query.toLowerCase()) || n.author.toLowerCase().includes(query.toLowerCase());
    const matchInclude = includeGenres.length === 0 || includeGenres.some((g) => n.genre === g || n.tags.includes(g));
    const matchExclude = excludeGenres.length === 0 || !excludeGenres.some((g) => n.genre === g || n.tags.includes(g));
    const matchStatus = activeStatus === "all" || n.status === activeStatus;
    const matchType = activeType === "all" || n.type === activeType;
    return matchQuery && matchInclude && matchExclude && matchStatus && matchType;
  }).sort((a, b) => {
    if (activeOrder === "az") return a.title.localeCompare(b.title);
    if (activeOrder === "za") return b.title.localeCompare(a.title);
    if (activeOrder === "popular") return viewsToNum(b.views) - viewsToNum(a.views);
    if (activeOrder === "added") return b.addedAt - a.addedAt;
    return 0;
  });

  function resetFilters() {
    setIncludeGenres([]);
    setExcludeGenres([]);
    setActiveStatus("all");
    setActiveType("all");
    setActiveOrder("update");
    setQuery("");
  }

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: ts.sectionTitle, marginBottom: "4px" }}>Browse</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.muted }}>{ALL_NOVELS.length} novels · filter by genre, status or type</p>
      </div>

      {/* Ad Slot 1 — below header */}
      <AdSlot type="leaderboard" label="728×90" className="mb-6" />

      {/* Filter card */}
      <div
        className="rounded-2xl border p-4 sm:p-5 mb-6 space-y-4"
        style={{ background: ts.cardBg, borderColor: ts.border }}
      >
        {/* Search row */}
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5"
          style={{ background: theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)", borderColor: ts.border }}
        >
          <Search className="size-4 flex-shrink-0" style={{ color: ts.muted }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author..."
            className="bg-transparent outline-none w-full"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: ts.text }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="size-4" style={{ color: ts.muted }} />
            </button>
          )}
        </div>

        {/* Genre row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <GenreInput
            label="Genres"
            selected={includeGenres}
            onAdd={(g) => setIncludeGenres((p) => [...p, g])}
            onRemove={(g) => setIncludeGenres((p) => p.filter((x) => x !== g))}
            ts={ts}
            accentColor="#10b981"
          />
          <GenreInput
            label="Exclude genres"
            selected={excludeGenres}
            onAdd={(g) => setExcludeGenres((p) => [...p, g])}
            onRemove={(g) => setExcludeGenres((p) => p.filter((x) => x !== g))}
            ts={ts}
            accentColor="#ef4444"
          />
        </div>

        {/* More options toggle */}
        <button
          onClick={() => setMoreOpen((p) => !p)}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={{ color: "#10b981", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}
        >
          More options
          <ChevronDown className="size-3.5" style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>

        {/* Expandable filters */}
        {moreOpen && (
          <div className="flex flex-wrap gap-3 pt-1">
            <div>
              <label style={{ fontSize: "0.75rem", color: ts.muted, fontFamily: "'Inter', sans-serif", display: "block", marginBottom: "6px" }}>Status</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setActiveStatus(s.value)}
                    className="rounded-lg px-3 py-1.5 border transition-all"
                    style={{
                      fontSize: "0.78rem",
                      fontFamily: "'Inter', sans-serif",
                      background: activeStatus === s.value ? "rgba(16,185,129,0.12)" : "transparent",
                      borderColor: activeStatus === s.value ? "#10b981" : ts.border,
                      color: activeStatus === s.value ? "#10b981" : ts.muted,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: ts.muted, fontFamily: "'Inter', sans-serif", display: "block", marginBottom: "6px" }}>Type</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setActiveType(t.value)}
                    className="rounded-lg px-3 py-1.5 border transition-all"
                    style={{
                      fontSize: "0.78rem",
                      fontFamily: "'Inter', sans-serif",
                      background: activeType === t.value ? "rgba(16,185,129,0.12)" : "transparent",
                      borderColor: activeType === t.value ? "#10b981" : ts.border,
                      color: activeType === t.value ? "#10b981" : ts.muted,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={resetFilters}
            className="rounded-xl border px-5 py-2 transition-opacity hover:opacity-70"
            style={{ fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", color: ts.muted, borderColor: ts.border }}
          >
            RESET
          </button>
        </div>
      </div>

      {/* Ad Slot 2 — between filters and results */}
      <AdSlot type="leaderboard" label="728×90" className="mb-6" />

      {/* Results bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: ts.muted }}>
            <span style={{ color: ts.text, fontWeight: 600 }}>{filtered.length}</span> novels found
          </p>
          {/* Active filter badges */}
          <div className="flex flex-wrap gap-1.5">
            {includeGenres.map((g) => (
              <span key={g} className="flex items-center gap-1 rounded-md px-2 py-0.5" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: "0.68rem", fontFamily: "'Inter', sans-serif" }}>
                {g} <button onClick={() => setIncludeGenres((p) => p.filter((x) => x !== g))}><X className="size-2.5" /></button>
              </span>
            ))}
            {activeStatus !== "all" && (
              <span className="flex items-center gap-1 rounded-md px-2 py-0.5" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: "0.68rem", fontFamily: "'Inter', sans-serif" }}>
                {STATUS_OPTIONS.find((s) => s.value === activeStatus)?.label}
                <button onClick={() => setActiveStatus("all")}><X className="size-2.5" /></button>
              </span>
            )}
            {activeType !== "all" && (
              <span className="flex items-center gap-1 rounded-md px-2 py-0.5" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: "0.68rem", fontFamily: "'Inter', sans-serif" }}>
                {TYPE_OPTIONS.find((t) => t.value === activeType)?.label}
                <button onClick={() => setActiveType("all")}><X className="size-2.5" /></button>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Order */}
          <FilterSelect options={ORDER_OPTIONS} value={activeOrder} onChange={setActiveOrder} ts={ts} />
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl border p-1" style={{ background: ts.cardBg, borderColor: ts.border }}>
            <button onClick={() => setView("grid")} className="rounded-lg p-1.5 transition-all" style={{ background: view === "grid" ? "rgba(16,185,129,0.12)" : "transparent", color: view === "grid" ? "#10b981" : ts.muted }}>
              <Grid3X3 className="size-4" />
            </button>
            <button onClick={() => setView("list")} className="rounded-lg p-1.5 transition-all" style={{ background: view === "list" ? "rgba(16,185,129,0.12)" : "transparent", color: view === "list" ? "#10b981" : ts.muted }}>
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((n) => (
            <div key={n.id} className="relative">
              <NovelGridCard novel={n} />
              <div className="absolute top-2 left-2">
                <StatusBadge status={n.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div key={n.id} className="relative">
              <NovelListCard novel={n} />
            </div>
          ))}
        </div>
      )}

      {/* Ad Slot 3 — bottom */}
      {filtered.length > 0 && <AdSlot type="leaderboard" label="728×90" className="mt-8" />}

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.subtext, marginBottom: "8px" }}>No novels found</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.muted }}>Try adjusting your filters.</p>
          <button onClick={resetFilters} className="mt-4 px-5 py-2 rounded-xl" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif" }}>
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}
