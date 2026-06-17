import { useState, useCallback } from "react";
import { Upload, Image, X, Check, ChevronDown, FileDown, FileUp } from "lucide-react";
import { useTheme, THEME_STYLES } from "../../context/ThemeContext";
import { ALL_NOVELS } from "../../data/novels";

// DB mapping:
// Upload cover → UPDATE novels SET cover_url = ? WHERE id = ?
// Import novels → INSERT INTO novels (...) — bulk from CSV/JSON
// Export novels → SELECT * FROM novels — returns CSV/JSON

export function UploadCoverPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";

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
      const url = URL.createObjectURL(file);
      setUploadedFile({ name: file.name, preview: url });
      setUploadDone(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFile({ name: file.name, preview: url });
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
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: ts.text }}>Upload & Import</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>Manage covers, import and export novel data.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-8 border-b" style={{ borderColor }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setImportTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm transition-all relative"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: importTab === id ? 600 : 400,
              color: importTab === id ? "#10b981" : ts.subtext,
            }}
          >
            <Icon className="size-4" />
            {label}
            {importTab === id && (
              <span className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "#10b981" }} />
            )}
          </button>
        ))}
      </div>

      {/* Cover Upload */}
      {importTab === "cover" && (
        <div className="max-w-xl">
          <div className="rounded-2xl border p-6 mb-6" style={{ background: cardBg, borderColor }}>
            <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Select Novel</h2>
            <div className="relative">
              <select
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value ? Number(e.target.value) : "")}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border text-sm outline-none appearance-none"
                style={{ fontFamily: "'Inter', sans-serif", background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderColor, color: ts.text }}
              >
                <option value="">Choose a novel...</option>
                {ALL_NOVELS.map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" style={{ color: ts.subtext }} />
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor }}>
            <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Cover Image</h2>

            {/* Drop zone */}
            {!uploadedFile ? (
              <label
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-12"
                style={{
                  borderColor: dragging ? "#10b981" : isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.1)",
                  background: dragging ? "rgba(16,185,129,0.04)" : "transparent",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                <div className="size-16 rounded-2xl flex items-center justify-center" style={{ background: dragging ? "rgba(16,185,129,0.12)" : isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }}>
                  <Upload className="size-7" style={{ color: dragging ? "#10b981" : ts.subtext }} />
                </div>
                <div className="text-center">
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.88rem", color: ts.text }}>Drop image here or click to browse</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.subtext, marginTop: "4px" }}>PNG, JPG, WEBP — recommended 300×450px (2:3 ratio)</p>
                </div>
              </label>
            ) : (
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <img src={uploadedFile.preview} alt="Preview" className="w-28 aspect-[2/3] rounded-xl object-cover" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }} />
                  <button
                    onClick={() => { setUploadedFile(null); setUploadDone(false); }}
                    className="absolute -top-2 -right-2 size-6 rounded-full flex items-center justify-center"
                    style={{ background: "#ef4444" }}
                  >
                    <X className="size-3.5 text-white" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: ts.text }} className="truncate">{uploadedFile.name}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.subtext, marginTop: "4px" }}>Ready to upload</p>
                  {uploadDone && (
                    <div className="flex items-center gap-1.5 mt-3" style={{ color: "#10b981" }}>
                      <Check className="size-4" />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>Cover updated successfully</span>
                    </div>
                  )}
                  {!uploadDone && (
                    <button
                      onClick={() => setUploadDone(true)}
                      disabled={!selectedNovelId}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white transition-all"
                      style={{ background: selectedNovelId ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(16,185,129,0.3)", fontFamily: "'Inter', sans-serif", cursor: selectedNovelId ? "pointer" : "not-allowed" }}
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
          <div className="rounded-2xl border p-6 mb-4" style={{ background: cardBg, borderColor }}>
            <h2 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Import Novels</h2>
            <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>Upload a CSV or JSON file to bulk-import novels into the database.</p>
            <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer py-10" style={{ borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)" }}>
              <input type="file" accept=".csv,.json" className="hidden" />
              <FileUp className="size-8" style={{ color: ts.subtext }} />
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: ts.text }}>Drop CSV or JSON file here</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext }}>Max 10MB · UTF-8 encoded</p>
            </label>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor }}>
            <p className="mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: ts.text }}>Required CSV columns:</p>
            <code className="block text-xs p-3 rounded-xl" style={{ fontFamily: "monospace", background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)", color: ts.subtext, lineHeight: 1.8 }}>
              title, author, genre, status, type, description, cover_url
            </code>
          </div>
        </div>
      )}

      {/* Export */}
      {importTab === "export" && (
        <div className="max-w-xl">
          <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor }}>
            <h2 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Export Data</h2>
            <p className="mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>Download a full snapshot of your novel database.</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Export Novels (CSV)", desc: `${ALL_NOVELS.length} novels`, format: "csv" },
                { label: "Export Novels (JSON)", desc: `${ALL_NOVELS.length} novels`, format: "json" },
                { label: "Export Users (CSV)", desc: "48,921 users", format: "csv" },
                { label: "Export Chapters (CSV)", desc: "Full chapter index", format: "csv" },
              ].map(({ label, desc, format }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ borderColor }}
                >
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: ts.text }}>{label}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext, marginTop: "2px" }}>{desc}</p>
                  </div>
                  <button
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
                    style={{ fontFamily: "'Inter', sans-serif", background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                  >
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
