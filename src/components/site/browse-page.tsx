"use client";

import { ChevronDown, Grid3X3, List, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { NovelCard } from "@/components/site/novel-card";
import { GENRES, catalogNovels } from "@/lib/site/mock-novels";
import type { SiteNovel } from "@/lib/site/mock-novels";

const GENRE_LIST = GENRES.filter((g) => g !== "All");

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "HIATUS", label: "Hiatus" },
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
  { value: "popular", label: "Popular" },
  { value: "added", label: "Added" },
];

type BrowsePageProps = {
  locale: string;
  initialGenre?: string;
};

function StatusBadge({ status }: { status: string }): ReactElement {
  const colors: Record<string, { bg: string; text: string }> = {
    ONGOING: { bg: "color-mix(in_srgb, var(--primary) 15%, transparent)", text: "var(--primary)" },
    COMPLETED: { bg: "color-mix(in_srgb, #6366f1 15%, transparent)", text: "#818cf8" },
    HIATUS: { bg: "color-mix(in_srgb, #facc15 15%, transparent)", text: "#facc15" },
  };
  const c = colors[status] || colors.ONGOING;
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[0.65rem] capitalize tracking-wide"
      style={{ background: c.bg, color: c.text }}
    >
      {status.toLowerCase()}
    </span>
  );
}

type GenreInputProps = {
  label: string;
  selected: string[];
  onAdd: (g: string) => void;
  onRemove: (g: string) => void;
  accentColor?: string;
};

function GenreInput({ label, selected, onAdd, onRemove, accentColor = "var(--primary)" }: GenreInputProps): ReactElement {
  const [inputVal, setInputVal] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestions = GENRE_LIST.filter(
    (g) => !selected.includes(g) && g.toLowerCase().includes(inputVal.toLowerCase()),
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
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-[0.75rem] text-[var(--muted-foreground)]">{label}</label>
      <div
        ref={containerRef}
        className="relative flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border px-3 py-2"
        style={{ background: "var(--card)", borderColor: "var(--border)", cursor: "text" }}
        onClick={() => (containerRef.current?.querySelector("input") as HTMLInputElement)?.focus()}
      >
        {selected.map((g) => (
          <span
            key={g}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.72rem]"
            style={{ background: `color-mix(in_srgb, ${accentColor} 13%, transparent)`, color: accentColor }}
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
          className="min-w-[80px] flex-1 bg-transparent text-[0.82rem] text-[var(--foreground)] outline-none"
        />
        {open && suggestions.length > 0 && (
          <div
            className="absolute left-0 top-full z-20 mt-1 max-h-[200px] w-full overflow-hidden overflow-y-auto rounded-xl border"
            style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
          >
            {suggestions.map((g) => (
              <button
                key={g}
                className="w-full px-4 py-2 text-left text-[0.82rem] text-[var(--foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]"
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
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}): ReactElement {
  const selected = options.find((o) => o.value === value);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-[0.82rem] text-[var(--foreground)] transition-all"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {selected?.label}
        <ChevronDown className="size-3.5 text-[var(--muted-foreground)]" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              className="w-full px-4 py-2 text-left text-[0.82rem] text-[var(--foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]"
              style={{ color: o.value === value ? "var(--primary)" : "var(--foreground)" }}
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

function viewsToNum(v: string): number {
  return Number.parseFloat(v.replace("M", "")) * (v.includes("M") ? 1_000_000 : 1_000);
}

export function BrowsePage({ locale, initialGenre = "" }: BrowsePageProps): ReactElement {
  const [includeGenres, setIncludeGenres] = useState<string[]>(initialGenre ? [initialGenre] : []);
  const [excludeGenres, setExcludeGenres] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [activeOrder, setActiveOrder] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const filtered = catalogNovels
    .filter((n: SiteNovel) => {
      const matchQuery = query === "" || n.title.toLowerCase().includes(query.toLowerCase()) || n.author.toLowerCase().includes(query.toLowerCase());
      const matchInclude = includeGenres.length === 0 || includeGenres.some((g) => n.genre === g || n.tags.includes(g));
      const matchExclude = excludeGenres.length === 0 || !excludeGenres.some((g) => n.genre === g || n.tags.includes(g));
      const matchStatus = activeStatus === "all" || n.status === activeStatus;
      const matchType = activeType === "all" || n.type === activeType;
      return matchQuery && matchInclude && matchExclude && matchStatus && matchType;
    })
    .sort((a: SiteNovel, b: SiteNovel) => {
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
    setActiveOrder("popular");
    setQuery("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight text-[var(--foreground)]">
          Browse
        </h1>
        <p className="text-[0.85rem] text-[var(--muted-foreground)]">{catalogNovels.length} novels &middot; filter by genre, status or type</p>
      </div>

      <AdSlot className="mb-6" />

      <div
        className="mb-6 space-y-4 rounded-2xl border p-4 sm:p-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5"
          style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "var(--border)" }}
        >
          <Search className="size-4 shrink-0 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author..."
            className="w-full bg-transparent text-[0.88rem] text-[var(--foreground)] outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="size-4 text-[var(--muted-foreground)]" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <GenreInput
            label="Genres"
            selected={includeGenres}
            onAdd={(g) => setIncludeGenres((p) => [...p, g])}
            onRemove={(g) => setIncludeGenres((p) => p.filter((x) => x !== g))}
          />
          <GenreInput
            label="Exclude genres"
            selected={excludeGenres}
            onAdd={(g) => setExcludeGenres((p) => [...p, g])}
            onRemove={(g) => setExcludeGenres((p) => p.filter((x) => x !== g))}
            accentColor="#ef4444"
          />
        </div>

        <button
          onClick={() => setMoreOpen((p) => !p)}
          className="flex items-center gap-1.5 text-[0.8rem] text-[var(--primary)] transition-opacity hover:opacity-80"
        >
          More options
          <ChevronDown className="size-3.5 transition-transform" style={{ transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </button>

        {moreOpen && (
          <div className="flex flex-wrap gap-3 pt-1">
            <div>
              <label className="mb-1.5 block text-[0.75rem] text-[var(--muted-foreground)]">Status</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setActiveStatus(s.value)}
                    className="rounded-lg border px-3 py-1.5 text-[0.78rem] transition-all"
                    style={{
                      background: activeStatus === s.value ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent",
                      borderColor: activeStatus === s.value ? "var(--primary)" : "var(--border)",
                      color: activeStatus === s.value ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[0.75rem] text-[var(--muted-foreground)]">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setActiveType(t.value)}
                    className="rounded-lg border px-3 py-1.5 text-[0.78rem] transition-all"
                    style={{
                      background: activeType === t.value ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent",
                      borderColor: activeType === t.value ? "var(--primary)" : "var(--border)",
                      color: activeType === t.value ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={resetFilters}
            className="rounded-xl border px-5 py-2 text-[0.82rem] text-[var(--muted-foreground)] transition-opacity hover:opacity-70"
            style={{ borderColor: "var(--border)" }}
          >
            RESET
          </button>
        </div>
      </div>

      <AdSlot className="mb-6" />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[0.8rem] text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span> novels found
          </p>
          <div className="flex flex-wrap gap-1.5">
            {includeGenres.map((g) => (
              <span
                key={g}
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.68rem]"
                style={{ background: "color-mix(in_srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
              >
                {g}
                <button onClick={() => setIncludeGenres((p) => p.filter((x) => x !== g))}><X className="size-2.5" /></button>
              </span>
            ))}
            {activeStatus !== "all" && (
              <span
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.68rem]"
                style={{ background: "color-mix(in_srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
              >
                {STATUS_OPTIONS.find((s) => s.value === activeStatus)?.label}
                <button onClick={() => setActiveStatus("all")}><X className="size-2.5" /></button>
              </span>
            )}
            {activeType !== "all" && (
              <span
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.68rem]"
                style={{ background: "color-mix(in_srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
              >
                {TYPE_OPTIONS.find((t) => t.value === activeType)?.label}
                <button onClick={() => setActiveType("all")}><X className="size-2.5" /></button>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FilterSelect options={ORDER_OPTIONS} value={activeOrder} onChange={setActiveOrder} />
          <div
            className="flex items-center gap-0.5 rounded-xl border p-1"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <button
              onClick={() => setView("grid")}
              className="rounded-lg p-1.5 transition-all"
              style={{ background: view === "grid" ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent", color: view === "grid" ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              <Grid3X3 className="size-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className="rounded-lg p-1.5 transition-all"
              style={{ background: view === "list" ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent", color: view === "list" ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((n) => (
            <div key={n.id} className="relative">
              <NovelCard compact locale={locale} novel={n} />
              <div className="absolute right-2 top-2">
                <StatusBadge status={n.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((n) => (
            <div key={n.id}>
              <NovelCard locale={locale} novel={n} />
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && <AdSlot className="mt-8" />}

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <h2 className="font-serif text-[1.4rem] font-bold text-[var(--muted-foreground)]">No novels found</h2>
          <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">Try adjusting your filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl px-5 py-2 text-[0.82rem] text-[var(--primary)]"
            style={{ background: "color-mix(in_srgb, var(--primary) 12%, transparent)" }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}
