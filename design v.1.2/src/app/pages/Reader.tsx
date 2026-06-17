import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { List, Settings, ChevronRight, ChevronLeft, Globe, Clock, AlignLeft, Minus, Plus, Bookmark, BookmarkCheck } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS } from "../data/novels";
import { CommentsBlock } from "../components/comments-block";
import { NativeBanner } from "../components/native-banner";

const SAMPLE_PARAGRAPHS = [
  "The dungeon was silent except for the distant dripping of water somewhere deep within the stone corridors. Flickering torchlight cast long shadows across the cracked walls, and the air smelled of damp earth and something older—something that had no name in any human tongue.",
  "He had come here with fifteen others. Now he stood alone. His mana was nearly depleted, his HP bar hovering at a sliver he dared not look at too long. Every movement sent a cascade of pain through his ribs. Two were definitely cracked. Maybe three.",
  "The system prompt appeared before him, floating in the air with the sterile calmness that always made his stomach drop: [You are about to die. Would you like to accept a hidden quest?]",
  "He blinked. In twenty years of being a hunter, he had never seen that message before. No one had. The lore said such prompts were myths—stories told by E-rank hunters around tavern fires to explain why some weak hunters occasionally returned from impossible dungeons alive.",
  "His hand trembled as he reached toward the translucent YES button.",
  "The dungeon shook. Somewhere above him, something ancient and enormous drew its first breath in ten thousand years. The torches went out all at once. And in the perfect darkness, a single line of pale blue text illuminated his face.",
  "[Quest Accepted. The path of the Shadow Monarch begins now.]",
  "He didn't know then what it would cost him. He didn't know the people he would have to leave behind, the versions of himself he would have to bury, the weight of an army of shadows that would look to him not as a commander—but as their king.",
  "He only knew one thing as the light consumed him entirely: he refused to die in a dungeon no one would remember.",
  "The system had chosen him not because he was the strongest. It had chosen him because even at rock bottom, even broken and bleeding in the dark, he kept moving forward.",
  "The light faded. He opened his eyes. And for the first time in his life, the status window showed numbers that made sense.",
  "He was no longer the weakest hunter in the world. He was something else entirely.",
];

function generateChapterContent(chapterId: number): string[] {
  const rotation = (chapterId - 1) % 4;
  return [...SAMPLE_PARAGRAPHS.slice(rotation * 3), ...SAMPLE_PARAGRAPHS.slice(0, rotation * 3)];
}

type ReaderTheme = "dark" | "sepia" | "light";
interface FontFamilyOption { label: string; value: string; }

const READER_THEMES: Record<ReaderTheme, { bg: string; text: string; surface: string; surfaceHover: string; muted: string; accent: string }> = {
  dark:  { bg: "#0f1117", text: "#cfd3dc", surface: "#161b24", surfaceHover: "#1e2533", muted: "#6b7280", accent: "#10b981" },
  sepia: { bg: "#f4ead8", text: "#3a2a1a", surface: "#ede0c8", surfaceHover: "#e4d4b4", muted: "#7d6145", accent: "#6d9b3a" },
  light: { bg: "#fafafa", text: "#1a1a2e", surface: "#f0f0f5", surfaceHover: "#e4e4ec", muted: "#6b7280", accent: "#10b981" },
};

const LINE_SPACINGS = [
  { label: "Compact", value: 1.6 },
  { label: "Normal",  value: 1.9 },
  { label: "Relaxed", value: 2.2 },
  { label: "Loose",   value: 2.6 },
];

const CONTENT_WIDTHS = [
  { label: "Narrow", value: "560px" },
  { label: "Medium", value: "680px" },
  { label: "Wide",   value: "820px" },
];

const FONT_FAMILIES: FontFamilyOption[] = [
  { label: "Georgia",      value: "'Georgia', serif" },
  { label: "Palatino",     value: "'Palatino Linotype', Palatino, serif" },
  { label: "Merriweather", value: "'Merriweather', Georgia, serif" },
  { label: "Inter",        value: "'Inter', sans-serif" },
  { label: "Verdana",      value: "'Verdana', Geneva, sans-serif" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "zh", label: "Chinese" },
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "pt", label: "Portuguese" },
];

function estimateReadingTime(paragraphs: string[]): number {
  return Math.ceil(paragraphs.join(" ").split(/\s+/).length / 220);
}

export function ReaderPage() {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("dark");
  const [fontSize, setFontSize]       = useState(17);
  const [fontFamily, setFontFamily]   = useState("'Georgia', serif");
  const [lineSpacing, setLineSpacing] = useState(1.9);
  const [contentWidth, setContentWidth] = useState("680px");
  const [language, setLanguage]       = useState("en");
  const [showSettings, setShowSettings]       = useState(false);
  const [showLangMenu, setShowLangMenu]       = useState(false);
  const [bookmarked, setBookmarked]   = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const novel = ALL_NOVELS.find((n) => n.id === Number(novelId));
  const currentChapter = Number(chapterId);
  const rt = READER_THEMES[readerTheme];
  const borderColor = readerTheme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)";

  const closeAll = useCallback(() => {
    setShowSettings(false);
    setShowLangMenu(false);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(dh > 0 ? Math.min((y / dh) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setReadProgress(0);
  }, [chapterId]);

  if (!novel) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME_STYLES[theme].bg }}>
        <div className="text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: THEME_STYLES[theme].text }}>Novel not found</p>
          <Link to="/" className="mt-4 text-emerald-500 text-sm block">← Back to home</Link>
        </div>
      </div>
    );
  }

  const paragraphs = generateChapterContent(currentChapter);
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < novel.chapters;
  const currentLang = LANGUAGES.find((l) => l.code === language)!;
  const readMinutes = estimateReadingTime(paragraphs);
  const wordCount = paragraphs.join(" ").split(/\s+/).length;

  const accentColor = rt.accent;

  const pillBtn = (active: boolean) => ({
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "999px",
    border: `1px solid ${active ? accentColor : borderColor}`,
    background: active ? `${accentColor}22` : rt.surfaceHover,
    color: active ? accentColor : rt.text,
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600 as const,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    cursor: "pointer" as const,
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  });

  return (
    <div className="min-h-screen" style={{ background: rt.bg, transition: "background 0.35s ease" }}>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 z-50 h-[3px] transition-all duration-150"
        style={{ width: `${readProgress}%`, background: `linear-gradient(90deg, ${accentColor}, #34d399)`, boxShadow: `0 0 8px ${accentColor}80` }}
      />


      {/* ── Reader content ── */}
      <div
        className="mx-auto px-4 py-6 sm:py-10 transition-all duration-300"
        style={{ maxWidth: contentWidth }}
        onClick={closeAll}
      >
        {/* ── Controls: row 1 options/bookmark/language, row 2 prev/toc/next ── */}
        <div className="mb-6" style={{ borderBottom: `1px solid ${borderColor}` }}>

          {/* Row 1: Options · Bookmark · Language */}
          <div className="flex items-center justify-between py-2 border-b" style={{ borderColor }}>

            {/* Options */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowLangMenu(false); }}
                className="flex items-center gap-1.5 transition-all"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: showSettings ? accentColor : rt.muted, background: "transparent", border: "none", cursor: "pointer" }}
              >
                <Settings className="size-3.5" />
                Options
              </button>
              {showSettings && (
                <div className="absolute left-0 top-full mt-2 rounded-xl border shadow-2xl z-50 w-72 max-w-[calc(100vw-2rem)]" style={{ background: rt.surface, borderColor }} onClick={(e) => e.stopPropagation()}>
                  <div className="p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold opacity-40 tracking-widest uppercase" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>Display</p>
                    <div>
                      <p className="mb-2 text-xs opacity-50" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>Background</p>
                      <div className="flex gap-2">
                        {(["dark", "sepia", "light"] as ReaderTheme[]).map((t) => (
                          <button key={t} onClick={() => setReaderTheme(t)} className="w-8 h-8 rounded-full transition-all flex items-center justify-center text-sm" style={{ background: READER_THEMES[t].bg, border: readerTheme === t ? `2.5px solid ${accentColor}` : `2px solid ${t === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.12)"}`, boxShadow: readerTheme === t ? `0 0 0 3px ${accentColor}40` : "none", color: READER_THEMES[t].text, fontFamily: "'Georgia', serif" }} title={t}>A</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs opacity-50" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>Font Size</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setFontSize((s) => Math.max(10, s - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all" style={{ background: "transparent", borderColor, color: rt.text }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = rt.surfaceHover; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}><Minus className="size-3" /></button>
                        <input type="number" min={10} max={40} value={fontSize} onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n) && n >= 10 && n <= 40) setFontSize(n); }} className="w-16 text-center rounded-lg border outline-none text-sm py-1.5" style={{ background: rt.bg, borderColor, color: rt.text, fontFamily: "'Inter', sans-serif" }} />
                        <button onClick={() => setFontSize((s) => Math.min(40, s + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all" style={{ background: "transparent", borderColor, color: rt.text }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = rt.surfaceHover; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}><Plus className="size-3" /></button>
                        <span className="text-xs opacity-40" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>px</span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs opacity-50" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>Line Spacing</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {LINE_SPACINGS.map((ls) => (
                          <button key={ls.value} onClick={() => setLineSpacing(ls.value)} className="px-2.5 py-1.5 rounded-lg border transition-all text-xs" style={{ fontFamily: "'Inter', sans-serif", background: lineSpacing === ls.value ? `${accentColor}22` : "transparent", borderColor: lineSpacing === ls.value ? accentColor : borderColor, color: lineSpacing === ls.value ? accentColor : rt.text, fontWeight: lineSpacing === ls.value ? 600 : 400 }}>{ls.label}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs opacity-50" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>Width</p>
                      <div className="flex gap-1.5">
                        {CONTENT_WIDTHS.map((cw) => (
                          <button key={cw.value} onClick={() => setContentWidth(cw.value)} className="px-2.5 py-1.5 rounded-lg border transition-all text-xs" style={{ fontFamily: "'Inter', sans-serif", background: contentWidth === cw.value ? `${accentColor}22` : "transparent", borderColor: contentWidth === cw.value ? accentColor : borderColor, color: contentWidth === cw.value ? accentColor : rt.text, fontWeight: contentWidth === cw.value ? 600 : 400 }}>{cw.label}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs opacity-50" style={{ color: rt.text, fontFamily: "'Inter', sans-serif" }}>Font</p>
                      <div className="flex flex-col gap-0.5">
                        {FONT_FAMILIES.map((ff) => (
                          <button key={ff.value} onClick={() => setFontFamily(ff.value)} className="text-left px-3 py-2 rounded-lg transition-all text-sm" style={{ fontFamily: ff.value, background: fontFamily === ff.value ? `${accentColor}18` : "transparent", color: fontFamily === ff.value ? accentColor : rt.text, fontWeight: fontFamily === ff.value ? 600 : 400 }} onMouseEnter={(e) => { if (fontFamily !== ff.value) (e.currentTarget as HTMLElement).style.background = rt.surfaceHover; }} onMouseLeave={(e) => { if (fontFamily !== ff.value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>{ff.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked((b) => !b)}
              className="flex items-center gap-1.5 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: bookmarked ? accentColor : rt.muted, background: "transparent", border: "none", cursor: "pointer" }}
            >
              {bookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
              Bookmark
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); setShowSettings(false); }}
                className="flex items-center gap-1.5 transition-all"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: showLangMenu ? accentColor : rt.muted, background: "transparent", border: "none", cursor: "pointer" }}
              >
                <Globe className="size-3.5" />
                {currentLang.label}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 rounded-xl border shadow-2xl z-50 min-w-40 overflow-hidden" style={{ background: rt.surface, borderColor }} onClick={(e) => e.stopPropagation()}>
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm transition-all" style={{ fontFamily: "'Inter', sans-serif", color: lang.code === language ? accentColor : rt.text, background: lang.code === language ? `${accentColor}18` : "transparent", fontWeight: lang.code === language ? 600 : 400 }} onMouseEnter={(e) => { if (lang.code !== language) (e.currentTarget as HTMLElement).style.background = rt.surfaceHover; }} onMouseLeave={(e) => { if (lang.code !== language) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>{lang.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Prev · Chapters List · Next */}
          <div className="flex items-center gap-2 py-2">
            {/* Prev */}
            <button
              onClick={() => hasPrev && navigate(`/read/${novel.id}/${currentChapter - 1}`)}
              disabled={!hasPrev}
              style={{ ...pillBtn(false), opacity: hasPrev ? 1 : 0.35, cursor: hasPrev ? "pointer" : "not-allowed" }}
            >
              <ChevronLeft className="size-3.5" />
              Prev
            </button>

            {/* Chapters List — grows, centered */}
            <div className="relative flex-1 flex justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/novel/${novel.id}#toc`); }}
                style={pillBtn(false)}
              >
                <List className="size-3.5" />
                Chapters List
              </button>
            </div>

            {/* Next */}
            <button
              onClick={() => hasNext && navigate(`/read/${novel.id}/${currentChapter + 1}`)}
              disabled={!hasNext}
              style={{ ...pillBtn(false), background: hasNext ? `${accentColor}22` : rt.surfaceHover, borderColor: hasNext ? accentColor : borderColor, color: hasNext ? accentColor : rt.muted, opacity: hasNext ? 1 : 0.35, cursor: hasNext ? "pointer" : "not-allowed" }}
            >
              Next
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Ad Banner 1 — below chapter list controls */}
        <NativeBanner
          bg={rt.surface}
          borderColor={borderColor}
          textColor={rt.text}
          accentColor={accentColor}
          className="mb-6"
        />

        {/* Chapter title */}
        <div className="mb-6">
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(1.3rem, 3.5vw, 1.75rem)",
              color: rt.text,
              lineHeight: 1.3,
              marginBottom: "0.4em",
            }}
          >
            Chapter {currentChapter}
          </h1>
          <Link
            to={`/novel/${novel.id}`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: accentColor, textDecoration: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            {novel.title}
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: rt.muted, fontFamily: "'Inter', sans-serif" }}>
              <Clock className="size-3" />
              {readMinutes} min read
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: rt.muted, fontFamily: "'Inter', sans-serif" }}>
              <AlignLeft className="size-3" />
              {wordCount} words
            </span>
          </div>
          <div className="mt-5 h-px" style={{ background: borderColor }} />
        </div>

        {/* Paragraphs with mid-chapter ad banner */}
        <div style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: lineSpacing, color: rt.text }}>
          {(() => {
            const midPoint = Math.floor(paragraphs.length * 0.4);
            return paragraphs.map((p, i) => (
              <div key={i}>
                <p style={{ marginBottom: `${lineSpacing * 0.85}em`, textAlign: "justify" }}>{p}</p>
                {i === midPoint && (
                  <NativeBanner
                    bg={rt.surface}
                    borderColor={borderColor}
                    textColor={rt.text}
                    accentColor={accentColor}
                    className="my-6"
                  />
                )}
              </div>
            ));
          })()}
        </div>

        {/* Chapter complete */}
        {readProgress > 90 && (
          <div
            className="my-10 flex items-center justify-center gap-3"
            style={{ opacity: Math.min((readProgress - 90) / 10, 1), transition: "opacity 0.5s" }}
          >
            <div className="flex-1 h-px" style={{ background: borderColor }} />
            <span className="text-xs px-4 py-1.5 rounded-full border" style={{ color: accentColor, borderColor: `${accentColor}50`, background: `${accentColor}12`, fontFamily: "'Inter', sans-serif" }}>
              Chapter {currentChapter} Complete
            </span>
            <div className="flex-1 h-px" style={{ background: borderColor }} />
          </div>
        )}

        {/* Bottom navigation: Prev · Chapter List · Next */}
        <div className="mt-10 mb-4 flex items-center gap-2" style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "1.5rem" }}>
          <button
            onClick={() => hasPrev && navigate(`/read/${novel.id}/${currentChapter - 1}`)}
            disabled={!hasPrev}
            style={{ ...pillBtn(false), opacity: hasPrev ? 1 : 0.35, cursor: hasPrev ? "pointer" : "not-allowed" }}
          >
            <ChevronLeft className="size-3.5" />
            Prev
          </button>
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => navigate(`/novel/${novel.id}#toc`)}
              style={pillBtn(false)}
            >
              <List className="size-3.5" />
              Chapter List
            </button>
          </div>
          <button
            onClick={() => hasNext && navigate(`/read/${novel.id}/${currentChapter + 1}`)}
            disabled={!hasNext}
            style={{ ...pillBtn(false), background: hasNext ? `${accentColor}22` : rt.surfaceHover, borderColor: hasNext ? accentColor : borderColor, color: hasNext ? accentColor : rt.muted, opacity: hasNext ? 1 : 0.35, cursor: hasNext ? "pointer" : "not-allowed" }}
          >
            Next
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Comments + bottom nav */}
        <div className="mt-6">
          <CommentsBlock
            bg={rt.bg}
            surface={rt.surface}
            surfaceHover={rt.surfaceHover}
            borderColor={borderColor}
            accentColor={accentColor}
            isLight={readerTheme === "light"}
            textColor={rt.text}
            subtextColor={rt.muted}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => hasPrev && navigate(`/read/${novel.id}/${currentChapter - 1}`)}
            onNext={() => hasNext && navigate(`/read/${novel.id}/${currentChapter + 1}`)}
            onChapterList={() => navigate(`/novel/${novel.id}#toc`)}
            showChapterList={false}
            novelId={novel.id}
            currentChapter={currentChapter}
            totalChapters={novel.chapters}
            onNavigateChapter={(ch) => navigate(`/read/${novel.id}/${ch}`)}
          />
        </div>
      </div>
    </div>
  );
}
