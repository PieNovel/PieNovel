import { createPrismaClient } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    await requireAdmin();
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body: { title?: string; content?: string; number?: number } = await request.json();

    const prisma = createPrismaClient();

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!chapter) {
      return Response.json({ error: "Chapter not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (body.title !== undefined) {
      updateData.title = body.title;
    }

    if (body.content !== undefined) {
      updateData.content = body.content;
      updateData.wordCount = body.content.split(/\s+/).filter((w: string) => w.length > 0).length;
    }

    if (body.number !== undefined) {
      if (typeof body.number !== "number" || body.number < 1) {
        return Response.json({ error: "chapter number must be a positive integer" }, { status: 400 });
      }
      updateData.number = body.number;
    }

    const updated = await prisma.chapter.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ chapter: updated });
  } catch (error) {
    console.error("Error updating chapter:", error);
    return Response.json({ error: "Failed to update chapter" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    await requireAdmin();
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const prisma = createPrismaClient();

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      select: { id: true, novelId: true, number: true },
    });

    if (!chapter) {
      return Response.json({ error: "Chapter not found" }, { status: 404 });
    }

    await prisma.chapter.delete({ where: { id } });

    await prisma.novel.update({
      where: { id: chapter.novelId },
      data: { totalChapters: { decrement: 1 } },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return Response.json({ error: "Failed to delete chapter" }, { status: 500 });
  }
}
