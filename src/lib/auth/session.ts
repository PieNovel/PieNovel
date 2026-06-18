import { cookies } from "next/headers";

export interface Session {
  userId: string;
  role: "user" | "admin";
  email: string;
  expiresAt: number;
}

const SESSION_COOKIE_NAME = "pie-novel-session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function getSessionSecret(): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

async function encrypt(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return Buffer.from(combined).toString("base64");
}

async function decrypt(encrypted: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret.padEnd(32, "0").slice(0, 32)),
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

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const secret = await getSessionSecret();
    const decrypted = await decrypt(sessionCookie.value, secret);
    const session: Session = JSON.parse(decrypted);

    if (session.expiresAt < Date.now()) {
      await deleteSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function setSession(session: Omit<Session, "expiresAt">): Promise<void> {
  const secret = await getSessionSecret();
  const sessionWithExpiry: Session = {
    ...session,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  const encrypted = await encrypt(JSON.stringify(sessionWithExpiry), secret);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAdmin(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Error("Authentication required");
  }

  if (session.role !== "admin") {
    throw new Error("Admin access required");
  }

  return session;
}
