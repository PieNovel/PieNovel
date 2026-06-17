import { HomePage } from "@/components/site/home-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
