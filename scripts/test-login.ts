import { hash } from "crypto";

async function generatePasswordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = encoder.encode("pi3novel_admin_salt_v1");
  
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
      salt,
      iterations: 100000,
    },
    key,
    256
  );
  
  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function main() {
  const password = process.argv[2] || "admin123";
  
  const hash = await generatePasswordHash(password);
  
  console.log("Password Hash Generator for Pie Novel Admin");
  console.log("==========================================");
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log("");
  console.log("Add to your .env file:");
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
}

main().catch(console.error);
