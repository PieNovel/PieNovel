import { Link, useNavigate } from "react-router";
import { BookOpen, Clock, Star, Heart, Settings, LogOut, ShieldCheck, Edit2, BookMarked } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const { user, isLoggedIn, favorites, history, logout } = useAuth();
  const navigate = useNavigate();
  const isLight = theme === "light";

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4" style={{ background: ts.bg }}>
        <BookOpen className="size-12" style={{ color: "#10b981" }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.text }}>You are not signed in</p>
        <button
          onClick={() => navigate("/signin")}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}
        >
          Sign In
        </button>
      </div>
    );
  }

  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";
  const statCards = [
    { label: "Novels Read", value: user.totalRead, icon: BookOpen },
    { label: "Chapters Read", value: user.totalChapters.toLocaleString(), icon: BookMarked },
    { label: "In Library", value: favorites.length, icon: Heart },
    { label: "History Items", value: history.length, icon: Clock },
  ];

  const recentHistory = history.slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-56px)] py-10" style={{ background: ts.bg }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Profile card */}
        <div
          className="rounded-2xl border overflow-hidden mb-6"
          style={{ background: cardBg, borderColor, boxShadow: isLight ? "0 2px 16px rgba(0,0,0,0.06)" : "0 4px 32px rgba(0,0,0,0.4)" }}
        >
          {/* Banner */}
          <div
            className="h-32 relative"
            style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0d9488 100%)" }}
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #34d399 0%, transparent 60%), radial-gradient(circle at 80% 20%, #10b981 0%, transparent 50%)" }} />
            {user.role === "admin" && (
              <div
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(52,211,153,0.4)", color: "#34d399", fontFamily: "'Inter', sans-serif" }}
              >
                <ShieldCheck className="size-3" />
                Admin
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-14 mb-4 flex items-end justify-between">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="size-24 rounded-2xl object-cover border-4"
                  style={{ borderColor: cardBg, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 size-5 rounded-full border-2 flex items-center justify-center"
                  style={{ background: "#10b981", borderColor: cardBg }}
                />
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Link
                  to="/settings"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-all"
                  style={{ fontFamily: "'Inter', sans-serif", borderColor, color: ts.subtext, background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)" }}
                >
                  <Edit2 className="size-3.5" />
                  Edit Profile
                </Link>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-all"
                  style={{ fontFamily: "'Inter', sans-serif", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
                >
                  <LogOut className="size-3.5" />
                  Sign Out
                </button>
              </div>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.5rem", color: ts.text }}>{user.username}</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: ts.subtext, marginTop: "2px" }}>{user.email}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.subtext, marginTop: "10px", lineHeight: 1.6 }}>{user.bio}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.muted, marginTop: "8px" }}>Member since {user.joinedAt}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border p-4 flex flex-col gap-2"
              style={{ background: cardBg, borderColor }}
            >
              <Icon className="size-4" style={{ color: "#10b981" }} />
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: ts.text }}>{value}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "My Library", desc: "Saved novels & favorites", to: "/library", icon: Heart, color: "#ec4899" },
            { label: "Reading History", desc: "Continue where you left off", to: "/history", icon: Clock, color: "#f59e0b" },
            { label: "Settings", desc: "Preferences & notifications", to: "/settings", icon: Settings, color: "#10b981" },
          ].map(({ label, desc, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border p-4 flex items-center gap-3 transition-all group"
              style={{ background: cardBg, borderColor }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + "60"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; }}
            >
              <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: ts.text }}>{label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext, marginTop: "2px" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent reading */}
        {recentHistory.length > 0 && (
          <div
            className="rounded-2xl border p-5"
            style={{ background: cardBg, borderColor }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: ts.text }}>Recent Reading</h2>
              <Link to="/history" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#10b981" }}>View all →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentHistory.map((entry) => (
                <Link
                  key={entry.novelId}
                  to={`/read/${entry.novelId}/${entry.chapterId}`}
                  className="flex items-center gap-3 group"
                >
                  <img src={entry.novelCover} alt={entry.novelTitle} className="size-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: ts.text }}>{entry.novelTitle}</p>
                    <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: ts.subtext, marginTop: "2px" }}>{entry.chapterTitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: `${entry.progress}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }} />
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: ts.muted }}>{entry.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
