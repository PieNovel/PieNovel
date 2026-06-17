import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit2, Trash2, Eye, ChevronDown, X, Check, BookMarked } from "lucide-react";
import { useTheme, THEME_STYLES } from "../../context/ThemeContext";
import { ALL_NOVELS } from "../../data/novels";

// DB mapping:
// List chapters → SELECT * FROM chapters WHERE novel_id = ? ORDER BY chapter_number DESC
// Add chapter   → INSERT INTO chapters (novel_id, number, title, content, published_at)
// Edit chapter  → UPDATE chapters SET title=?, content=? WHERE id=?
// Delete chapter→ DELETE FROM chapters WHERE id=?

interface Chapter {
  id: number;
  novelId: number;
  number: number;
  title: string;
  wordCount: number;
  publishedAt: string;
  status: "published" | "draft";
}

const MOCK_CHAPTERS: Chapter[] = ALL_NOVELS.slice(0, 5).flatMap((novel) =>
  Array.from({ length: 5 }, (_, i) => ({
    id: novel.id * 100 + i,
    novelId: novel.id,
    number: novel.chapters - i,
    title: `Ch. ${novel.chapters - i}: ${["The Awakening", "Dark Descent", "Hidden Power", "Breaking Limits", "Final Form"][i]}`,
    wordCount: Math.floor(Math.random() * 3000) + 2000,
    publishedAt: `${i === 0 ? "2h" : i === 1 ? "1d" : i + "d"} ago`,
    status: i === 0 ? "draft" : "published" as any,
  }))
);

export function ChapterManagement() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";

  const [selectedNovelId, setSelectedNovelId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = MOCK_CHAPTERS.filter((c) => {
    const matchNovel = selectedNovelId === "all" || c.novelId === selectedNovelId;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchNovel && matchSearch;
  });

  function getNovelTitle(novelId: number) {
    return ALL_NOVELS.find((n) => n.id === novelId)?.title ?? "Unknown";
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: ts.text }}>Chapter Management</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>{MOCK_CHAPTERS.length} chapters across {ALL_NOVELS.length} novels</p>
        </div>
        <button
          onClick={() => { setEditChapter(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-semibold"
          style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}
        >
          <Plus className="size-4" />
          Add Chapter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: ts.subtext }} />
          <input
            type="text"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ fontFamily: "'Inter', sans-serif", background: cardBg, borderColor, color: ts.text }}
          />
        </div>
        <div className="relative">
          <select
            value={selectedNovelId}
            onChange={(e) => setSelectedNovelId(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="pl-3 pr-8 py-2.5 rounded-xl border text-sm outline-none appearance-none"
            style={{ fontFamily: "'Inter', sans-serif", background: cardBg, borderColor, color: ts.text }}
          >
            <option value="all">All Novels</option>
            {ALL_NOVELS.slice(0, 10).map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none" style={{ color: ts.subtext }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {["Chapter", "Novel", "Words", "Status", "Published", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, color: ts.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((chapter) => (
                <tr
                  key={chapter.id}
                  style={{ borderBottom: `1px solid ${borderColor}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-5 py-3">
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.82rem", color: ts.text }}>{chapter.title}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="truncate max-w-[160px]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{getNovelTitle(chapter.novelId)}</p>
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.text }}>{chapter.wordCount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs" style={{ fontFamily: "'Inter', sans-serif", background: chapter.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)", color: chapter.status === "published" ? "#10b981" : "#f59e0b" }}>
                      {chapter.status}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{chapter.publishedAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/read/${chapter.novelId}/${chapter.number}`} className="size-7 rounded-lg flex items-center justify-center" style={{ color: ts.subtext }}>
                        <Eye className="size-3.5" />
                      </Link>
                      <button onClick={() => { setEditChapter(chapter); setShowModal(true); }} className="size-7 rounded-lg flex items-center justify-center" style={{ color: "#10b981", background: "rgba(16,185,129,0.08)" }}>
                        <Edit2 className="size-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(chapter.id)} className="size-7 rounded-lg flex items-center justify-center" style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}>
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <BookMarked className="size-10 opacity-20" style={{ color: ts.subtext }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: ts.subtext }}>No chapters found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-2xl rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>{editChapter ? "Edit Chapter" : "Add Chapter"}</h3>
              <button onClick={() => setShowModal(false)}><X className="size-5" style={{ color: ts.subtext }} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Novel</label>
                  <select defaultValue={editChapter?.novelId ?? ""} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }}>
                    <option value="">Select novel</option>
                    {ALL_NOVELS.slice(0, 10).map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Chapter Number</label>
                  <input type="number" defaultValue={editChapter?.number ?? ""} placeholder="e.g. 543" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Chapter Title</label>
                <input defaultValue={editChapter?.title ?? ""} placeholder="Chapter title" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Content</label>
                <textarea rows={8} placeholder="Chapter content..." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ fontFamily: "'Georgia', serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text, lineHeight: 1.8 }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Status</label>
                <select defaultValue={editChapter?.status ?? "draft"} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm border" style={{ fontFamily: "'Inter', sans-serif", borderColor, color: ts.subtext }}>Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-1.5" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>
                <Check className="size-4" />
                {editChapter ? "Save Changes" : "Publish Chapter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: cardBg, borderColor }}>
            <h3 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Delete chapter?</h3>
            <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext }}>This will permanently remove this chapter.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ fontFamily: "'Inter', sans-serif", borderColor, color: ts.subtext }}>Cancel</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm text-white" style={{ background: "#ef4444", fontFamily: "'Inter', sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
