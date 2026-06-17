import { ProfilePage } from "@/components/site/profile-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <ProfilePage locale={locale} />;
}
