import { createPrismaClient } from "@/lib/prisma";
import { mapPrismaNovelToSiteNovel } from "@/lib/site/novel-mapper";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  try {
    const { slug } = await params;
    const prisma = createPrismaClient();

    const novel = await prisma.novel.findUnique({
      where: { slug },
      include: {
        chapters: {
          orderBy: { number: "desc" },
          take: 1,
          select: { number: true, title: true },
        },
      },
    });

    if (!novel) {
      return Response.json({ error: "Novel not found" }, { status: 404 });
    }

    const latestChapter =
      novel.chapters.length > 0 ? novel.chapters[0].title || `Ch. ${novel.chapters[0].number}` : undefined;

    const siteNovel = mapPrismaNovelToSiteNovel(novel, latestChapter);

    return Response.json(siteNovel);
  } catch (error) {
    console.error("Error fetching novel:", error);
    return Response.json(
      { error: "Failed to fetch novel" },
      { status: 500 },
    );
  }
}
