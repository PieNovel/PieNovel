import { AdminChapters } from "@/components/admin/admin-chapters";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <AdminChapters locale={locale} />;
}
