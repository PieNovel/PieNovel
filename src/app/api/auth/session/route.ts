import { getSession } from "@/lib/auth/session";

export async function GET(): Promise<Response> {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ session: null });
    }

    return Response.json({
      session: {
        userId: session.userId,
        role: session.role,
        email: session.email,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return Response.json({ session: null });
  }
}
