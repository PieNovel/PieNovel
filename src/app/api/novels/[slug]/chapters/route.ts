import { catalogNovels } from "@/lib/site/mock-novels";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const novel = catalogNovels.find((n) => n.slug === slug);

  if (!novel) {
    return Response.json({ error: "Novel not found" }, { status: 404 });
  }

  const chapters = Array.from({ length: Math.min(novel.chapters, 20) }, (_, i) => ({
    id: `${novel.id}-ch${novel.chapters - i}`,
    number: novel.chapters - i,
    title: `Ch. ${novel.chapters - i}: Chapter ${novel.chapters - i}`,
    wordCount: Math.floor(Math.random() * 3000) + 2000,
    publishedAt: `${i === 0 ? "2h" : i === 1 ? "1d" : i + "d"} ago`,
  }));

  return Response.json({
    novel: { title: novel.title, slug: novel.slug },
    chapters,
    total: novel.chapters,
  });
}
