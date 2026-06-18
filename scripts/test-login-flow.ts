import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testAuthFlow() {
  console.log("=== P0-04: Login Flow Integration Test ===\n");

  // Test 1: Database connection
  console.log("1. Database connection...");
  const novelCount = await prisma.novel.count();
  console.log(`   ✓ Database OK (${novelCount} novels)\n`);

  // Test 2: Verify login API exists
  console.log("2. Login API endpoint...");
  const fs = await import("fs");
  if (fs.existsSync("src/app/api/auth/login/route.ts")) {
    console.log("   ✓ Login API exists\n");
  } else {
    console.error("   ✗ Login API missing");
    process.exit(1);
  }

  // Test 3: Verify session API exists
  console.log("3. Session API endpoint...");
  if (fs.existsSync("src/app/api/auth/session/route.ts")) {
    console.log("   ✓ Session API exists\n");
  } else {
    console.error("   ✗ Session API missing");
    process.exit(1);
  }

  // Test 4: Verify logout API exists
  console.log("4. Logout API endpoint...");
  if (fs.existsSync("src/app/api/auth/logout/route.ts")) {
    console.log("   ✓ Logout API exists\n");
  } else {
    console.error("   ✗ Logout API missing");
    process.exit(1);
  }

  // Test 5: Verify auth context has fetchSession
  console.log("5. Auth context...");
  const authContext = fs.readFileSync("src/lib/site/auth-context.tsx", "utf-8");
  if (authContext.includes("fetchSession") && authContext.includes("/api/auth/session")) {
    console.log("   ✓ Auth context has fetchSession\n");
  } else {
    console.error("   ✗ Auth context missing fetchSession");
    process.exit(1);
  }

  // Test 6: Verify signin page uses real API
  console.log("6. Sign-in page...");
  const signinPage = fs.readFileSync("src/components/site/signin-page.tsx", "utf-8");
  if (signinPage.includes("/api/auth/login") && !signinPage.includes("setTimeout")) {
    console.log("   ✓ Sign-in page uses real API\n");
  } else {
    console.error("   ✗ Sign-in page still using mock");
    process.exit(1);
  }

  // Test 7: Verify env vars configured
  console.log("7. Environment variables...");
  const envExample = fs.readFileSync(".env.example", "utf-8");
  if (envExample.includes("ADMIN_EMAIL") && envExample.includes("ADMIN_PASSWORD_HASH")) {
    console.log("   ✓ Environment template has admin auth vars\n");
  } else {
    console.error("   ✗ Environment template incomplete");
    process.exit(1);
  }

  // Test 8: Verify env.d.ts has admin vars
  console.log("8. TypeScript env types...");
  const envDts = fs.readFileSync("src/env.d.ts", "utf-8");
  if (envDts.includes("ADMIN_EMAIL") && envDts.includes("ADMIN_PASSWORD_HASH")) {
    console.log("   ✓ TypeScript env types updated\n");
  } else {
    console.error("   ✗ TypeScript env types incomplete");
    process.exit(1);
  }

  console.log("=== All Tests Passed! ===");
  console.log("\nTo complete setup:");
  console.log("1. Add to .env:");
  console.log('   SESSION_SECRET="your-32-char-secret-here"');
  console.log('   ADMIN_EMAIL="admin@pienovel.com"');
  console.log('   ADMIN_PASSWORD_HASH="9cb8ff1a1dc9d359ec873a71e3b6e8ce2722bc9dca69b7f7e4e04beff9b4d061"');
  console.log("\n2. Run: npm run dev");
  console.log("\n3. Test login:");
  console.log("   - Email: admin@pienovel.com");
  console.log("   - Password: admin123");
}

testAuthFlow().catch(console.error);
