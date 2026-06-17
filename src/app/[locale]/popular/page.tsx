import { PopularPage } from "@/components/site/popular-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <PopularPage locale={locale} />;
}
