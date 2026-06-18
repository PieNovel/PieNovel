import { createPrismaClient } from "@/lib/prisma";
import { mapPrismaNovelsToSiteNovels } from "@/lib/site/novel-mapper";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    const prisma = createPrismaClient();

    const orConditions: any[] = [];

    if (q) {
      orConditions.push(
        { title: { contains: q, mode: "insensitive" } },
        { author: { contains: q, mode: "insensitive" } },
        { tags: { contains: `"${q.toLowerCase()}"`, mode: "insensitive" } },
      );
    }

    if (genre && genre !== "All") {
      orConditions.push(
        { genre: { equals: genre, mode: "insensitive" } },
        { tags: { contains: `"${genre.toLowerCase()}"`, mode: "insensitive" } },
      );
    }

    const whereConditions: any = {};

    if (orConditions.length > 0) {
      whereConditions.OR = orConditions;
    }

    if (status) {
      whereConditions.status = status.toUpperCase();
    }

    const prismaNovels = await prisma.novel.findMany({
      where: whereConditions,
      orderBy: { ratingAverage: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        title: true,
        author: true,
        genre: true,
        type: true,
        description: true,
        coverUrl: true,
        bannerUrl: true,
        tags: true,
        status: true,
        views: true,
        ratingAverage: true,
        totalChapters: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const results = mapPrismaNovelsToSiteNovels(prismaNovels);

    return Response.json({
      results,
      total: results.length,
      query: q,
    });
  } catch (error) {
    console.error("Error searching novels:", error);
    return Response.json(
      { error: "Failed to search novels" },
      { status: 500 },
    );
  }
}
