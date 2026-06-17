import { SettingsPage } from "@/components/site/settings-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <SettingsPage locale={locale} />;
}
