import { createPrismaClient } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; chapter: string }> },
): Promise<Response> {
  try {
    const { slug, chapter: chapterParam } = await params;
    const chapterNumber = parseInt(chapterParam, 10);

    if (isNaN(chapterNumber) || chapterNumber < 1) {
      return Response.json({ error: "Invalid chapter number" }, { status: 400 });
    }

    const prisma = createPrismaClient();

    const novel = await prisma.novel.findUnique({
      where: { slug },
      select: { id: true, title: true, slug: true, totalChapters: true },
    });

    if (!novel) {
      return Response.json({ error: "Novel not found" }, { status: 404 });
    }

    const chapter = await prisma.chapter.findFirst({
      where: {
        novelId: novel.id,
        number: chapterNumber,
      },
      select: {
        id: true,
        number: true,
        title: true,
        content: true,
        wordCount: true,
        createdAt: true,
      },
    });

    if (!chapter) {
      return Response.json({ error: "Chapter not found" }, { status: 404 });
    }

    const prevChapter = await prisma.chapter.findFirst({
      where: {
        novelId: novel.id,
        number: { lt: chapterNumber },
      },
      orderBy: { number: "desc" },
      select: { number: true },
    });

    const nextChapter = await prisma.chapter.findFirst({
      where: {
        novelId: novel.id,
        number: { gt: chapterNumber },
      },
      orderBy: { number: "asc" },
      select: { number: true },
    });

    return Response.json({
      novel: { title: novel.title, slug: novel.slug },
      chapter: {
        id: chapter.id,
        number: chapter.number,
        title: chapter.title,
        content: chapter.content,
        wordCount: chapter.wordCount,
      },
      prevChapter: prevChapter?.number ?? null,
      nextChapter: nextChapter?.number ?? null,
      totalChapters: novel.totalChapters,
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return Response.json({ error: "Failed to fetch chapter" }, { status: 500 });
  }
}
