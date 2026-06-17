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

  return Response.json(novel);
}
