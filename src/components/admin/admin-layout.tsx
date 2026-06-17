"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, BookOpen, BookMarked, Users, Upload, LogOut,
  Menu, X, ChevronRight, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/site/auth-context";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/novels", label: "Novels", icon: BookOpen },
  { to: "/admin/chapters", label: "Chapters", icon: BookMarked },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/upload", label: "Upload", icon: Upload },
];

export function AdminLayout({ children, locale }: { children: ReactNode; locale: string }) {
  const { user, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: "var(--background)" }}>
        <ShieldCheck className="size-12 text-[var(--primary)]" />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)" }}>
          Admin access required
        </p>
        <button
          onClick={() => router.push(`/${locale}/signin`)}
          className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
        >
          Sign In
        </button>
      </div>
    );
  }

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    const path = pathname.replace(`/${locale}`, "") || "/";
    if (item.exact) return path === item.to;
    return path.startsWith(item.to);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar locale={locale} isActive={isActive} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} logout={logout} router={router} />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <Sidebar locale={locale} isActive={isActive} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} logout={logout} router={router} mobile />
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="flex h-14 flex-shrink-0 items-center justify-between border-b px-4 sm:px-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" style={{ color: "var(--muted-foreground)" }} />
          </button>
          <div className="md:hidden" />
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}`}
              className="rounded-xl border px-3 py-1.5 text-xs transition-all"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              &larr; Back to Site
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Sidebar({
  locale, isActive, sidebarOpen, setSidebarOpen, user, logout, router, mobile,
}: {
  locale: string;
  isActive: (item: (typeof NAV_ITEMS)[0]) => boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  user: { avatar: string; username: string; role: string } | null;
  logout: () => void;
  router: ReturnType<typeof useRouter>;
  mobile?: boolean;
}) {
  return (
    <div
      className="flex h-screen flex-col border-r"
      style={{ width: "220px", flexShrink: 0, background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div
        className="flex h-14 flex-shrink-0 items-center justify-between border-b px-5"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href={`/${locale}`} className="flex items-center gap-0">
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--foreground)" }}>
            Pie
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.1rem",
              background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            Novel
          </span>
          <span
            className="ml-1.5 rounded-md px-1.5 py-0.5 text-xs font-semibold"
            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)", fontSize: "0.6rem" }}
          >
            ADMIN
          </span>
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)}><X className="size-4" style={{ color: "var(--muted-foreground)" }} /></button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              href={`/${locale}${item.to}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all"
              style={{
                background: active ? "rgba(16,185,129,0.12)" : "transparent",
                color: active ? "var(--primary)" : "var(--muted-foreground)",
                fontWeight: active ? 600 : 400,
                border: `1px solid ${active ? "rgba(16,185,129,0.2)" : "transparent"}`,
              }}
            >
              <item.icon className="size-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="ml-auto size-3.5" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t px-4 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex items-center gap-3">
          <img src={user?.avatar} alt={user?.username} className="size-8 flex-shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>{user?.username}</p>
            <p className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push(`/${locale}`); }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all"
          style={{ color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
        >
          <LogOut className="size-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
