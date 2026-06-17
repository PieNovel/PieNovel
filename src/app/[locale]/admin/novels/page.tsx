import { AdminNovels } from "@/components/admin/admin-novels";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <AdminNovels locale={locale} />;
}
