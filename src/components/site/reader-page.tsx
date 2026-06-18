"use client";

import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { useAuth } from "@/lib/site/auth-context";

type ReaderPageProps = {
  locale: string;
  slug: string;
  chapterNumber: string;
};

type ChapterData = {
  novel: { title: string; slug: string };
  chapter: { id: string; number: number; title: string; content: string; wordCount: number };
  prevChapter: number | null;
  nextChapter: number | null;
  totalChapters: number;
};

export function ReaderPage({ locale, slug, chapterNumber }: ReaderPageProps): ReactElement {
  const { isLoggedIn, readingSettings, updateReadingSettings } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/novels/${slug}/chapters/${chapterNumber}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d: unknown) => Promise.reject(new Error((d as { error?: string }).error || "Not found")));
        return res.json();
      })
      .then((d: unknown) => {
        setData(d as ChapterData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug, chapterNumber]);

  const fontClass =
    readingSettings.fontFamily === "georgia"
      ? "font-serif"
      : readingSettings.fontFamily === "merriweather"
        ? "font-serif"
        : "";

  const widthClass =
    readingSettings.width === "narrow"
      ? "max-w-xl"
      : readingSettings.width === "wide"
        ? "max-w-4xl"
        : "max-w-2xl";

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <span className="inline-block size-6 animate-spin rounded-full border-2 border-[var(--muted-foreground)] border-t-[var(--primary)]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-4">
        <BookOpen className="size-16 opacity-20" style={{ color: "var(--muted-foreground)" }} />
        <p className="font-serif text-xl font-bold" style={{ color: "var(--foreground)" }}>
          {error === "Chapter not found" ? "Chapter not found" : "Novel not found"}
        </p>
        <Link href={`/${locale}/browse`} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
          Browse Novels
        </Link>
      </div>
    );
  }

  const { novel, chapter } = data;
  const content = chapter.content.split("\n").filter((p) => p.trim());

  return (
    <div className="min-h-[calc(100vh-56px)]" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 border-b backdrop-blur-2xl"
        style={{ background: "color-mix(in_srgb, var(--background) 88%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href={`/${locale}/novels/${slug}`} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">{novel.title}</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Ch. {chapter.number}</span>
            <button onClick={() => setShowSettings(!showSettings)} className="rounded-lg p-2 transition-colors" style={{ color: showSettings ? "var(--primary)" : "var(--muted-foreground)" }}>
              <Settings className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && isLoggedIn && (
        <div className="border-b px-4 py-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Reading Settings</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs" style={{ color: "var(--muted-foreground)" }}>Size:</label>
                <input type="range" min={13} max={24} value={readingSettings.fontSize} onChange={(e) => updateReadingSettings({ fontSize: Number(e.target.value) })} className="w-24 accent-[var(--primary)]" />
                <span className="text-xs" style={{ color: "var(--foreground)" }}>{readingSettings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs" style={{ color: "var(--muted-foreground)" }}>Font:</label>
                <select value={readingSettings.fontFamily} onChange={(e) => updateReadingSettings({ fontFamily: e.target.value as "inter" | "georgia" | "merriweather" })} className="rounded-lg border px-2 py-1 text-xs outline-none" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option value="inter">Inter</option>
                  <option value="georgia">Georgia</option>
                  <option value="merriweather">Merriweather</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs" style={{ color: "var(--muted-foreground)" }}>Width:</label>
                <div className="flex overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
                  {(["narrow", "medium", "wide"] as const).map((w) => (
                    <button key={w} onClick={() => updateReadingSettings({ width: w })} className="px-2 py-1 text-xs capitalize transition-all" style={{ background: readingSettings.width === w ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent", color: readingSettings.width === w ? "var(--primary)" : "var(--muted-foreground)" }}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`mx-auto px-4 py-12 ${widthClass}`}>
        <h1 className="mb-2 text-center font-serif text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>
          {chapter.title}
        </h1>
        <p className="mb-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>{novel.title}</p>

        <div className={`${fontClass} space-y-4`} style={{ fontSize: `${readingSettings.fontSize}px`, lineHeight: readingSettings.lineHeight, color: "var(--foreground)" }}>
          {content.map((para, i) => (
            <p key={i} className="leading-relaxed">{para}</p>
          ))}
        </div>

        <AdSlot className="my-12" />

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
          {data.prevChapter ? (
            <Link href={`/${locale}/read/${slug}/${data.prevChapter}`} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors" style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              <ArrowLeft className="size-4" />
              Previous
            </Link>
          ) : <div />}
          {data.nextChapter ? (
            <Link href={`/${locale}/read/${slug}/${data.nextChapter}`} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
              Next Chapter
              <ArrowRight className="size-4" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
