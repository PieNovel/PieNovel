import { getCloudflareEnv } from "@/lib/cloudflare";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request): Promise<Response> {
  try {
    const body: { email?: string; password?: string } = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const env = getCloudflareEnv();

    const adminEmail = env.ADMIN_EMAIL;
    const adminPasswordHash = env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error("Admin credentials not configured");
      return Response.json(
        { error: "Authentication not configured" },
        { status: 503 },
      );
    }

    if (email !== adminEmail) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(password, adminPasswordHash);

    if (!isValidPassword) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    await setSession({
      userId: "admin",
      role: "admin",
      email: adminEmail,
    });

    return Response.json({
      user: { email: adminEmail, role: "admin" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder();

  // Derive key from password using PBKDF2 with a fixed salt
  // In production, use per-user random salts stored in the database
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode("pi3novel_admin_salt_v1"),
      iterations: 100000,
    },
    key,
    256
  );

  const derivedHash = Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  
  // Use timing-safe comparison
  return timingSafeEqual(derivedHash, hash);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
