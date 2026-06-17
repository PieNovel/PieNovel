import { Outlet } from "react-router";
import { Header } from "./components/header";
import { ThemeProvider, useTheme, THEME_STYLES } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

function Layout() {
  const { theme, language, setTheme, setLanguage } = useTheme();
  const ts = THEME_STYLES[theme];

  return (
    <div className="min-h-screen" style={{ background: ts.bg, transition: "background 0.3s" }}>
      <Header
        theme={theme}
        language={language}
        onThemeChange={setTheme}
        onLanguageChange={setLanguage}
      />
      <Outlet />
      <footer
        className="mt-20 py-10 relative overflow-hidden"
        style={{
          borderTop: `1px solid ${theme === "dark" ? "rgba(16,185,129,0.12)" : theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
          background: ts.bg,
          transition: "background 0.3s",
        }}
      >
        {/* Footer ambient glow */}
        {theme === "dark" && (
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.3) 30%, rgba(52,211,153,0.5) 50%, rgba(16,185,129,0.3) 70%, transparent 100%)" }}
          />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-0 select-none">
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.1rem", color: ts.text }}>Pie</span>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg,#10b981,#34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: theme === "dark" ? "drop-shadow(0 0 8px rgba(16,185,129,0.4))" : "none",
              }}>Novel</span>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-5" style={{ fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", color: ts.subtext }}>
              {["About", "Terms", "Privacy", "Contact", "DMCA"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-all"
                  style={{ color: ts.subtext }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#10b981"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = ts.subtext; }}
                >
                  {item}
                </a>
              ))}
            </div>
            <p style={{ fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", color: ts.subtext, opacity: 0.4 }}>© 2025 PieNovel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Root() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ThemeProvider>
  );
}
