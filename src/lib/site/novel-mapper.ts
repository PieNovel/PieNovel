export type SiteNovel = {
  id: string;
  slug: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  chapters: number;
  views: string;
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  type: "chinese" | "korean" | "japanese" | "english";
  latestChapter: string;
  coverUrl: string;
  bannerUrl: string;
  tags: string[];
  description: string;
  updatedAt: string;
  addedAt: number;
};

export type NovelFromDB = {
  id: string;
  slug: string;
  title: string;
  author: string;
  genre: string;
  type: string;
  description: string | null;
  coverUrl: string | null;
  bannerUrl: string | null;
  tags: string;
  status: string;
  views: number;
  ratingAverage: number;
  totalChapters: number;
  createdAt: Date;
  updatedAt: Date;
  chapters?: Array<{ number: number; title?: string | null }>;
  reviews?: Array<{ rating: number }>;
};

export function mapPrismaNovelToSiteNovel(
  prismaNovel: NovelFromDB,
  latestChapter?: string
): SiteNovel {
  // Parse tags JSON string
  let tags: string[] = [];
  try {
    tags = JSON.parse(prismaNovel.tags || "[]");
  } catch {
    tags = [];
  }

  // Format views as string (e.g., 12400000 → "12.4M")
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Format date relative (simplified)
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return "long time ago";
  };

  // Determine latest chapter
  const latestChapterString =
    latestChapter ||
    (prismaNovel.chapters && prismaNovel.chapters.length > 0
      ? `Ch. ${Math.max(...prismaNovel.chapters.map((c) => c.number))}: Latest Chapter`
      : `Ch. ${prismaNovel.totalChapters}: Latest Chapter`);

  return {
    id: prismaNovel.id,
    slug: prismaNovel.slug,
    title: prismaNovel.title,
    author: prismaNovel.author,
    genre: prismaNovel.genre || "Unknown",
    rating: prismaNovel.ratingAverage || 0.0,
    chapters: prismaNovel.totalChapters || 0,
    views: formatViews(prismaNovel.views || 0),
    status: prismaNovel.status as "ONGOING" | "COMPLETED" | "HIATUS",
    type: (prismaNovel.type || "chinese") as
      | "chinese"
      | "korean"
      | "japanese"
      | "english",
    latestChapter: latestChapterString,
    coverUrl: prismaNovel.coverUrl || "",
    bannerUrl: prismaNovel.bannerUrl || "",
    tags: tags,
    description: prismaNovel.description || "",
    updatedAt: formatDate(prismaNovel.updatedAt),
    addedAt: prismaNovel.createdAt.getTime(),
  };
}

export function mapPrismaNovelsToSiteNovels(
  prismaNovels: NovelFromDB[],
  latestChapters?: Record<string, string>
): SiteNovel[] {
  return prismaNovels.map((novel) =>
    mapPrismaNovelToSiteNovel(novel, latestChapters?.[novel.slug])
  );
}
