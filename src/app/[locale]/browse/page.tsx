import { BrowsePage } from "@/components/site/browse-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    genre?: string;
  }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;

  return <BrowsePage locale={locale} initialGenre={sp?.genre} />;
}
