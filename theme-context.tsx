"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Theme = "dark" | "light" | "gray";
export type Language = "en" | "id" | "jp" | "kr" | "zh";

interface ThemeContextValue {
  theme: Theme;
  language: Language;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  language: "en",
  setTheme: () => {},
  setLanguage: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
  initialLanguage?: Language;
};

export function ThemeProvider({ children, initialLanguage = "en" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.classList.remove("dark", "light", "gray");
    document.documentElement.classList.add(t);
  }, []);

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light", "gray");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, language, setTheme, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const THEME_STYLES: Record<Theme, {
  bg: string; surface: string; surfaceHover: string; text: string; subtext: string;
  muted: string; border: string; cardBg: string; sectionLabel: string; sectionTitle: string; pillInactive: string;
}> = {
  dark: {
    bg: "#07090D",
    surface: "rgba(13,17,23,0.8)",
    surfaceHover: "rgba(255,255,255,0.04)",
    text: "#f1f5f9",
    subtext: "#94a3b8",
    muted: "#475569",
    border: "rgba(255,255,255,0.06)",
    cardBg: "rgba(13,17,23,0.85)",
    sectionLabel: "#10b981",
    sectionTitle: "#ffffff",
    pillInactive: "rgba(255,255,255,0.07)",
  },
  light: {
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceHover: "rgba(0,0,0,0.03)",
    text: "#111827",
    subtext: "#6b7280",
    muted: "#9ca3af",
    border: "rgba(0,0,0,0.08)",
    cardBg: "#ffffff",
    sectionLabel: "#059669",
    sectionTitle: "#111827",
    pillInactive: "rgba(0,0,0,0.06)",
  },
  gray: {
    bg: "#1a1c22",
    surface: "rgba(30,32,38,0.9)",
    surfaceHover: "rgba(255,255,255,0.05)",
    text: "#e2e8f0",
    subtext: "#94a3b8",
    muted: "#64748b",
    border: "rgba(255,255,255,0.07)",
    cardBg: "rgba(30,32,38,0.9)",
    sectionLabel: "#10b981",
    sectionTitle: "#e2e8f0",
    pillInactive: "rgba(255,255,255,0.07)",
  },
};
