import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Clock, Trash2, BookOpen, AlertTriangle } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function HistoryPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const { isLoggedIn, history, clearHistory } = useAuth();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4" style={{ background: ts.bg }}>
        <Clock className="size-12" style={{ color: "#10b981" }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.text }}>Sign in to see your history</p>
        <button onClick={() => navigate("/signin")} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] py-10" style={{ background: ts.bg }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "2rem", color: ts.text }}>Reading History</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>{history.length} {history.length === 1 ? "entry" : "entries"}</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all"
              style={{ fontFamily: "'Inter', sans-serif", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
            >
              <Trash2 className="size-3.5" />
              Clear All
            </button>
          )}
        </div>

        {/* Confirm clear dialog */}
        {confirmClear && (
          <div
            className="rounded-2xl border p-5 mb-6 flex items-start gap-4"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}
          >
            <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
            <div className="flex-1">
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: ts.text }}>Clear all reading history?</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext, marginTop: "4px" }}>This action cannot be undone.</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => { clearHistory(); setConfirmClear(false); }}
                  className="px-4 py-1.5 rounded-xl text-sm text-white"
                  style={{ background: "#ef4444", fontFamily: "'Inter', sans-serif" }}
                >
                  Clear History
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-1.5 rounded-xl text-sm border"
                  style={{ fontFamily: "'Inter', sans-serif", borderColor, color: ts.subtext }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Clock className="size-14 opacity-20" style={{ color: ts.subtext }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: ts.text }}>No reading history yet</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext }}>Start reading to track your progress here.</p>
            <Link to="/browse" className="px-5 py-2 rounded-xl text-sm text-white" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>Browse Novels</Link>
          </div>
        )}

        {/* History list */}
        {history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((entry) => (
              <div
                key={`${entry.novelId}-${entry.readAt}`}
                className="rounded-2xl border overflow-hidden group"
                style={{ background: cardBg, borderColor }}
              >
                <div className="flex items-center gap-4 p-4">
                  <Link to={`/novel/${entry.novelId}`} className="flex-shrink-0">
                    <img src={entry.novelCover} alt={entry.novelTitle} className="size-16 rounded-xl object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/novel/${entry.novelId}`}>
                      <p className="font-semibold truncate" style={{ fontFamily: "'Playfair Display', serif", color: ts.text }}>{entry.novelTitle}</p>
                    </Link>
                    <p className="truncate mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{entry.chapterTitle}</p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${entry.progress}%`, background: entry.progress === 100 ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#f59e0b,#fbbf24)" }}
                        />
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: ts.muted, flexShrink: 0 }}>
                        {entry.progress === 100 ? "✓ Done" : `${entry.progress}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: ts.muted }}>{timeAgo(entry.readAt)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/read/${entry.novelId}/${entry.chapterId}`}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}
                  >
                    <BookOpen className="size-3.5" />
                    {entry.progress === 100 ? "Reread" : "Continue"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
