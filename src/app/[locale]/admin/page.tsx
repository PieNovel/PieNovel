import { AdminDashboard } from "@/components/admin/admin-dashboard";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <AdminDashboard locale={locale} />;
}
