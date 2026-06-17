import { LibraryPage } from "@/components/site/library-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <LibraryPage locale={locale} />;
}
