import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS, type Novel } from "../data/novels";

const ALL_GENRES = ["Action", "Fantasy", "Romance", "Comedy", "Horror", "Mystery", "Sci-Fi", "Xianxia", "Cultivation", "Regression"];
const ALL_STATUS = ["All", "Ongoing", "Completed", "Hiatus"];

export function SearchPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(q);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const inputBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
  const inputBorder = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";

  const results: Novel[] = ALL_NOVELS.filter((n) => {
    const matchesQ =
      q === "" ||
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      n.author.toLowerCase().includes(q.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
    const matchesGenre = selectedGenre === "All" || n.genre.toLowerCase() === selectedGenre.toLowerCase() || n.tags.some((t) => t.toLowerCase() === selectedGenre.toLowerCase());
    const matchesStatus = selectedStatus === "All" || n.status === selectedStatus.toLowerCase();
    return matchesQ && matchesGenre && matchesStatus;
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams(inputValue ? { q: inputValue } : {});
  }

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  return (
    <div className="min-h-[calc(100vh-56px)] py-8 px-4 sm:px-6 lg:px-8" style={{ background: ts.bg }}>
      <div className="max-w-5xl mx-auto">
        {/* Ad Slot 1 — above search bar */}
        <AdSlot type="leaderboard" label="728×90" className="mb-6" />

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5" style={{ color: ts.subtext }} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search novels, authors, tags..."
            className="w-full rounded-2xl pl-12 pr-16 py-3.5 outline-none border text-sm transition-all"
            style={{ background: inputBg, borderColor: inputBorder, color: ts.text, fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
            onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
          />
          {inputValue && (
            <button type="button" className="absolute right-12 top-1/2 -translate-y-1/2" onClick={() => { setInputValue(""); setSearchParams({}); }}>
              <X className="size-4" style={{ color: ts.subtext }} />
            </button>
          )}
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all"
            style={{ background: showFilters ? "rgba(16,185,129,0.15)" : "transparent", color: showFilters ? "#10b981" : ts.subtext }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-5 rounded-2xl border" style={{ background: cardBg, borderColor: inputBorder }}>
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold" style={{ color: ts.subtext, fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Genre</p>
              <div className="flex flex-wrap gap-2">
                {["All", ...ALL_GENRES].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className="px-3 py-1 rounded-full text-xs border transition-all"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      background: selectedGenre === g ? "rgba(16,185,129,0.15)" : "transparent",
                      borderColor: selectedGenre === g ? "#10b981" : inputBorder,
                      color: selectedGenre === g ? "#10b981" : ts.subtext,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold" style={{ color: ts.subtext, fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Status</p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className="px-3 py-1 rounded-full text-xs border transition-all"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      background: selectedStatus === s ? "rgba(16,185,129,0.15)" : "transparent",
                      borderColor: selectedStatus === s ? "#10b981" : inputBorder,
                      color: selectedStatus === s ? "#10b981" : ts.subtext,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result count */}
        <div className="mb-5 flex items-center justify-between">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext }}>
            {q ? (
              <>
                <span style={{ color: ts.text, fontWeight: 500 }}>{results.length}</span> results for{" "}
                <span style={{ color: "#10b981", fontWeight: 500 }}>"{q}"</span>
              </>
            ) : (
              <><span style={{ color: ts.text, fontWeight: 500 }}>{results.length}</span> novels found</>
            )}
          </p>
        </div>

        {/* Ad Slot 2 — before results */}
        <AdSlot type="leaderboard" label="728×90" className="mb-6" />

        {/* Results grid */}
        {results.length === 0 ? (
          <div className="text-center py-24">
            <Search className="mx-auto mb-4 size-12 opacity-20" style={{ color: ts.text }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: ts.text }}>No results found</p>
            <p className="mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.subtext }}>Try different keywords or adjust your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((novel) => (
              <div
                key={novel.id}
                onClick={() => navigate(`/novel/${novel.id}`)}
                className="group flex gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                style={{ background: cardBg, borderColor: inputBorder }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = inputBorder)}
              >
                <div className="flex-shrink-0 overflow-hidden rounded-lg" style={{ width: "64px", height: "90px" }}>
                  <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="line-clamp-2 group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "0.9rem", color: ts.text }}>
                    {novel.title}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: ts.subtext, fontFamily: "'Inter', sans-serif" }}>by {novel.author}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-emerald-500 border border-emerald-900/60 rounded px-1.5 py-0.5" style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {novel.genre}
                    </span>
                    <span className="text-xs" style={{ color: ts.subtext }}>★ {novel.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-1.5 text-xs" style={{ color: ts.subtext, fontFamily: "'Inter', sans-serif" }}>{novel.chapters} chapters</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ad Slot 3 — bottom */}
        <AdSlot type="leaderboard" label="728×90" className="mt-8" />
      </div>
    </div>
  );
}
