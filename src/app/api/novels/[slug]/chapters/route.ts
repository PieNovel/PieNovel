import { createPrismaClient } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  try {
    const { slug } = await params;
    const prisma = createPrismaClient();

    const novel = await prisma.novel.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        totalChapters: true,
        chapters: {
          orderBy: { number: "desc" },
          take: 20,
          select: {
            id: true,
            number: true,
            title: true,
            wordCount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!novel) {
      return Response.json({ error: "Novel not found" }, { status: 404 });
    }

    const formatDate = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return "just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return "long time ago";
    };

    const chapters = novel.chapters.map((chapter) => ({
      id: chapter.id,
      number: chapter.number,
      title: chapter.title || `Ch. ${chapter.number}`,
      wordCount: chapter.wordCount || 0,
      publishedAt: formatDate(chapter.createdAt),
    }));

    return Response.json({
      novel: { title: novel.title, slug: novel.slug },
      chapters,
      total: novel.totalChapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return Response.json(
      { error: "Failed to fetch chapters" },
      { status: 500 },
    );
  }
}
