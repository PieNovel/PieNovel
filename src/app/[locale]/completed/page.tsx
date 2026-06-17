import { CompletedPage } from "@/components/site/completed-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <CompletedPage locale={locale} />;
}
