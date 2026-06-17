import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  BookOpen, Star, Eye, ChevronRight, ChevronLeft,
  Bookmark, Share2, ArrowLeft, ChevronDown, ChevronUp,
  Globe, User, Building2, Calendar
} from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS } from "../data/novels";
import { CommentsBlock } from "../components/comments-block";
import { AdSlot } from "../components/ad-slot";

const CHAPTERS_PER_PAGE = 50;

const CHAPTER_TITLES = [
  "The Beginning", "A New Power", "Shadows Rise", "The Gate Opens", "Breakthrough",
  "Hidden Truths", "Final Stand", "Awakening", "The Trials", "Dark Path",
  "New Horizon", "Revelation", "The Alliance", "Breaking Limits", "Confrontation",
  "Unexpected Aid", "The Price of Power", "Into the Unknown", "Convergence", "Legacy"
];

const PUBLISHERS = ["RoyalRoad", "Webnovel", "ScribbleHub", "Wattpad", "NovelUpdates"];

function generateChapters(total: number, novelId: number) {
  return Array.from({ length: total }, (_, i) => {
    const chNum = i + 1;
    return {
      id: chNum,
      title: `Chapter ${chNum}: ${CHAPTER_TITLES[Math.abs((novelId * chNum) % CHAPTER_TITLES.length)]}`,
      date: `${Math.floor(((novelId * chNum * 7) % 28) + 1)} days ago`,
    };
  });
}


const RATING_CATEGORIES = [
  { key: "story", label: "Story Development", value: 4.8 },
  { key: "writing", label: "Writing Quality", value: 4.6 },
  { key: "world", label: "World Background", value: 4.9 },
  { key: "character", label: "Character Design", value: 4.7 },
];

type Tab = "about" | "toc";

export function NovelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];

  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [chapterPage, setChapterPage] = useState(1);

  useEffect(() => {
    if (window.location.hash === "#toc") {
      setActiveTab("toc");
      setTimeout(() => {
        document.getElementById("toc-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);
  const [chapterOrder, setChapterOrder] = useState<"asc" | "desc">("asc");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const novel = ALL_NOVELS.find((n) => n.id === Number(id));

  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)";
  const dividerColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  const rowBg = isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.025)";

  if (!novel) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: ts.text }}>Novel not found</p>
          <button onClick={() => navigate("/")} className="mt-4 text-emerald-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>← Back to home</button>
        </div>
      </div>
    );
  }

  const allChapters = generateChapters(novel.chapters, novel.id);
  const sortedChapters = chapterOrder === "desc" ? [...allChapters].reverse() : allChapters;
  const totalPages = Math.ceil(sortedChapters.length / CHAPTERS_PER_PAGE);
  const pagedChapters = sortedChapters.slice((chapterPage - 1) * CHAPTERS_PER_PAGE, chapterPage * CHAPTERS_PER_PAGE);

  const statusLabel = novel.status === "ongoing" ? "Ongoing" : novel.status === "completed" ? "Completed" : "Hiatus";
  const statusColor = novel.status === "ongoing" ? "#10b981" : novel.status === "completed" ? "#3b82f6" : "#f59e0b";
  const overallRating = (RATING_CATEGORIES.reduce((s, c) => s + c.value, 0) / RATING_CATEGORIES.length).toFixed(1);

  // Derived mock metadata
  const publisher = PUBLISHERS[(novel.id - 1) % PUBLISHERS.length];
  const yearPublished = 2020 + ((novel.id * 3) % 5);
  const totalWritten = novel.chapters + Math.floor((novel.id * 17) % 80);
  const availableChapters = novel.chapters;
  const weeklyViews = `${(parseInt(novel.views) * 768 || 15768).toLocaleString()}`;
  const totalViews = novel.views;
  const ratingCount = 1200 + (novel.id * 347) % 8000;

  function RatingBar({ value }: { value: number }) {
    return (
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: cardBorder }}>
        <div className="h-full rounded-full" style={{ width: `${(value / 5) * 100}%`, background: "linear-gradient(90deg,#10b981,#059669)" }} />
      </div>
    );
  }

  const infoRows: { label: string; value: string; icon?: React.ReactNode }[] = [
    { label: "Status in COO", value: statusLabel, icon: <span className="inline-block w-2 h-2 rounded-full" style={{ background: statusColor }} /> },
    { label: "Total written", value: `${totalWritten}+ chapters` },
    { label: "Available", value: `${availableChapters} chapters` },
    { label: "Year of publishing", value: String(yearPublished), icon: <Calendar className="size-3" style={{ color: ts.muted }} /> },
    { label: "Language", value: "English", icon: <Globe className="size-3" style={{ color: ts.muted }} /> },
    { label: "Author", value: novel.author, icon: <User className="size-3" style={{ color: ts.muted }} /> },
    { label: "Publisher", value: publisher, icon: <Building2 className="size-3" style={{ color: ts.muted }} /> },
    { label: "Views", value: weeklyViews, icon: <Eye className="size-3" style={{ color: ts.muted }} /> },
    { label: "Total views", value: totalViews, icon: <Eye className="size-3" style={{ color: ts.muted }} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)]" style={{ background: ts.bg }}>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 mb-6 text-sm transition-opacity hover:opacity-70"
          style={{ fontFamily: "'Inter', sans-serif", color: ts.subtext }}
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>

        {/* === HERO ROW: Cover + Info === */}
        <div className="flex gap-4 sm:gap-6 mb-8">
          {/* Cover */}
          <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-2xl" style={{ width: "clamp(100px, 28vw, 150px)", height: "clamp(145px, 40vw, 220px)", border: `1px solid ${cardBorder}` }}>
            <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Genre badge */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs border" style={{ borderColor: cardBorder, color: ts.subtext, fontFamily: "'Inter', sans-serif" }}>{novel.genre}</span>
              {novel.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded text-xs border" style={{ borderColor: cardBorder, color: ts.muted, fontFamily: "'Inter', sans-serif" }}>{tag}</span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.2rem,3vw,1.8rem)", color: ts.text, lineHeight: 1.25 }}>
              {novel.title}
            </h1>

            {/* Author · Chapters · Views row */}
            <div className="flex items-center gap-2 flex-wrap mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: ts.subtext }}>
              <span>by <span style={{ color: ts.text, fontWeight: 500 }}>{novel.author}</span></span>
              <span style={{ color: ts.muted }}>·</span>
              <span className="flex items-center gap-1"><BookOpen className="size-3" />{novel.chapters} ch</span>
              <span style={{ color: ts.muted }}>·</span>
              <span className="flex items-center gap-1"><Eye className="size-3" />{totalViews} views</span>
            </div>

            {/* Rating stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`size-3.5 ${s <= Math.round(novel.rating) ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                ))}
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: ts.text }}>{novel.rating}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.muted }}>/ 5.0</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.muted }}>({ratingCount.toLocaleString()} ratings)</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <button
            onClick={() => navigate(`/read/${novel.id}/1`)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white transition-all"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.88rem", boxShadow: "0 0 20px rgba(16,185,129,0.25)" }}
          >
            <BookOpen className="size-4" /> Start Reading
          </button>
          <button
            onClick={() => navigate(`/read/${novel.id}/${novel.chapters}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all"
            style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)", color: "#10b981", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.88rem" }}
          >
            <ChevronRight className="size-4" /> Latest Chapter
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all"
            style={{ borderColor: cardBorder, background: "transparent", color: ts.text, fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.88rem" }}
          >
            <Bookmark className="size-4" /> Add to Library
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all"
            style={{ borderColor: cardBorder, background: "transparent", color: ts.subtext, fontFamily: "'Inter', sans-serif", fontSize: "0.88rem" }}
          >
            <Share2 className="size-4" />
          </button>
        </div>

        {/* Ad Slot 3 — below action buttons, before tabs */}
        <AdSlot type="leaderboard" label="728×90" className="mb-8" />

        {/* === TABS: About | Table of Contents === */}
        <div id="toc-section" className="flex gap-0 mb-6 border-b" style={{ borderColor: cardBorder }}>
          {(["about", "toc"] as Tab[]).map((tab) => {
            const label = tab === "about" ? "About" : "Table of Contents";
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-3 relative transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#10b981" : ts.subtext,
                  background: "transparent",
                  border: "none",
                }}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: "#10b981" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* === CONTENT AREA === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <>
                {/* Synopsis */}
                <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: cardBorder }}>
                  <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: ts.text }}>Synopsis</h2>
                  <div className="relative">
                    <p
                      className={!showFullDesc ? "line-clamp-4" : ""}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: 1.8, color: ts.subtext }}
                    >
                      {novel.description}
                    </p>
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="flex items-center gap-1 mt-2.5 text-xs"
                      style={{ color: "#10b981", fontFamily: "'Inter', sans-serif" }}
                    >
                      {showFullDesc ? <><ChevronUp className="size-3" /> Show less</> : <><ChevronDown className="size-3" /> Show more</>}
                    </button>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: cardBorder }}>
                  <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: ts.text }}>Ratings</h2>
                  <div className="flex gap-6 items-center">
                    <div className="text-center flex-shrink-0">
                      <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "3rem", color: "#10b981", lineHeight: 1 }}>{overallRating}</p>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`size-3 ${s <= Math.round(Number(overallRating)) ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                        ))}
                      </div>
                      <p className="mt-1 text-xs" style={{ color: ts.subtext, fontFamily: "'Inter', sans-serif" }}>Overall</p>
                    </div>
                    <div style={{ width: "1px", height: "80px", background: cardBorder }} />
                    <div className="flex-1 flex flex-col gap-2.5">
                      {RATING_CATEGORIES.map((cat) => (
                        <div key={cat.key} className="flex items-center gap-3">
                          <span className="text-xs flex-shrink-0" style={{ color: ts.subtext, fontFamily: "'Inter', sans-serif", width: "140px" }}>{cat.label}</span>
                          <RatingBar value={cat.value} />
                          <span className="text-xs flex-shrink-0 text-right" style={{ color: ts.text, fontFamily: "'Inter', sans-serif", fontWeight: 600, width: "24px" }}>{cat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ad Slot 2 — before comments */}
                <AdSlot type="leaderboard" label="728×90" />

                {/* Comments */}
                <CommentsBlock
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                  dividerColor={dividerColor}
                  isLight={isLight}
                  textColor={ts.text}
                  subtextColor={ts.subtext}
                />
              </>
            )}

            {/* TABLE OF CONTENTS TAB */}
            {activeTab === "toc" && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: ts.text }}>
                    Chapters <span style={{ color: ts.subtext, fontWeight: 400, fontSize: "0.82rem", fontFamily: "'Inter', sans-serif" }}>({novel.chapters} total)</span>
                  </h2>
                  <button
                    onClick={() => { setChapterOrder(o => o === "asc" ? "desc" : "asc"); setChapterPage(1); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all"
                    style={{ borderColor: cardBorder, color: ts.subtext, fontFamily: "'Inter', sans-serif", background: "transparent" }}
                  >
                    {chapterOrder === "asc" ? "Oldest first" : "Newest first"}
                  </button>
                </div>

                <div className="divide-y" style={{ borderColor: dividerColor }}>
                  {pagedChapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => navigate(`/read/${novel.id}/${ch.id}`)}
                      className="w-full flex items-center justify-between px-5 py-3 text-left transition-all group"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <p className="group-hover:text-emerald-400 transition-colors text-sm" style={{ fontWeight: 500, color: ts.text }}>{ch.title}</p>
                      <span className="text-xs flex-shrink-0 ml-4" style={{ color: ts.muted }}>{ch.date}</span>
                    </button>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: `1px solid ${dividerColor}` }}>
                    <button
                      onClick={() => setChapterPage(p => Math.max(1, p - 1))}
                      disabled={chapterPage === 1}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
                      style={{ borderColor: chapterPage === 1 ? dividerColor : "rgba(16,185,129,0.4)", color: chapterPage === 1 ? ts.subtext : "#10b981", fontFamily: "'Inter', sans-serif", opacity: chapterPage === 1 ? 0.5 : 1, cursor: chapterPage === 1 ? "not-allowed" : "pointer", background: "transparent" }}
                    >
                      <ChevronLeft className="size-3" /> Prev
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 5) page = i + 1;
                        else if (chapterPage <= 3) page = i + 1;
                        else if (chapterPage >= totalPages - 2) page = totalPages - 4 + i;
                        else page = chapterPage - 2 + i;
                        return (
                          <button
                            key={page}
                            onClick={() => setChapterPage(page)}
                            className="w-7 h-7 rounded-lg text-xs"
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: page === chapterPage ? 700 : 400, background: page === chapterPage ? "rgba(16,185,129,0.15)" : "transparent", color: page === chapterPage ? "#10b981" : ts.subtext, border: `1px solid ${page === chapterPage ? "rgba(16,185,129,0.4)" : "transparent"}` }}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setChapterPage(p => Math.min(totalPages, p + 1))}
                      disabled={chapterPage === totalPages}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
                      style={{ borderColor: chapterPage === totalPages ? dividerColor : "rgba(16,185,129,0.4)", color: chapterPage === totalPages ? ts.subtext : "#10b981", fontFamily: "'Inter', sans-serif", opacity: chapterPage === totalPages ? 0.5 : 1, cursor: chapterPage === totalPages ? "not-allowed" : "pointer", background: "transparent" }}
                    >
                      Next <ChevronRight className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Novel Info */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.95rem", color: ts.text }}>Novel Info</h3>
              </div>
              {infoRows.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center gap-2 px-4 py-2"
                  style={{
                    background: i % 2 === 0 ? rowBg : "transparent",
                    borderBottom: i < infoRows.length - 1 ? `1px solid ${dividerColor}` : "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span className="flex items-center gap-1 flex-shrink-0" style={{ fontSize: "0.72rem", color: ts.muted, minWidth: "100px" }}>
                    {row.icon}{row.label}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 500, color: ts.text }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Genre & Tags */}
            <div className="p-4 rounded-2xl border" style={{ background: cardBg, borderColor: cardBorder }}>
              <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.95rem", color: ts.text }}>Genre & Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{novel.genre}</span>
                {novel.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full border text-xs" style={{ borderColor: cardBorder, color: ts.subtext, fontFamily: "'Inter', sans-serif" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Related Novels */}
            <div className="p-4 rounded-2xl border" style={{ background: cardBg, borderColor: cardBorder }}>
              <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.95rem", color: ts.text }}>Related Novels</h3>
              <div className="flex flex-col gap-3">
                {Array.from(
                  new Map(
                    [...ALL_NOVELS.filter((n) => n.id !== novel.id && (n.genre === novel.genre || n.tags.some(t => novel.tags.includes(t)))),
                     ...ALL_NOVELS.filter((n) => n.id !== novel.id)]
                      .map((n) => [n.id, n])
                  ).values()
                ).slice(0, 5).map((rel) => (
                  <Link key={rel.id} to={`/novel/${rel.id}`} className="flex gap-3 group">
                    <div className="flex-shrink-0 overflow-hidden rounded-md" style={{ width: "44px", height: "60px" }}>
                      <img src={rel.coverUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: ts.text }}>{rel.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: ts.subtext }}>
                        <Star className="size-2.5 fill-amber-400 text-amber-400" /> {rel.rating.toFixed(1)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ad Slot 3 — bottom of page */}
        <AdSlot type="leaderboard" label="728×90" className="mt-8" />
      </div>
    </div>
  );
}
