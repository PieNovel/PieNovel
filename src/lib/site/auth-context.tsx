"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  joinedAt: string;
  bio: string;
  totalRead: number;
  totalChapters: number;
}

export interface FavoriteEntry {
  novelId: number;
  addedAt: number;
}

export interface HistoryEntry {
  novelId: number;
  novelTitle: string;
  novelCover: string;
  chapterId: string;
  chapterTitle: string;
  progress: number;
  readAt: number;
}

export interface ReadingSettings {
  fontSize: number;
  fontFamily: "inter" | "georgia" | "merriweather";
  lineHeight: number;
  width: "narrow" | "medium" | "wide";
}

export interface NotificationSettings {
  newChapters: boolean;
  recommendations: boolean;
  newsletter: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  favorites: FavoriteEntry[];
  history: HistoryEntry[];
  readingSettings: ReadingSettings;
  notifSettings: NotificationSettings;
  fetchSession: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (novelId: number) => void;
  isFavorite: (novelId: number) => boolean;
  addHistory: (entry: Omit<HistoryEntry, "readAt">) => void;
  clearHistory: () => void;
  updateReadingSettings: (s: Partial<ReadingSettings>) => void;
  updateNotifSettings: (s: Partial<NotificationSettings>) => void;
}

const MOCK_USER: AuthUser = {
  id: "usr_001",
  username: "Aria Sinclair",
  email: "aria.sinclair@email.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format",
  role: "admin",
  joinedAt: "January 2024",
  bio: "Avid reader of cultivation novels and fantasy epics. Currently hooked on anything with system mechanics.",
  totalRead: 47,
  totalChapters: 8312,
};

const MOCK_HISTORY: HistoryEntry[] = [
  { novelId: 1, novelTitle: "Shadow Monarch's Ascension", novelCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&auto=format", chapterId: "542", chapterTitle: "Ch. 542: The Final Gate Opens", progress: 78, readAt: Date.now() - 3600000 },
  { novelId: 3, novelTitle: "Mystic Cultivation Chronicles", novelCover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop&auto=format", chapterId: "200", chapterTitle: "Ch. 200: Heaven's Will", progress: 45, readAt: Date.now() - 86400000 },
  { novelId: 5, novelTitle: "The Void Sorcerer", novelCover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop&auto=format", chapterId: "87", chapterTitle: "Ch. 87: The Dark Pact", progress: 100, readAt: Date.now() - 172800000 },
  { novelId: 2, novelTitle: "Celestial Emperor's Legacy", novelCover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop&auto=format", chapterId: "150", chapterTitle: "Ch. 150: Return of the Emperor", progress: 62, readAt: Date.now() - 259200000 },
  { novelId: 4, novelTitle: "Infinite Regression Chronicles", novelCover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=450&fit=crop&auto=format", chapterId: "310", chapterTitle: "Ch. 310: The Last Loop", progress: 33, readAt: Date.now() - 432000000 },
];

const MOCK_FAVORITES: FavoriteEntry[] = [
  { novelId: 1, addedAt: Date.now() - 604800000 },
  { novelId: 3, addedAt: Date.now() - 1209600000 },
  { novelId: 7, addedAt: Date.now() - 2592000000 },
];

const DEFAULT_READING: ReadingSettings = {
  fontSize: 17,
  fontFamily: "georgia",
  lineHeight: 1.8,
  width: "medium",
};

const DEFAULT_NOTIF: NotificationSettings = {
  newChapters: true,
  recommendations: false,
  newsletter: false,
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  favorites: [],
  history: [],
  readingSettings: DEFAULT_READING,
  notifSettings: DEFAULT_NOTIF,
  fetchSession: async () => {},
  logout: async () => {},
  toggleFavorite: () => {},
  isFavorite: () => false,
  addHistory: () => {},
  clearHistory: () => {},
  updateReadingSettings: () => {},
  updateNotifSettings: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(DEFAULT_READING);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(DEFAULT_NOTIF);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data: { session?: { userId: string; role: string; email: string } } = await res.json();

      if (data.session) {
        setUser({
          id: data.session.userId,
          username: data.session.email.split("@")[0],
          email: data.session.email,
          avatar: "",
          role: data.session.role as "user" | "admin",
          joinedAt: "",
          bio: "",
          totalRead: 0,
          totalChapters: 0,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const toggleFavorite = useCallback((novelId: number) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.novelId === novelId);
      if (exists) return prev.filter((f) => f.novelId !== novelId);
      return [...prev, { novelId, addedAt: Date.now() }];
    });
  }, []);

  const isFavorite = useCallback((novelId: number) => favorites.some((f) => f.novelId === novelId), [favorites]);

  const addHistory = useCallback((entry: Omit<HistoryEntry, "readAt">) => {
    setHistory((prev) => [{ ...entry, readAt: Date.now() }, ...prev.filter((h) => h.novelId !== entry.novelId)]);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const updateReadingSettings = useCallback((s: Partial<ReadingSettings>) => {
    setReadingSettings((prev) => ({ ...prev, ...s }));
  }, []);

  const updateNotifSettings = useCallback((s: Partial<NotificationSettings>) => {
    setNotifSettings((prev) => ({ ...prev, ...s }));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isLoading, favorites, history, readingSettings, notifSettings,
      fetchSession, logout, toggleFavorite, isFavorite, addHistory, clearHistory,
      updateReadingSettings, updateNotifSettings,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
