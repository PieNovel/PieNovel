import { AdminLayout } from "@/components/admin/admin-layout";
import type { ReactNode } from "react";

type AdminRouteLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function AdminRouteLayout({
  children,
  params,
}: AdminRouteLayoutProps) {
  const { locale } = await params;

  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}
