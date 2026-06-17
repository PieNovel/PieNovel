"use client";

import {
  BookOpen,
  Check,
  Languages,
  LogIn,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

type SiteHeaderProps = {
  locale: string;
};

const navigationItems = [
  { label: "Browse", href: "/browse" },
  { label: "Popular", href: "/popular" },
  { label: "Genres", href: "/genres" },
  { label: "Completed", href: "/completed" },
];

const locales = [
  { label: "English", value: "en" },
  { label: "Indonesia", value: "id" },
];

export function SiteHeader({ locale }: SiteHeaderProps): ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const localizedPath = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchValue.trim();
    router.push(query ? `/${locale}/search?q=${encodeURIComponent(query)}` : `/${locale}/search`);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="flex shrink-0 items-baseline text-xl font-black tracking-tight"
          href={`/${locale}`}
        >
          <span className="text-[var(--foreground)]">Pie</span>
          <span className="bg-gradient-to-r from-[var(--primary)] to-emerald-300 bg-clip-text text-transparent">
            Novel
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => {
            const href = localizedPath(item.href);
            const active = pathname === href;

            return (
              <Link
                className={
                  active
                    ? "rounded-md bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--primary)]"
                    : "rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                }
                href={href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form className="ml-auto hidden max-w-sm flex-1 md:block" onSubmit={handleSearchSubmit}>
          <label className="flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--input)] px-3 text-sm text-[var(--foreground)] ring-[var(--ring)] transition focus-within:ring-2">
            <Search className="size-4 text-[var(--muted-foreground)]" />
            <input
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search novels, authors..."
              type="search"
              value={searchValue}
            />
          </label>
        </form>

        <div className="relative">
          <button
            aria-expanded={languageOpen}
            aria-label="Change language"
            className="inline-flex size-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] transition hover:border-[var(--primary)]"
            onClick={() => setLanguageOpen((open) => !open)}
            type="button"
          >
            <Languages className="size-4" />
          </button>

          {languageOpen ? (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-[var(--border)] bg-[var(--popover)] p-1 text-[var(--popover-foreground)] shadow-2xl">
              {locales.map((item) => (
                <Link
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-[var(--accent)]"
                  href={`/${item.value}`}
                  key={item.value}
                  onClick={() => setLanguageOpen(false)}
                >
                  {item.label}
                  {locale === item.value ? <Check className="size-4 text-[var(--primary)]" /> : null}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <Link
          className="hidden h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 sm:inline-flex"
          href={`/${locale}/signin`}
        >
          <LogIn className="size-4" />
          Sign In
        </Link>

        <button
          aria-expanded={mobileOpen}
          aria-label="Open navigation"
          className="inline-flex size-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 md:hidden">
          <form className="mb-4" onSubmit={handleSearchSubmit}>
            <label className="flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--input)] px-3">
              <Search className="size-4 text-[var(--muted-foreground)]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search novels..."
                type="search"
                value={searchValue}
              />
            </label>
          </form>

          <nav className="grid gap-1">
            {navigationItems.map((item) => (
              <Link
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--accent)]"
                href={localizedPath(item.href)}
                key={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <BookOpen className="size-4 text-[var(--primary)]" />
                {item.label}
              </Link>
            ))}
            <Link
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--accent)]"
              href={`/${locale}/profile`}
              onClick={() => setMobileOpen(false)}
            >
              <User className="size-4 text-[var(--primary)]" />
              Profile
            </Link>
            <Link
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--accent)]"
              href={`/${locale}/settings`}
              onClick={() => setMobileOpen(false)}
            >
              <Settings className="size-4 text-[var(--primary)]" />
              Settings
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
