import { PrismaClient } from "@prisma/client";
import { hash } from "crypto";

const prisma = new PrismaClient();

async function testAuth() {
  console.log("=== Testing Admin Authentication System ===\n");

  // Test 1: Verify database connection
  console.log("1. Testing database connection...");
  try {
    const novelCount = await prisma.novel.count();
    console.log(`   ✓ Database connected. ${novelCount} novels in DB.\n`);
  } catch (error) {
    console.error("   ✗ Database connection failed:", error);
    process.exit(1);
  }

  // Test 2: Verify session utility exists
  console.log("2. Testing session utilities...");
  try {
    const { getSession, requireAdmin } = await import("../src/lib/auth/session");
    console.log("   ✓ Session utilities imported successfully.\n");
  } catch (error) {
    console.error("   ✗ Session utilities import failed:", error);
    process.exit(1);
  }

  // Test 3: Verify middleware updated
  console.log("3. Testing middleware configuration...");
  const fs = await import("fs");
  const middleware = fs.readFileSync("src/middleware.ts", "utf-8");
  if (middleware.includes("pie-novel-session") && middleware.includes("/admin")) {
    console.log("   ✓ Middleware properly configured.\n");
  } else {
    console.error("   ✗ Middleware configuration incomplete.");
    process.exit(1);
  }

  // Test 4: Verify admin routes protected
  console.log("4. Testing admin route protection...");
  const adminRoute = fs.readFileSync("src/app/api/admin/uploads/cover/route.ts", "utf-8");
  if (adminRoute.includes("requireAdmin") && !adminRoute.includes("x-admin-upload-token")) {
    console.log("   ✓ Admin API routes use session-based auth.\n");
  } else {
    console.error("   ✗ Admin routes still using old token system.");
    process.exit(1);
  }

  // Test 5: Verify server actions protected
  console.log("5. Testing server action protection...");
  const actions = fs.readFileSync("src/app/[locale]/admin/novels/actions.ts", "utf-8");
  if (actions.includes("requireAdmin") && !actions.includes("adminToken")) {
    console.log("   ✓ Server actions use session-based auth.\n");
  } else {
    console.error("   ✗ Server actions still using old token system.");
    process.exit(1);
  }

  // Test 6: Verify auth context updated
  console.log("6. Testing auth context...");
  const authContext = fs.readFileSync("src/lib/site/auth-context.tsx", "utf-8");
  if (!authContext.includes("useState<AuthUser | null>(MOCK_USER)") && authContext.includes("useState<AuthUser | null>(null)")) {
    console.log("   ✓ Auth context no longer auto-logs in users.\n");
  } else {
    console.error("   ✗ Auth context still has auto-login mock.");
    process.exit(1);
  }

  // Test 7: Verify environment variables template
  console.log("7. Testing environment configuration...");
  const envExample = fs.readFileSync(".env.example", "utf-8");
  if (envExample.includes("SESSION_SECRET")) {
    console.log("   ✓ Environment template includes SESSION_SECRET.\n");
  } else {
    console.error("   ✗ Environment template missing SESSION_SECRET.");
    process.exit(1);
  }

  console.log("=== All Tests Passed! ===");
  console.log("\nTo test manually:");
  console.log("1. Add SESSION_SECRET to .env (min 32 chars)");
  console.log("2. Run: npm run dev");
  console.log("3. Access /en/admin - should redirect to /en/signin");
  console.log("4. Sign in with admin credentials");
  console.log("5. Access /en/admin - should work after login");
}

testAuth().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
