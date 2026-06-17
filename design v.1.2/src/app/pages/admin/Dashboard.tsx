import { BookOpen, Users, Eye, TrendingUp, BookMarked, Clock, Star, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTheme, THEME_STYLES } from "../../context/ThemeContext";
import { ALL_NOVELS } from "../../data/novels";

// DB mapping:
// totalNovels  → SELECT COUNT(*) FROM novels
// totalUsers   → SELECT COUNT(*) FROM users
// totalViews   → SELECT SUM(views) FROM novels
// newToday     → SELECT COUNT(*) FROM novels WHERE DATE(created_at) = CURRENT_DATE

const STATS = [
  { label: "Total Novels", value: "1,284", change: "+12 this week", icon: BookOpen, color: "#10b981" },
  { label: "Registered Users", value: "48,921", change: "+340 today", icon: Users, color: "#3b82f6" },
  { label: "Total Views", value: "9.2M", change: "+84k today", icon: Eye, color: "#f59e0b" },
  { label: "Active Readers", value: "6,712", change: "right now", icon: TrendingUp, color: "#ec4899" },
];

const RECENT_NOVELS = ALL_NOVELS.slice(0, 5);

const RECENT_ACTIVITY = [
  { action: "New chapter added", target: "Shadow Monarch's Ascension Ch. 543", time: "2m ago", type: "chapter" },
  { action: "Novel uploaded", target: "The Eternal Flame Path", time: "14m ago", type: "novel" },
  { action: "User registered", target: "reader_k2891", time: "23m ago", type: "user" },
  { action: "Novel completed", target: "Mystic Cultivation Chronicles", time: "1h ago", type: "status" },
  { action: "Chapter reported", target: "Celestial Emperor's Legacy Ch. 120", time: "2h ago", type: "report" },
];

const TYPE_COLORS: Record<string, string> = {
  chapter: "#10b981",
  novel: "#3b82f6",
  user: "#f59e0b",
  status: "#8b5cf6",
  report: "#ef4444",
};

export function AdminDashboard() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";

  const completedCount = ALL_NOVELS.filter((n) => n.status === "completed").length;
  const ongoingCount = ALL_NOVELS.filter((n) => n.status === "ongoing").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: ts.text }}>Dashboard</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>Welcome back. Here's what's happening on PieNovel.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor }}>
            <div className="flex items-start justify-between mb-4">
              <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: color + "18" }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <ArrowUpRight className="size-4 opacity-30" style={{ color: ts.subtext }} />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.6rem", color: ts.text }}>{value}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.subtext, marginTop: "2px" }}>{label}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color, marginTop: "6px" }}>↑ {change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Novel status breakdown */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor }}>
          <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: ts.text }}>Novel Status</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Ongoing", count: ongoingCount, color: "#f59e0b", pct: Math.round(ongoingCount / ALL_NOVELS.length * 100) },
              { label: "Completed", count: completedCount, color: "#10b981", pct: Math.round(completedCount / ALL_NOVELS.length * 100) },
              { label: "On Hiatus", count: ALL_NOVELS.length - ongoingCount - completedCount, color: "#ef4444", pct: Math.round((ALL_NOVELS.length - ongoingCount - completedCount) / ALL_NOVELS.length * 100) },
            ].map(({ label, count, color, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{label}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: ts.text }}>{count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-2xl border p-5" style={{ background: cardBg, borderColor }}>
          <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: ts.text }}>Recent Activity</h2>
          <div className="flex flex-col gap-0">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor }}>
                <div className="size-2 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[item.type] }} />
                <div className="flex-1 min-w-0">
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{item.action}: </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.text }}>{item.target}</span>
                </div>
                <span className="flex-shrink-0" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: ts.muted }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent novels table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: ts.text }}>Recent Novels</h2>
          <Link to="/admin/novels" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#10b981" }}>View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {["Novel", "Author", "Chapters", "Views", "Status", "Updated"].map((h) => (
                  <th key={h} className="text-left px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, color: ts.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_NOVELS.map((novel) => (
                <tr key={novel.id} className="transition-colors" style={{ borderBottom: `1px solid ${borderColor}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={novel.coverUrl} alt={novel.title} className="size-9 rounded-lg object-cover flex-shrink-0" />
                      <Link to={`/novel/${novel.id}`} className="font-medium line-clamp-1 max-w-[180px]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.text }}>{novel.title}</Link>
                    </div>
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{novel.author}</td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.text }}>{novel.chapters}</td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.text }}>{novel.views}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs" style={{ fontFamily: "'Inter', sans-serif", background: novel.status === "completed" ? "rgba(16,185,129,0.12)" : novel.status === "ongoing" ? "rgba(251,191,36,0.12)" : "rgba(239,68,68,0.12)", color: novel.status === "completed" ? "#10b981" : novel.status === "ongoing" ? "#f59e0b" : "#ef4444" }}>
                      {novel.status}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{novel.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
