import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical, BookOpen, X, Check } from "lucide-react";
import { useTheme, THEME_STYLES } from "../../context/ThemeContext";
import { ALL_NOVELS, type Novel } from "../../data/novels";
import { GENRES } from "../../data/genres";

// DB mapping:
// List novels → SELECT * FROM novels ORDER BY created_at DESC
// Filter by status → WHERE status = ?
// Filter by genre → JOIN novel_genres ON novels.id = novel_genres.novel_id WHERE novel_genres.genre_id = ?
// Search → WHERE title ILIKE '%query%' OR author ILIKE '%query%'
// Delete novel → DELETE FROM novels WHERE id = ?

type StatusFilter = "all" | "ongoing" | "completed" | "hiatus";

export function NovelManagement() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";
  const inputBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editNovel, setEditNovel] = useState<Novel | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = ALL_NOVELS.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || n.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)));
    }
  }

  const STATUS_OPTIONS: StatusFilter[] = ["all", "ongoing", "completed", "hiatus"];
  const STATUS_COLORS: Record<string, string> = { ongoing: "#f59e0b", completed: "#10b981", hiatus: "#ef4444" };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: ts.text }}>Novel Management</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>{ALL_NOVELS.length} novels total</p>
        </div>
        <button
          onClick={() => { setEditNovel(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-semibold"
          style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}
        >
          <Plus className="size-4" />
          Add Novel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: ts.subtext }} />
          <input
            type="text"
            placeholder="Search novels or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ fontFamily: "'Inter', sans-serif", background: cardBg, borderColor, color: ts.text }}
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-sm capitalize transition-all border"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: statusFilter === s ? "rgba(16,185,129,0.12)" : "transparent",
                color: statusFilter === s ? "#10b981" : ts.subtext,
                borderColor: statusFilter === s ? "rgba(16,185,129,0.3)" : borderColor,
              }}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-4"
          style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#10b981" }}>{selectedIds.size} selected</span>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
            style={{ fontFamily: "'Inter', sans-serif", background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
          >
            <Trash2 className="size-3.5" />
            Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())} style={{ color: ts.subtext }}>
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-emerald-500"
                  />
                </th>
                {["Novel", "Genre", "Chapters", "Views", "Status", "Updated", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, color: ts.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((novel) => (
                <tr
                  key={novel.id}
                  style={{ borderBottom: `1px solid ${borderColor}`, background: selectedIds.has(novel.id) ? "rgba(16,185,129,0.04)" : "transparent" }}
                  onMouseEnter={(e) => { if (!selectedIds.has(novel.id)) e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { if (!selectedIds.has(novel.id)) e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selectedIds.has(novel.id)} onChange={() => toggleSelect(novel.id)} className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={novel.coverUrl} alt={novel.title} className="size-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[160px]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.text }}>{novel.title}</p>
                        <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: ts.subtext }}>{novel.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{novel.genre}</td>
                  <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.text }}>{novel.chapters}</td>
                  <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.text }}>{novel.views}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ fontFamily: "'Inter', sans-serif", background: (STATUS_COLORS[novel.status] || "#6b7280") + "18", color: STATUS_COLORS[novel.status] || "#6b7280" }}>
                      {novel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{novel.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/novel/${novel.id}`}
                        className="size-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ color: ts.subtext, background: "transparent" }}
                        title="View"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <button
                        onClick={() => { setEditNovel(novel); setShowModal(true); }}
                        className="size-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ color: "#10b981", background: "rgba(16,185,129,0.08)" }}
                        title="Edit"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(novel.id)}
                        className="size-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
                        title="Delete"
                      >
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
            <BookOpen className="size-10 opacity-20" style={{ color: ts.subtext }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: ts.subtext }}>No novels match your filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div
            className="w-full max-w-lg rounded-2xl border overflow-hidden"
            style={{ background: cardBg, borderColor }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>
                {editNovel ? "Edit Novel" : "Add Novel"}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="size-5" style={{ color: ts.subtext }} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {[
                { label: "Title", defaultValue: editNovel?.title ?? "", placeholder: "Novel title" },
                { label: "Author", defaultValue: editNovel?.author ?? "", placeholder: "Author name" },
                { label: "Description", defaultValue: editNovel?.description ?? "", placeholder: "Description...", textarea: true },
              ].map(({ label, defaultValue, placeholder, textarea }) => (
                <div key={label}>
                  <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>{label}</label>
                  {textarea ? (
                    <textarea defaultValue={defaultValue} placeholder={placeholder} rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }} />
                  ) : (
                    <input defaultValue={defaultValue} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }} />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Genre</label>
                  <select defaultValue={editNovel?.genre ?? ""} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }}>
                    <option value="">Select genre</option>
                    {GENRES.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Status</label>
                  <select defaultValue={editNovel?.status ?? "ongoing"} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }}>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="hiatus">Hiatus</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm border" style={{ fontFamily: "'Inter', sans-serif", borderColor, color: ts.subtext }}>Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-1.5" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>
                <Check className="size-4" />
                {editNovel ? "Save Changes" : "Add Novel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: cardBg, borderColor }}>
            <h3 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Delete novel?</h3>
            <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext }}>This will permanently delete the novel and all its chapters. This cannot be undone.</p>
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
