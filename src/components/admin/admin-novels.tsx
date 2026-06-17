"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, X, Check, BookOpen } from "lucide-react";
import { ALL_NOVELS, GENRES, type Novel } from "@/lib/admin/mock-data";

type StatusFilter = "all" | "ongoing" | "completed" | "hiatus";

const STATUS_OPTIONS: StatusFilter[] = ["all", "ongoing", "completed", "hiatus"];
const STATUS_COLORS: Record<string, string> = { ongoing: "#f59e0b", completed: "#10b981", hiatus: "#ef4444" };

export function AdminNovels({ locale }: { locale: string }) {
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--foreground)" }}>
            Novel Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{ALL_NOVELS.length} novels total</p>
        </div>
        <button
          onClick={() => { setEditNovel(null); setShowModal(true); }}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
        >
          <Plus className="size-4" />
          Add Novel
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search novels or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="rounded-xl border px-3 py-2 text-sm capitalize transition-all"
              style={{
                background: statusFilter === s ? "rgba(16,185,129,0.12)" : "transparent",
                color: statusFilter === s ? "var(--primary)" : "var(--muted-foreground)",
                borderColor: statusFilter === s ? "rgba(16,185,129,0.3)" : "var(--border)",
              }}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}>
          <span className="text-sm" style={{ color: "var(--primary)" }}>{selectedIds.size} selected</span>
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
            <Trash2 className="size-3.5" />
            Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())} style={{ color: "var(--muted-foreground)" }}>
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-emerald-500" />
                </th>
                {["Novel", "Genre", "Chapters", "Views", "Status", "Updated", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "color-mix(in_srgb, var(--muted-foreground) 70%, transparent)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((novel) => (
                <tr
                  key={novel.id}
                  className="transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_2%,transparent)]"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: selectedIds.has(novel.id) ? "rgba(16,185,129,0.04)" : undefined,
                  }}
                >
                  <td className="w-10 px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(novel.id)} onChange={() => toggleSelect(novel.id)} className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={novel.coverUrl} alt={novel.title} className="size-10 flex-shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="max-w-[160px] truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>{novel.title}</p>
                        <p className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>{novel.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{novel.genre}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--foreground)" }}>{novel.chapters}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--foreground)" }}>{novel.views}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: (STATUS_COLORS[novel.status] || "#6b7280") + "18", color: STATUS_COLORS[novel.status] || "#6b7280" }}>
                      {novel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{novel.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/${locale}/novels/${novel.id}`} className="flex size-7 items-center justify-center rounded-lg transition-all" style={{ color: "var(--muted-foreground)" }} title="View">
                        <Eye className="size-3.5" />
                      </Link>
                      <button onClick={() => { setEditNovel(novel); setShowModal(true); }} className="flex size-7 items-center justify-center rounded-lg transition-all" style={{ color: "var(--primary)", background: "rgba(16,185,129,0.08)" }} title="Edit">
                        <Edit2 className="size-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(novel.id)} className="flex size-7 items-center justify-center rounded-lg transition-all" style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }} title="Delete">
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
          <div className="flex flex-col items-center gap-3 py-16">
            <BookOpen className="size-10 opacity-20" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No novels match your filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showModal && <NovelModal novel={editNovel} onClose={() => setShowModal(false)} />}

      {/* Delete confirm */}
      {deleteId !== null && <DeleteConfirm onCancel={() => setDeleteId(null)} onConfirm={() => setDeleteId(null)} />}
    </div>
  );
}

function NovelModal({ novel, onClose }: { novel: Novel | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)" }}>
            {novel ? "Edit Novel" : "Add Novel"}
          </h3>
          <button onClick={onClose}><X className="size-5" style={{ color: "var(--muted-foreground)" }} /></button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          {[
            { label: "Title", defaultValue: novel?.title ?? "", placeholder: "Novel title" },
            { label: "Author", defaultValue: novel?.author ?? "", placeholder: "Author name" },
            { label: "Description", defaultValue: novel?.description ?? "", placeholder: "Description...", textarea: true },
          ].map(({ label, defaultValue, placeholder, textarea }) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</label>
              {textarea ? (
                <textarea defaultValue={defaultValue} placeholder={placeholder} rows={3} className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              ) : (
                <input defaultValue={defaultValue} placeholder={placeholder} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Genre</label>
              <select defaultValue={novel?.genre ?? ""} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                <option value="">Select genre</option>
                {GENRES.filter((g) => g !== "All").map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Status</label>
              <select defaultValue={novel?.status ?? "ongoing"} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>Cancel</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
            <Check className="size-4" />
            {novel ? "Save Changes" : "Add Novel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="mb-2 font-serif text-lg font-bold" style={{ color: "var(--foreground)" }}>Delete novel?</h3>
        <p className="mb-5 text-sm" style={{ color: "var(--muted-foreground)" }}>This will permanently delete the novel and all its chapters. This cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-xl border py-2.5 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl py-2.5 text-sm text-white" style={{ background: "#ef4444" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
