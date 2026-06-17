import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, BookMarked, Users, Upload, LogOut,
  Menu, X, ChevronRight, ShieldCheck,
} from "lucide-react";
import { ThemeProvider, useTheme, THEME_STYLES } from "../../context/ThemeContext";
import { AuthProvider, useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/novels", label: "Novels", icon: BookOpen },
  { to: "/admin/chapters", label: "Chapters", icon: BookMarked },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/upload", label: "Upload", icon: Upload },
];

function AdminLayout() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLight = theme === "light";
  const sidebarBg = isLight ? "#ffffff" : theme === "gray" ? "#13151c" : "#080c11";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";
  const mainBg = isLight ? "#f8fafc" : theme === "gray" ? "#1a1c22" : "#07090D";

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: mainBg }}>
        <ShieldCheck className="size-12" style={{ color: "#10b981" }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.text }}>Admin access required</p>
        <button onClick={() => navigate("/signin")} className="px-6 py-2.5 rounded-xl text-white text-sm" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>
          Sign In
        </button>
      </div>
    );
  }

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={mobile ? "fixed inset-0 z-50 flex" : ""}
    >
      {mobile && <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />}
      <div
        className="flex flex-col h-screen"
        style={{
          width: "220px",
          background: sidebarBg,
          borderRight: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-14 border-b" style={{ borderColor }}>
          <Link to="/" className="flex items-center gap-0">
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.1rem", color: ts.text }}>Pie</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Novel</span>
            <span
              className="ml-1.5 text-xs px-1.5 py-0.5 rounded-md font-semibold"
              style={{ fontFamily: "'Inter', sans-serif", background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)", fontSize: "0.6rem" }}
            >
              ADMIN
            </span>
          </Link>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)}><X className="size-4" style={{ color: ts.subtext }} /></button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                style={{
                  background: active ? "rgba(16,185,129,0.12)" : "transparent",
                  color: active ? "#10b981" : ts.subtext,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 400,
                  border: `1px solid ${active ? "rgba(16,185,129,0.2)" : "transparent"}`,
                }}
              >
                <item.icon className="size-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="size-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t px-4 py-4" style={{ borderColor }}>
          <div className="flex items-center gap-3 mb-3">
            <img src={user.avatar} alt={user.username} className="size-8 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: ts.text }}>{user.username}</p>
              <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: ts.subtext }}>{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
            style={{ fontFamily: "'Inter', sans-serif", color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
          >
            <LogOut className="size-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: mainBg }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && <Sidebar mobile />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 h-14 flex-shrink-0 border-b"
          style={{ background: sidebarBg, borderColor }}
        >
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" style={{ color: ts.subtext }} />
          </button>
          <div className="md:hidden" />
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-xs px-3 py-1.5 rounded-xl border transition-all"
              style={{ fontFamily: "'Inter', sans-serif", borderColor, color: ts.subtext }}
            >
              ← Back to Site
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function AdminRoot() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
