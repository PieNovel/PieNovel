import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("/admin")) {
    const sessionCookie = request.cookies.get("pie-novel-session");

    if (!sessionCookie) {
      const locale = pathname.split("/")[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
    }

    try {
      const secret = process.env.SESSION_SECRET;
      if (!secret) {
        throw new Error("SESSION_SECRET not configured");
      }

      const decrypted = await decryptSession(sessionCookie.value, secret);
      const session = JSON.parse(decrypted);

      if (session.role !== "admin" || session.expiresAt < Date.now()) {
        const locale = pathname.split("/")[1] || "en";
        return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
      }
    } catch {
      const locale = pathname.split("/")[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
    }
  }

  return intlMiddleware(request);
}

async function decryptSession(encrypted: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const combined = Buffer.from(encrypted, "base64");
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

export const config = {
  matcher: ["/", "/(en|id)/:path*"],
};
