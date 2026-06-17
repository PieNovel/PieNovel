import { Suspense } from "react";
import { SearchPage } from "@/components/site/search-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-56px)] items-center justify-center text-[var(--muted-foreground)]">Loading search...</div>}>
      <SearchPage locale={locale} />
    </Suspense>
  );
}
