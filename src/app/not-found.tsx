import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: "var(--background)" }}>
      <h1 className="font-serif text-7xl font-black" style={{ color: "var(--primary)" }}>404</h1>
      <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>Page not found</p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/en"
        className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
      >
        Go Home
      </Link>
    </div>
  );
}
