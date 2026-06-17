import { NovelDetailPage } from "@/components/site/novel-detail-page";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  return <NovelDetailPage locale={locale} slug={slug} />;
}
