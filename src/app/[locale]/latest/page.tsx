import { LatestUpdatesPage } from "@/components/site/latest-updates-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <LatestUpdatesPage locale={locale} />;
}
