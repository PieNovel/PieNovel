import { catalogNovels } from "@/lib/site/mock-novels";


export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const genre = searchParams.get("genre");
  const status = searchParams.get("status");
  const search = searchParams.get("q");

  let results = [...catalogNovels];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
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

  const total = results.length;
  const offset = (page - 1) * limit;
  const paginated = results.slice(offset, offset + limit);

  return Response.json({
    novels: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
