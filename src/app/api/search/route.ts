import { catalogNovels } from "@/lib/site/mock-novels";


export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre");
  const status = searchParams.get("status");

  let results = [...catalogNovels];

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.author.toLowerCase().includes(query) ||
        n.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  if (genre && genre !== "All") {
    results = results.filter(
      (n) =>
        n.genre.toLowerCase() === genre.toLowerCase() ||
        n.tags.some((t) => t.toLowerCase() === genre.toLowerCase()),
    );
  }

  if (status) {
    results = results.filter((n) => n.status === status.toUpperCase());
  }

  return Response.json({
    results,
    total: results.length,
    query: q,
  });
}
