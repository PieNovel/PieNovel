"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

type Theme = "dark" | "light" | "gray";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.classList.remove("dark", "light", "gray");
    document.documentElement.classList.add(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
