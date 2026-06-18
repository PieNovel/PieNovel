import { createPrismaClient } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function GET(request: Request): Promise<Response> {
  try {
    await requireAdmin();
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get("novelId");
    const search = searchParams.get("q");

    const prisma = createPrismaClient();

    const whereConditions: any = {};

    if (novelId) {
      whereConditions.novelId = novelId;
    }

    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    const chapters = await prisma.chapter.findMany({
      where: whereConditions,
      orderBy: [{ novelId: "asc" }, { number: "desc" }],
      include: {
        novel: { select: { id: true, title: true, slug: true } },
      },
    });

    return Response.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return Response.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    await requireAdmin();
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }

  try {
    const body: { novelId?: string; number?: number; title?: string; content?: string } = await request.json();
    const { novelId, number, title, content } = body;

    if (!novelId || !number || !content) {
      return Response.json({ error: "novelId, number, and content are required" }, { status: 400 });
    }

    if (typeof number !== "number" || number < 1) {
      return Response.json({ error: "chapter number must be a positive integer" }, { status: 400 });
    }

    const prisma = createPrismaClient();

    const novel = await prisma.novel.findUnique({ where: { id: novelId } });
    if (!novel) {
      return Response.json({ error: "Novel not found" }, { status: 404 });
    }

    const existing = await prisma.chapter.findFirst({
      where: { novelId, number },
    });

    if (existing) {
      return Response.json({ error: "Chapter number already exists for this novel" }, { status: 409 });
    }

    const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;

    const chapter = await prisma.chapter.create({
      data: {
        novelId,
        number,
        title: title || `Ch. ${number}`,
        content,
        wordCount,
      },
    });

    await prisma.novel.update({
      where: { id: novelId },
      data: { totalChapters: { increment: 1 } },
    });

    return Response.json({ chapter }, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return Response.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}
