import { createPrismaClient } from "@/lib/prisma";
import { mapPrismaNovelsToSiteNovels } from "@/lib/site/novel-mapper";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");
    const search = searchParams.get("q");

    const prisma = createPrismaClient();

    const orConditions: any[] = [];

    if (search) {
      orConditions.push(
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { tags: { contains: `"${search.toLowerCase()}"`, mode: "insensitive" } },
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

    const total = await prisma.novel.count({ where: whereConditions });
    const offset = (page - 1) * limit;

    const prismaNovels = await prisma.novel.findMany({
      where: whereConditions,
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
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

    const novels = mapPrismaNovelsToSiteNovels(prismaNovels);

    return Response.json({
      novels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching novels:", error);
    return Response.json(
      { error: "Failed to fetch novels" },
      { status: 500 },
    );
  }
}
