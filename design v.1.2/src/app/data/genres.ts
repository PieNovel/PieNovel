// DB mapping: genres table
// id           → genres.id
// name         → genres.name
// slug         → genres.slug
// description  → genres.description
// count        → COUNT(*) from novels JOIN novel_genres
// icon         → genres.icon (emoji)

export interface Genre {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  icon: string;
  color: string;
}

export const GENRES: Genre[] = [
  { id: 1, name: "Action", slug: "action", description: "High-octane battles, martial arts, and non-stop combat", count: 1842, icon: "⚔️", color: "#ef4444" },
  { id: 2, name: "Fantasy", slug: "fantasy", description: "Magical worlds, mythical creatures, and epic quests", count: 2341, icon: "🧙", color: "#8b5cf6" },
  { id: 3, name: "Romance", slug: "romance", description: "Love stories, relationships, and heartfelt emotions", count: 1560, icon: "💕", color: "#ec4899" },
  { id: 4, name: "Cultivation", slug: "cultivation", description: "Xianxia and wuxia — ascend through realms to immortality", count: 987, icon: "🌀", color: "#06b6d4" },
  { id: 5, name: "System", slug: "system", description: "Game-like mechanics, stat screens, and leveling up", count: 743, icon: "📊", color: "#10b981" },
  { id: 6, name: "Regression", slug: "regression", description: "Time loops, second chances, and reincarnation", count: 612, icon: "🔄", color: "#f59e0b" },
  { id: 7, name: "Sci-Fi", slug: "sci-fi", description: "Futuristic technology, space exploration, and AI", count: 489, icon: "🚀", color: "#3b82f6" },
  { id: 8, name: "Horror", slug: "horror", description: "Dark atmospheres, psychological terror, and the supernatural", count: 318, icon: "👻", color: "#6b7280" },
  { id: 9, name: "Slice of Life", slug: "slice-of-life", description: "Everyday moments, character growth, and peaceful arcs", count: 422, icon: "☕", color: "#a78bfa" },
  { id: 10, name: "Mecha", slug: "mecha", description: "Giant robots, piloted suits, and mechanical warfare", count: 201, icon: "🤖", color: "#64748b" },
  { id: 11, name: "Harem", slug: "harem", description: "Multiple romantic interests surrounding the protagonist", count: 534, icon: "🌸", color: "#f472b6" },
  { id: 12, name: "Mystery", slug: "mystery", description: "Puzzles, detective work, and unraveling hidden truths", count: 389, icon: "🔍", color: "#fbbf24" },
  { id: 13, name: "Comedy", slug: "comedy", description: "Light-hearted humor, parody, and feel-good stories", count: 287, icon: "😄", color: "#34d399" },
  { id: 14, name: "Tragedy", slug: "tragedy", description: "Emotional depth, sacrifice, and heart-wrenching stories", count: 156, icon: "🌧️", color: "#94a3b8" },
  { id: 15, name: "Historical", slug: "historical", description: "Ancient kingdoms, dynasties, and real-world history reimagined", count: 234, icon: "📜", color: "#d97706" },
  { id: 16, name: "Martial Arts", slug: "martial-arts", description: "Kung fu, sword arts, and the pursuit of physical mastery", count: 678, icon: "🥋", color: "#f97316" },
];
