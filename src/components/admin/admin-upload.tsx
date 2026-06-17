"use client";

import { useState, useCallback } from "react";
import { Upload, Image, X, Check, ChevronDown, FileDown, FileUp } from "lucide-react";
import { ALL_NOVELS } from "@/lib/admin/mock-data";

export function AdminUpload() {
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; preview: string } | null>(null);
  const [selectedNovelId, setSelectedNovelId] = useState<number | "">("");
  const [uploadDone, setUploadDone] = useState(false);
  const [importTab, setImportTab] = useState<"cover" | "import" | "export">("cover");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile({ name: file.name, preview: URL.createObjectURL(file) });
      setUploadDone(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({ name: file.name, preview: URL.createObjectURL(file) });
      setUploadDone(false);
    }
  }, []);

  const TABS = [
    { id: "cover" as const, label: "Upload Cover", icon: Image },
    { id: "import" as const, label: "Import Novels", icon: FileUp },
    { id: "export" as const, label: "Export Data", icon: FileDown },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--foreground)" }}>
          Upload & Import
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Manage covers, import and export novel data.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1.5 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setImportTab(id)}
            className="relative flex items-center gap-2 px-4 py-2.5 text-sm transition-all"
            style={{ fontWeight: importTab === id ? 600 : 400, color: importTab === id ? "var(--primary)" : "var(--muted-foreground)" }}
          >
            <Icon className="size-4" />
            {label}
            {importTab === id && <span className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--primary)" }} />}
          </button>
        ))}
      </div>

      {/* Cover Upload */}
      {importTab === "cover" && (
        <div className="max-w-xl">
          <div className="mb-6 rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-4 font-serif text-lg font-bold" style={{ color: "var(--foreground)" }}>Select Novel</h2>
            <div className="relative">
              <select
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value ? Number(e.target.value) : "")}
                className="w-full appearance-none rounded-xl border px-3 py-2.5 pr-8 text-sm outline-none"
                style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="">Choose a novel...</option>
                {ALL_NOVELS.map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-4 font-serif text-lg font-bold" style={{ color: "var(--foreground)" }}>Cover Image</h2>

            {!uploadedFile ? (
              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-12 transition-all"
                style={{
                  borderColor: dragging ? "var(--primary)" : "color-mix(in_srgb, var(--foreground) 15%, transparent)",
                  background: dragging ? "rgba(16,185,129,0.04)" : "transparent",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                <div
                  className="flex size-16 items-center justify-center rounded-2xl"
                  style={{ background: dragging ? "rgba(16,185,129,0.12)" : "color-mix(in_srgb, var(--foreground) 5%, transparent)" }}
                >
                  <Upload className="size-7" style={{ color: dragging ? "var(--primary)" : "var(--muted-foreground)" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Drop image here or click to browse</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>PNG, JPG, WEBP — recommended 300&times;450px (2:3 ratio)</p>
                </div>
              </label>
            ) : (
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <img src={uploadedFile.preview} alt="Preview" className="aspect-[2/3] w-28 rounded-xl object-cover" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }} />
                  <button
                    onClick={() => { setUploadedFile(null); setUploadDone(false); }}
                    className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full"
                    style={{ background: "#ef4444" }}
                  >
                    <X className="size-3.5 text-white" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>{uploadedFile.name}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>Ready to upload</p>
                  {uploadDone && (
                    <div className="mt-3 flex items-center gap-1.5" style={{ color: "var(--primary)" }}>
                      <Check className="size-4" />
                      <span className="text-sm">Cover updated successfully</span>
                    </div>
                  )}
                  {!uploadDone && (
                    <button
                      onClick={() => setUploadDone(true)}
                      disabled={!selectedNovelId}
                      className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white transition-all"
                      style={{
                        background: selectedNovelId ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(16,185,129,0.3)",
                        cursor: selectedNovelId ? "pointer" : "not-allowed",
                      }}
                    >
                      <Upload className="size-4" />
                      Upload Cover
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import */}
      {importTab === "import" && (
        <div className="max-w-xl">
          <div className="mb-4 rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-2 font-serif text-lg font-bold" style={{ color: "var(--foreground)" }}>Import Novels</h2>
            <p className="mb-5 text-xs" style={{ color: "var(--muted-foreground)" }}>Upload a CSV or JSON file to bulk-import novels into the database.</p>
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10"
              style={{ borderColor: "color-mix(in_srgb, var(--foreground) 12%, transparent)" }}
            >
              <input type="file" accept=".csv,.json" className="hidden" />
              <FileUp className="size-8" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Drop CSV or JSON file here</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Max 10MB &middot; UTF-8 encoded</p>
            </label>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="mb-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>Required CSV columns:</p>
            <code
              className="block rounded-xl p-3 text-xs leading-relaxed"
              style={{ background: "color-mix(in_srgb, var(--foreground) 5%, transparent)", color: "var(--muted-foreground)" }}
            >
              title, author, genre, status, type, description, cover_url
            </code>
          </div>
        </div>
      )}

      {/* Export */}
      {importTab === "export" && (
        <div className="max-w-xl">
          <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="mb-2 font-serif text-lg font-bold" style={{ color: "var(--foreground)" }}>Export Data</h2>
            <p className="mb-6 text-xs" style={{ color: "var(--muted-foreground)" }}>Download a full snapshot of your novel database.</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Export Novels (CSV)", desc: `${ALL_NOVELS.length} novels`, format: "csv" },
                { label: "Export Novels (JSON)", desc: `${ALL_NOVELS.length} novels`, format: "json" },
                { label: "Export Users (CSV)", desc: "48,921 users", format: "csv" },
                { label: "Export Chapters (CSV)", desc: "Full chapter index", format: "csv" },
              ].map(({ label, desc, format }) => (
                <div key={label} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-all" style={{ background: "rgba(16,185,129,0.1)", color: "var(--primary)" }}>
                    <FileDown className="size-3.5" />
                    .{format}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
