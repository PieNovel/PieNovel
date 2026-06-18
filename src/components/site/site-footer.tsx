"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { useTheme, THEME_STYLES } from "@/lib/site/theme-context";

type SiteFooterProps = {
  locale: string;
};

export function SiteFooter({ locale }: SiteFooterProps): ReactElement {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];

  return (
    <footer
      className="mt-20 py-10 relative overflow-hidden"
      style={{
        borderTop: `1px solid ${theme === "dark" ? "rgba(16,185,129,0.12)" : theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
        background: ts.bg,
        transition: "background 0.3s",
      }}
    >
      {theme === "dark" && (
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.3) 30%, rgba(52,211,153,0.5) 50%, rgba(16,185,129,0.3) 70%, transparent 100%)" }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-0 select-none">
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
          </Link>
          <div className="flex items-center flex-wrap justify-center gap-5" style={{ fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", color: ts.subtext }}>
            {["About", "Terms", "Privacy", "Contact", "DMCA"].map((item) => (
              <Link
                key={item}
                href={`/${locale}`}
                className="transition-all hover:text-[#10b981]"
                style={{ color: ts.subtext }}
              >
                {item}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", color: ts.subtext, opacity: 0.4 }}>© 2026 PieNovel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
