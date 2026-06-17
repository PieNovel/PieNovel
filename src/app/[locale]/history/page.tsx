import { HistoryPage } from "@/components/site/history-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <HistoryPage locale={locale} />;
}
