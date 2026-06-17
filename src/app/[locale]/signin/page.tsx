import { SignInPage } from "@/components/site/signin-page";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <SignInPage locale={locale} />;
}
