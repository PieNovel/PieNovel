"use client";

import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactElement, ReactNode } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { catalogNovels } from "@/lib/site/mock-novels";
import { useAuth } from "@/lib/site/auth-context";

type ReaderPageProps = {
  locale: string;
  slug: string;
  chapterNumber: string;
};

export function ReaderPage({ locale, slug, chapterNumber }: ReaderPageProps): ReactElement {
  const novel = catalogNovels.find((n) => n.slug === slug);
  const chapter = parseInt(chapterNumber, 10);
  const { isLoggedIn, readingSettings, updateReadingSettings } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  if (!novel) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-4">
        <BookOpen className="size-16 opacity-20" style={{ color: "var(--muted-foreground)" }} />
        <p className="font-serif text-xl font-bold" style={{ color: "var(--foreground)" }}>Novel not found</p>
        <Link href={`/${locale}/browse`} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
          Browse Novels
        </Link>
      </div>
    );
  }

  const content = generateMockContent(novel.title, chapter);

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
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Ch. {chapter}</span>
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
          Ch. {chapter}: Chapter {chapter}
        </h1>
        <p className="mb-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>{novel.title}</p>

        <div className={`${fontClass} space-y-4`} style={{ fontSize: `${readingSettings.fontSize}px`, lineHeight: readingSettings.lineHeight, color: "var(--foreground)" }}>
          {content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <AdSlot className="my-12" />

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
          {chapter > 1 ? (
            <Link href={`/${locale}/read/${slug}/${chapter - 1}`} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors" style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              <ArrowLeft className="size-4" />
              Previous
            </Link>
          ) : <div />}
          {chapter < novel.chapters ? (
            <Link href={`/${locale}/read/${slug}/${chapter + 1}`} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
              Next Chapter
              <ArrowRight className="size-4" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

function generateMockContent(title: string, chapter: number): string[] {
  return [
    `The wind howled through the ancient corridors of the forgotten temple, carrying with it whispers of a power long thought lost to the ages. Chapter ${chapter} of ${title} opens with our protagonist standing at the threshold of destiny, unaware that the choices made in this moment would echo through eternity.`,
    `The air crackled with barely contained energy as they stepped forward. Each footfall on the weathered stone floor sent tremors through the walls, as if the very structure of reality was responding to their presence. The glyphs etched into the pillars began to glow — first faintly, then with increasing intensity, painting the darkness in shades of emerald and gold.`,
    `"You shouldn't be here," a voice echoed from somewhere beyond the veil of shadow. It wasn't a threat, but rather a warning — one born of ancient wisdom and the burden of countless cycles of destruction and rebirth. The speaker emerged from the darkness, their form shifting between corporeal and ethereal, like smoke caught between two worlds.`,
    `Our hero steadied themselves, drawing upon reserves of strength they didn't know they possessed. The journey to this point had been long — filled with betrayal, loss, and the gradual awakening of abilities that defied the natural order. But here, in this sacred space between worlds, all paths converged.`,
    `The battle that followed was unlike anything the realm had witnessed in millennia. Powers that had slumbered since the founding of the first dynasty erupted forth in a cataclysm of light and shadow. The very fabric of space distorted as opposing forces collided, each seeking to reshape reality according to their vision.`,
    `When the dust settled and the echoes faded, the world had changed. Not in the dramatic fashion of cataclysmic destruction, but in the subtle way that follows true transformation — a shifting of foundations, a realignment of destiny's threads. And at the center of it all stood a figure forever altered by the truth they had uncovered.`,
  ];
}
