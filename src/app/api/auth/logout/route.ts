import { deleteSession } from "@/lib/auth/session";

export async function POST(): Promise<Response> {
  try {
    await deleteSession();
    return Response.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
