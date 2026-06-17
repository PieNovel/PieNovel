import Link from "next/link";
import type { ReactElement } from "react";

type SiteFooterProps = {
  locale: string;
};

export function SiteFooter({ locale }: SiteFooterProps): ReactElement {
  const links = ["About", "Terms", "Privacy", "Contact"];

  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--background)] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <Link className="text-lg font-black tracking-tight" href={`/${locale}`}>
          <span className="text-[var(--foreground)]">Pie</span>
          <span className="bg-gradient-to-r from-[var(--primary)] to-emerald-300 bg-clip-text text-transparent">
            Novel
          </span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-5 text-sm text-[var(--muted-foreground)]">
          {links.map((item) => (
            <Link className="transition hover:text-[var(--primary)]" href={`/${locale}`} key={item}>
              {item}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-[var(--muted-foreground)]">© 2026 Pie Novel.</p>
      </div>
    </footer>
  );
}
