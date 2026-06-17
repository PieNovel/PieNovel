import { GenresPage } from "@/components/site/genres-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <GenresPage locale={locale} />;
}
