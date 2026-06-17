"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, ChevronDown, X, Check, BookMarked } from "lucide-react";
import { ALL_NOVELS, MOCK_CHAPTERS, type Chapter } from "@/lib/admin/mock-data";

export function AdminChapters({ locale }: { locale: string }) {
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
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--foreground)" }}>
            Chapter Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {MOCK_CHAPTERS.length} chapters across {ALL_NOVELS.length} novels
          </p>
        </div>
        <button
          onClick={() => { setEditChapter(null); setShowModal(true); }}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
        >
          <Plus className="size-4" />
          Add Chapter
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div className="relative">
          <select
            value={selectedNovelId}
            onChange={(e) => setSelectedNovelId(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="appearance-none rounded-xl border py-2.5 pl-3 pr-8 text-sm outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="all">All Novels</option>
            {ALL_NOVELS.slice(0, 10).map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Chapter", "Novel", "Words", "Status", "Published", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "color-mix(in_srgb, var(--muted-foreground) 70%, transparent)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((chapter) => (
                <tr key={chapter.id} className="transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_2%,transparent)]" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{chapter.title}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="max-w-[160px] truncate text-xs" style={{ color: "var(--muted-foreground)" }}>{getNovelTitle(chapter.novelId)}</p>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--foreground)" }}>{chapter.wordCount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs"
                      style={{
                        background: chapter.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)",
                        color: chapter.status === "published" ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {chapter.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{chapter.publishedAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/${locale}/read/${chapter.novelId}/${chapter.number}`} className="flex size-7 items-center justify-center rounded-lg" style={{ color: "var(--muted-foreground)" }}>
                        <Eye className="size-3.5" />
                      </Link>
                      <button onClick={() => { setEditChapter(chapter); setShowModal(true); }} className="flex size-7 items-center justify-center rounded-lg" style={{ color: "var(--primary)", background: "rgba(16,185,129,0.08)" }}>
                        <Edit2 className="size-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(chapter.id)} className="flex size-7 items-center justify-center rounded-lg" style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}>
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
            <BookMarked className="size-10 opacity-20" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No chapters found</p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showModal && <ChapterModal chapter={editChapter} onClose={() => setShowModal(false)} />}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="mb-2 font-serif text-lg font-bold" style={{ color: "var(--foreground)" }}>Delete chapter?</h3>
            <p className="mb-5 text-sm" style={{ color: "var(--muted-foreground)" }}>This will permanently remove this chapter.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border py-2.5 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>Cancel</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl py-2.5 text-sm text-white" style={{ background: "#ef4444" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChapterModal({ chapter, onClose }: { chapter: Chapter | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)" }}>
            {chapter ? "Edit Chapter" : "Add Chapter"}
          </h3>
          <button onClick={onClose}><X className="size-5" style={{ color: "var(--muted-foreground)" }} /></button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Novel</label>
              <select defaultValue={chapter?.novelId ?? ""} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                <option value="">Select novel</option>
                {ALL_NOVELS.slice(0, 10).map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Chapter Number</label>
              <input type="number" defaultValue={chapter?.number ?? ""} placeholder="e.g. 543" className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Chapter Title</label>
            <input defaultValue={chapter?.title ?? ""} placeholder="Chapter title" className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Content</label>
            <textarea rows={8} placeholder="Chapter content..." className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ fontFamily: "'Georgia', serif", background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)", lineHeight: 1.8 }} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Status</label>
            <select defaultValue={chapter?.status ?? "draft"} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>Cancel</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
            <Check className="size-4" />
            {chapter ? "Save Changes" : "Publish Chapter"}
          </button>
        </div>
      </div>
    </div>
  );
}
