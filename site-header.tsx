"use client";

import { Search, X, Sun, Moon, Monitor, LogIn, Check, User, Heart, Clock, Settings, LogOut, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/site/auth-context";
import { useTheme, type Theme, type Language } from "@/lib/site/theme-context";

type SiteHeaderProps = {
  locale: string;
};

const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", native: "EN" },
  { code: "id", label: "Indonesia", flag: "🇮🇩", native: "ID" },
  { code: "jp", label: "日本語", flag: "🇯🇵", native: "JP" },
  { code: "kr", label: "한국어", flag: "🇰🇷", native: "KR" },
  { code: "zh", label: "中文", flag: "🇨🇳", native: "ZH" },
];

const THEMES: { id: Theme; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "dark", label: "Dark", icon: <Moon className="size-3.5" />, desc: "Deep black" },
  { id: "light", label: "Light", icon: <Sun className="size-3.5" />, desc: "Bright white" },
  { id: "gray", label: "Slate", icon: <Monitor className="size-3.5" />, desc: "Neutral grey" },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const langDropdown = useDropdown();
  const themeDropdown = useDropdown();
  const userDropdown = useDropdown();
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    } else {
      router.push(`/${locale}/search`);
    }
  }

  function changeLanguage(next: Language) {
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}(?:/|$)`), "/") || "/";
    router.push(`/${next}${pathWithoutLocale}`);
  }

  const isLight = theme === "light";
  const isGray = theme === "gray";

  const headerBg = isLight
    ? "rgba(248,250,252,0.92)"
    : isGray
    ? "rgba(20,22,28,0.92)"
    : "rgba(5,7,10,0.85)";
  const headerBorderColor = isLight
    ? "rgba(0,0,0,0.07)"
    : "rgba(16,185,129,0.12)";
  const navText = isLight ? "#4b5563" : "#64748b";
  const searchBg = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
  const searchBorder = searchFocused
    ? "rgba(16,185,129,0.5)"
    : isLight
    ? "rgba(0,0,0,0.09)"
    : "rgba(255,255,255,0.07)";
  const inputColor = isLight ? "#1f2937" : "#cbd5e1";
  const placeholderColor = isLight ? "#9ca3af" : "#475569";

  const popupBg = isLight ? "#ffffff" : isGray ? "#16181f" : "#080c11";
  const popupBorder = isLight ? "rgba(0,0,0,0.09)" : "rgba(16,185,129,0.15)";
  const popupDivider = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  const itemHoverBg = isLight ? "rgba(0,0,0,0.04)" : "rgba(16,185,129,0.06)";
  const labelColor = isLight ? "#6b7280" : "#475569";
  const itemText = isLight ? "#374151" : "#94a3b8";

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
  const currentThemeIcon = THEMES.find((t) => t.id === theme)!.icon;

  const NAV_LINKS = [
    { label: "Browse", href: "/browse" },
    { label: "Popular", href: "/popular" },
    { label: "Genres", href: "/genres" },
    { label: "Completed", href: "/completed" },
    { label: "Donation", href: "/donation" },
  ];

  const btnBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"}`,
    background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
    cursor: "pointer",
    transition: "all 0.15s",
    color: navText,
  } as React.CSSProperties;

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: headerBg,
        backdropFilter: "blur(32px) saturate(1.4)",
        WebkitBackdropFilter: "blur(32px) saturate(1.4)",
        borderBottom: `1px solid ${headerBorderColor}`,
        boxShadow: isLight
          ? "none"
          : "0 1px 0 rgba(16,185,129,0.08), 0 4px 32px rgba(0,0,0,0.4)",
        transition: "background 0.3s",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-0 flex-shrink-0 select-none group">
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              color: isLight ? "#111827" : "#f1f5f9",
              transition: "color 0.2s",
            }}>
              Pie
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 12px rgba(16,185,129,0.45))",
            }}>
              Novel
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map((item) => {
              const href = `/${locale}${item.href}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  className="relative text-sm transition-all"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.01em",
                    color: isActive ? "#10b981" : navText,
                    fontWeight: isActive ? 600 : 400,
                    textShadow: isActive ? "0 0 16px rgba(16,185,129,0.5)" : "none",
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-px rounded-full"
                      style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm hidden md:block">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 border transition-all"
              style={{
                background: searchFocused
                  ? isLight ? "rgba(0,0,0,0.06)" : "rgba(16,185,129,0.05)"
                  : searchBg,
                borderColor: searchBorder,
                boxShadow: searchFocused ? "0 0 0 3px rgba(16,185,129,0.1)" : "none",
                transition: "all 0.2s",
              }}
            >
              <Search
                className="size-3.5 flex-shrink-0 transition-colors"
                style={{ color: searchFocused ? "#10b981" : placeholderColor }}
              />
              <input
                type="text"
                placeholder="Search novels, authors..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent text-sm outline-none w-full"
                style={{ fontFamily: "'Inter', sans-serif", color: inputColor }}
              />
              <kbd
                className="text-xs border rounded px-1.5 py-0.5 hidden lg:block flex-shrink-0 cursor-pointer transition-all"
                onClick={() => router.push(`/${locale}/search`)}
                style={{
                  borderColor: searchFocused ? "rgba(16,185,129,0.3)" : searchBorder,
                  fontFamily: "monospace",
                  color: searchFocused ? "#10b981" : placeholderColor,
                  fontSize: "0.65rem",
                }}
              >
                ⌘K
              </kbd>
            </div>
          </form>

          <div className="flex items-center gap-1.5">
            <button
              className="md:hidden"
              style={btnBase}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="size-4" />
            </button>

            <div className="relative" ref={langDropdown.ref}>
              <button
                style={{ ...btnBase, gap: "4px", width: "auto", padding: "0 8px", fontSize: "0.72rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
                onClick={() => { langDropdown.setOpen(!langDropdown.open); themeDropdown.setOpen(false); }}
              >
                <span style={{ fontSize: "0.9rem" }}>{currentLang.flag}</span>
                <span className="hidden sm:inline" style={{ color: navText }}>{currentLang.native}</span>
              </button>

              {langDropdown.open && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden shadow-2xl z-50 py-1.5"
                  style={{
                    width: "188px",
                    background: popupBg,
                    border: `1px solid ${popupBorder}`,
                    boxShadow: isLight
                      ? "0 20px 60px rgba(0,0,0,0.15)"
                      : "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: labelColor, padding: "6px 14px 8px", fontFamily: "'Inter', sans-serif" }}>
                    Language
                  </p>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { changeLanguage(l.code); langDropdown.setOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 transition-all"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.82rem",
                        color: locale === l.code ? "#10b981" : itemText,
                        background: locale === l.code ? "rgba(16,185,129,0.1)" : "transparent",
                        margin: "0 6px",
                        width: "calc(100% - 12px)",
                        borderRadius: "10px",
                      }}
                      onMouseEnter={(e) => { if (locale !== l.code) e.currentTarget.style.background = itemHoverBg; }}
                      onMouseLeave={(e) => { if (locale !== l.code) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span style={{ fontSize: "1rem" }}>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {locale === l.code && <Check className="size-3 flex-shrink-0" style={{ color: "#10b981" }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={themeDropdown.ref}>
              <button
                style={btnBase}
                onClick={() => { themeDropdown.setOpen(!themeDropdown.open); langDropdown.setOpen(false); }}
                title="Theme"
              >
                <span style={{ color: theme === "dark" ? "#94a3b8" : theme === "light" ? "#f59e0b" : "#6b7280" }}>
                  {currentThemeIcon}
                </span>
              </button>

              {themeDropdown.open && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden shadow-2xl z-50 py-1.5"
                  style={{
                    width: "200px",
                    background: popupBg,
                    border: `1px solid ${popupBorder}`,
                    boxShadow: isLight
                      ? "0 20px 60px rgba(0,0,0,0.15)"
                      : "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: labelColor, padding: "6px 14px 8px", fontFamily: "'Inter', sans-serif" }}>
                    Appearance
                  </p>
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); themeDropdown.setOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 transition-all"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: theme === t.id ? "#10b981" : itemText,
                        background: theme === t.id ? "rgba(16,185,129,0.08)" : "transparent",
                        margin: "0 6px",
                        width: "calc(100% - 12px)",
                        borderRadius: "10px",
                      }}
                      onMouseEnter={(e) => { if (theme !== t.id) e.currentTarget.style.background = itemHoverBg; }}
                      onMouseLeave={(e) => { if (theme !== t.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{
                        width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: t.id === "dark" ? "#080c11" : t.id === "light" ? "#f8fafc" : "#1a1c22",
                        border: `1px solid ${theme === t.id ? "rgba(16,185,129,0.4)" : popupDivider}`,
                        color: t.id === "dark" ? "#94a3b8" : t.id === "light" ? "#f59e0b" : "#6b7280",
                        flexShrink: 0,
                        boxShadow: theme === t.id ? "0 0 8px rgba(16,185,129,0.2)" : "none",
                      }}>
                        {t.icon}
                      </span>
                      <div className="text-left">
                        <p style={{ fontSize: "0.82rem", fontWeight: theme === t.id ? 600 : 400 }}>{t.label}</p>
                        <p style={{ fontSize: "0.68rem", color: labelColor, marginTop: "1px" }}>{t.desc}</p>
                      </div>
                      {theme === t.id && <Check className="size-3 ml-auto flex-shrink-0" style={{ color: "#10b981" }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: "1px", height: "20px", background: isLight ? "rgba(0,0,0,0.1)" : "rgba(16,185,129,0.15)", margin: "0 2px" }} />

            {isLoggedIn && user ? (
              <div className="relative" ref={userDropdown.ref}>
                <button
                  onClick={() => { userDropdown.setOpen(!userDropdown.open); langDropdown.setOpen(false); themeDropdown.setOpen(false); }}
                  className="flex items-center gap-2 rounded-xl transition-all"
                  style={{ height: "34px", padding: "0 8px 0 4px", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(16,185,129,0.2)"}`, background: isLight ? "rgba(0,0,0,0.03)" : "rgba(16,185,129,0.06)" }}
                >
                  <img src={user.avatar} alt={user.username} className="size-6 rounded-lg object-cover" />
                  <span className="hidden sm:block text-xs font-medium max-w-[80px] truncate" style={{ fontFamily: "'Inter', sans-serif", color: isLight ? "#111827" : "#e2e8f0" }}>{user.username.split(" ")[0]}</span>
                </button>

                {userDropdown.open && (
                  <div
                    className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden shadow-2xl z-50 py-1.5"
                    style={{ width: "200px", background: popupBg, border: `1px solid ${popupBorder}`, boxShadow: isLight ? "0 20px 60px rgba(0,0,0,0.15)" : "0 20px 60px rgba(0,0,0,0.7)" }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: popupDivider }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: isLight ? "#111827" : "#f1f5f9" }}>{user.username}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: labelColor, marginTop: "2px" }}>{user.email}</p>
                    </div>
                    {[
                      { label: "Profile", icon: User, href: `/${locale}/profile` },
                      { label: "My Library", icon: Heart, href: `/${locale}/library` },
                      { label: "History", icon: Clock, href: `/${locale}/history` },
                      { label: "Settings", icon: Settings, href: `/${locale}/settings` },
                      ...(user.role === "admin" ? [{ label: "Admin Panel", icon: ShieldCheck, href: `/${locale}/admin` }] : []),
                    ].map(({ label, icon: Icon, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => userDropdown.setOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 transition-all"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: itemText, margin: "0 6px", borderRadius: "10px", display: "flex" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = itemHoverBg; e.currentTarget.style.color = label === "Admin Panel" ? "#10b981" : itemText; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = itemText; }}
                      >
                        <Icon className="size-3.5 flex-shrink-0" style={{ color: label === "Admin Panel" ? "#10b981" : undefined }} />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: popupDivider }}>
                      <button
                        onClick={() => { logout(); userDropdown.setOpen(false); router.push(`/${locale}`); }}
                        className="flex items-center gap-2.5 px-3 py-2 w-full transition-all"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#ef4444", margin: "0 6px", borderRadius: "10px", width: "calc(100% - 12px)", background: "transparent" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <LogOut className="size-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/signin`}
                className="flex items-center gap-1.5 rounded-xl text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  boxShadow: "0 0 20px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  height: "34px",
                  padding: "0 12px",
                  border: "1px solid rgba(52,211,153,0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 32px rgba(16,185,129,0.55), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 20px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
              >
                <LogIn className="size-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit}>
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 border"
                style={{ background: searchBg, borderColor: "rgba(16,185,129,0.3)", boxShadow: "0 0 0 3px rgba(16,185,129,0.1)" }}
              >
                <Search className="size-3.5 flex-shrink-0" style={{ color: "#10b981" }} />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search novels, authors..."
                  className="bg-transparent text-sm outline-none flex-1"
                  style={{ fontFamily: "'Inter', sans-serif", color: inputColor }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="size-3.5" style={{ color: placeholderColor }} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
