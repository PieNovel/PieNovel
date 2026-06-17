export interface Novel {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  chapters: number;
  views: string;
  status: "ongoing" | "completed" | "hiatus";
  type: "chinese" | "korean" | "japanese" | "english";
  latestChapter: string;
  coverUrl: string;
  tags: string[];
  description: string;
  updatedAt: string;
  addedAt: number;
}

export const ALL_NOVELS: Novel[] = [
  { id: 1, title: "Shadow Monarch's Ascension", author: "Lee Sung-woo", genre: "Action", rating: 4.9, chapters: 542, views: "12.4M", status: "ongoing", type: "korean", latestChapter: "Ch. 542: The Final Gate Opens", coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&auto=format", tags: ["Action", "Fantasy", "Op MC", "System", "Manhwa"], description: "Sung Jin-Woo, the weakest hunter of all mankind, finds himself trapped in a deadly double dungeon.", updatedAt: "2 hours ago", addedAt: 1700000001 },
  { id: 2, title: "Celestial Emperor's Legacy", author: "Wang Xiao", genre: "Fantasy", rating: 4.7, chapters: 328, views: "8.1M", status: "ongoing", type: "chinese", latestChapter: "Ch. 328: Ascension to the Heavens", coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop&auto=format", tags: ["Xianxia", "Cultivation", "Rebirth", "Emperor"], description: "A fallen emperor is reborn with memories of his past life.", updatedAt: "5 hours ago", addedAt: 1700000005 },
  { id: 3, title: "Mystic Cultivation Chronicles", author: "Chen Wei", genre: "Cultivation", rating: 4.9, chapters: 612, views: "15.2M", status: "ongoing", type: "chinese", latestChapter: "Ch. 612: The Dao of Immortality", coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=450&fit=crop&auto=format", tags: ["Wuxia", "Immortality", "Martial Arts", "Adventure"], description: "An orphan with blocked meridians stumbles upon an ancient jade slip.", updatedAt: "1 day ago", addedAt: 1700000010 },
  { id: 4, title: "Infinite Regression Chronicles", author: "Park Ji-hun", genre: "Regression", rating: 4.8, chapters: 412, views: "9.7M", status: "ongoing", type: "korean", latestChapter: "Ch. 412: The Last Loop", coverUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=450&fit=crop&auto=format", tags: ["Regression", "Time Loop", "Apocalypse", "Op MC"], description: "Every time he dies, the world resets.", updatedAt: "3 hours ago", addedAt: 1700000003 },
  { id: 5, title: "The Void Sorcerer", author: "Kang Min-jun", genre: "Dark Fantasy", rating: 4.6, chapters: 287, views: "5.3M", status: "ongoing", type: "korean", latestChapter: "Ch. 287: Into the Abyss", coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop&auto=format", tags: ["Dark Fantasy", "Magic", "Antihero", "Political"], description: "Condemned for a crime he didn't commit.", updatedAt: "6 hours ago", addedAt: 1700000006 },
  { id: 6, title: "Void Emperor's Decree", author: "Park Ji-hun", genre: "Action", rating: 4.5, chapters: 214, views: "4.1M", status: "ongoing", type: "korean", latestChapter: "Ch. 214: Battle at the Edge of Reality", coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=450&fit=crop&auto=format", tags: ["Action", "System", "Dungeon", "Revenge"], description: "Betrayed by the empire he served.", updatedAt: "8 hours ago", addedAt: 1700000008 },
  { id: 7, title: "Eternal Sakura Reborn", author: "Aiko Tanaka", genre: "Romance", rating: 4.8, chapters: 195, views: "6.7M", status: "completed", type: "japanese", latestChapter: "Ch. 195: Forever Begins", coverUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=450&fit=crop&auto=format", tags: ["Romance", "Isekai", "Reincarnation", "Shoujo"], description: "A modern woman wakes up as the villainess.", updatedAt: "2 days ago", addedAt: 1700000020 },
  { id: 8, title: "Iron Blood Mercenary", author: "Zhao Fang", genre: "Action", rating: 4.4, chapters: 389, views: "3.8M", status: "completed", type: "chinese", latestChapter: "Ch. 389: Last Contract", coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop&auto=format", tags: ["Action", "Wuxia", "Adventure", "Brotherhood"], description: "A retired war veteran takes one final mercenary job.", updatedAt: "3 days ago", addedAt: 1700000030 },
  { id: 9, title: "The Dragon Empress", author: "Mei Ling", genre: "Fantasy", rating: 4.7, chapters: 445, views: "7.9M", status: "completed", type: "chinese", latestChapter: "Ch. 445: The Eternal Flame", coverUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=450&fit=crop&auto=format", tags: ["Fantasy", "Female Lead", "Dragons", "Political"], description: "Born with dragon blood in a world that fears her kind.", updatedAt: "1 week ago", addedAt: 1700000040 },
  { id: 10, title: "System Override", author: "Kim Dae-jung", genre: "Sci-Fi", rating: 4.6, chapters: 278, views: "4.5M", status: "ongoing", type: "korean", latestChapter: "Ch. 278: Hack the World", coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=450&fit=crop&auto=format", tags: ["Sci-Fi", "System", "Cyberpunk", "Hacker"], description: "When a rogue AI grants him admin-level access.", updatedAt: "4 hours ago", addedAt: 1700000004 },
  { id: 11, title: "Moonlit Villainess", author: "Seo Yuna", genre: "Romance", rating: 4.5, chapters: 163, views: "3.2M", status: "ongoing", type: "korean", latestChapter: "Ch. 163: The Duke's Offer", coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop&auto=format", tags: ["Romance", "Villainess", "Isekai", "Slow Burn"], description: "Transmigrated into the body of a noble villainess.", updatedAt: "12 hours ago", addedAt: 1700000012 },
  { id: 12, title: "Abyss Walker", author: "Ryu Hajime", genre: "Horror", rating: 4.3, chapters: 201, views: "2.6M", status: "hiatus", type: "japanese", latestChapter: "Ch. 201: What Lurks Below", coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=450&fit=crop&auto=format", tags: ["Horror", "Mystery", "Psychological", "Dark"], description: "A detective who can see the dead.", updatedAt: "3 weeks ago", addedAt: 1700000050 },
];

export const GENRES = [
  "All", "Action", "Fantasy", "Romance", "Cultivation", "Regression",
  "System", "Isekai", "Horror", "Mystery", "Sci-Fi", "Dark Fantasy", "Xianxia", "Wuxia",
];

export interface UserRow {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: "user" | "admin" | "moderator";
  status: "active" | "banned" | "inactive";
  joinedAt: string;
  totalRead: number;
  lastActive: string;
}

export const MOCK_USERS: UserRow[] = [
  { id: "u001", username: "Aria Sinclair", email: "aria.sinclair@email.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop", role: "admin", status: "active", joinedAt: "Jan 2024", totalRead: 47, lastActive: "Just now" },
  { id: "u002", username: "kai_reader", email: "kai@mail.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Mar 2024", totalRead: 23, lastActive: "2h ago" },
  { id: "u003", username: "novel_addict_99", email: "ninetyni@gmail.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Feb 2024", totalRead: 89, lastActive: "5h ago" },
  { id: "u004", username: "xianxia_fan", email: "xfan@webnovel.net", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", role: "moderator", status: "active", joinedAt: "Dec 2023", totalRead: 312, lastActive: "1d ago" },
  { id: "u005", username: "spam_bot_2024", email: "spam@fake.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop", role: "user", status: "banned", joinedAt: "Apr 2024", totalRead: 0, lastActive: "3d ago" },
  { id: "u006", username: "readerZ", email: "readerz@yahoo.com", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop", role: "user", status: "inactive", joinedAt: "Nov 2023", totalRead: 5, lastActive: "30d ago" },
  { id: "u007", username: "cultivator_mk", email: "mk.cult@gmail.com", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Jan 2024", totalRead: 156, lastActive: "4h ago" },
  { id: "u008", username: "fantasy_luna", email: "luna@fant.io", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Feb 2024", totalRead: 74, lastActive: "12h ago" },
];

export interface Chapter {
  id: number;
  novelId: number;
  number: number;
  title: string;
  wordCount: number;
  publishedAt: string;
  status: "published" | "draft";
}

export const MOCK_CHAPTERS: Chapter[] = ALL_NOVELS.slice(0, 5).flatMap((novel) =>
  Array.from({ length: 5 }, (_, i) => ({
    id: novel.id * 100 + i,
    novelId: novel.id,
    number: novel.chapters - i,
    title: `Ch. ${novel.chapters - i}: ${["The Awakening", "Dark Descent", "Hidden Power", "Breaking Limits", "Final Form"][i]}`,
    wordCount: Math.floor(Math.random() * 3000) + 2000,
    publishedAt: `${i === 0 ? "2h" : i === 1 ? "1d" : i + "d"} ago`,
    status: (i === 0 ? "draft" : "published") as "published" | "draft",
  }))
);
