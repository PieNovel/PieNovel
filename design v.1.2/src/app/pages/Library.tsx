import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, BookOpen, Star, Trash2, Search, Grid, List } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ALL_NOVELS } from "../data/novels";

type SortMode = "recent" | "title" | "rating";
type ViewMode = "grid" | "list";

export function LibraryPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const { isLoggedIn, favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortMode>("recent");
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4" style={{ background: ts.bg }}>
        <Heart className="size-12" style={{ color: "#10b981" }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.text }}>Sign in to view your library</p>
        <button onClick={() => navigate("/signin")} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>Sign In</button>
      </div>
    );
  }

  const favoriteNovels = favorites
    .map((f) => ({ ...f, novel: ALL_NOVELS.find((n) => n.id === f.novelId) }))
    .filter((f) => f.novel)
    .filter((f) => f.novel!.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "recent") return b.addedAt - a.addedAt;
      if (sort === "title") return a.novel!.title.localeCompare(b.novel!.title);
      return b.novel!.rating - a.novel!.rating;
    });

  return (
    <div className="min-h-[calc(100vh-56px)] py-10" style={{ background: ts.bg }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "2rem", color: ts.text }}>My Library</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>{favorites.length} saved {favorites.length === 1 ? "novel" : "novels"}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-xl border overflow-hidden" style={{ borderColor }}>
              {(["grid", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="p-2 transition-all"
                  style={{ background: view === v ? "rgba(16,185,129,0.12)" : "transparent", color: view === v ? "#10b981" : ts.subtext }}
                >
                  {v === "grid" ? <Grid className="size-4" /> : <List className="size-4" />}
                </button>
              ))}
            </div>
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="rounded-xl border px-3 py-2 text-sm outline-none"
              style={{ fontFamily: "'Inter', sans-serif", background: cardBg, borderColor, color: ts.text }}
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title A–Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: ts.subtext }} />
          <input
            type="text"
            placeholder="Search your library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ fontFamily: "'Inter', sans-serif", background: cardBg, borderColor, color: ts.text }}
          />
        </div>

        {/* Empty state */}
        {favoriteNovels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Heart className="size-14 opacity-20" style={{ color: ts.subtext }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: ts.text }}>
              {search ? "No results found" : "Your library is empty"}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, textAlign: "center", maxWidth: "280px" }}>
              {search ? "Try a different search term." : "Add novels to your library by clicking the heart icon on any novel."}
            </p>
            {!search && (
              <Link to="/browse" className="px-5 py-2 rounded-xl text-sm text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>Browse Novels</Link>
            )}
          </div>
        )}

        {/* Grid view */}
        {view === "grid" && favoriteNovels.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteNovels.map(({ novel, addedAt }) => (
              <div key={novel!.id} className="group relative">
                <Link to={`/novel/${novel!.id}`} className="block">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative">
                    <img src={novel!.coverUrl} alt={novel!.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex items-center gap-1 text-xs font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <BookOpen className="size-3" /> {novel!.chapters} ch.
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium line-clamp-2 mb-1" style={{ fontFamily: "'Inter', sans-serif", color: ts.text }}>{novel!.title}</p>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-current" style={{ color: "#f59e0b" }} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext }}>{novel!.rating}</span>
                  </div>
                </Link>
                {/* Remove button */}
                <button
                  onClick={() => toggleFavorite(novel!.id)}
                  className="absolute top-2 right-2 size-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(239,68,68,0.85)" }}
                  title="Remove from library"
                >
                  <Trash2 className="size-3.5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {view === "list" && favoriteNovels.length > 0 && (
          <div className="flex flex-col gap-3">
            {favoriteNovels.map(({ novel, addedAt }) => (
              <div
                key={novel!.id}
                className="flex items-center gap-4 rounded-2xl border p-4 group"
                style={{ background: cardBg, borderColor }}
              >
                <Link to={`/novel/${novel!.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <img src={novel!.coverUrl} alt={novel!.title} className="size-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ fontFamily: "'Playfair Display', serif", color: ts.text }}>{novel!.title}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext, marginTop: "2px" }}>{novel!.author}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext }}>
                        <Star className="size-3 fill-current" style={{ color: "#f59e0b" }} /> {novel!.rating}
                      </span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext }}>{novel!.chapters} chapters</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ fontFamily: "'Inter', sans-serif", background: novel!.status === "completed" ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)", color: novel!.status === "completed" ? "#10b981" : "#f59e0b" }}
                      >
                        {novel!.status}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFavorite(novel!.id)}
                  className="flex-shrink-0 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
