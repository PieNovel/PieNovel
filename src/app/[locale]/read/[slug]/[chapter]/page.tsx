import { ReaderPage } from "@/components/site/reader-page";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
    chapter: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale, slug, chapter } = await params;

  return <ReaderPage locale={locale} slug={slug} chapterNumber={chapter} />;
}
