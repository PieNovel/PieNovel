import Link from "next/link";

type NotFoundProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleNotFound({ params }: NotFoundProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-serif text-7xl font-black" style={{ color: "var(--primary)" }}>404</h1>
      <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>Page not found</p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href={`/${locale}`}
        className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
      >
        Go Home
      </Link>
    </div>
  );
}
