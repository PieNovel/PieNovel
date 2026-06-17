"use client";

import { BookMarked, BookOpen, Clock, Edit2, Heart, LogOut, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";

import { useAuth } from "@/lib/site/auth-context";

type ProfilePageProps = {
  locale: string;
};

export function ProfilePage({ locale }: ProfilePageProps): ReactElement {
  const router = useRouter();
  const { user, isLoggedIn, favorites, history, logout } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
        <BookOpen className="size-12 text-[var(--primary)]" />
        <p className="font-serif text-[1.4rem] font-bold text-[var(--foreground)]">You are not signed in</p>
        <button
          onClick={() => router.push(`/${locale}/signin`)}
          className="rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  const statCards = [
    { label: "Novels Read", value: user.totalRead, icon: BookOpen },
    { label: "Chapters Read", value: user.totalChapters.toLocaleString(), icon: BookMarked },
    { label: "In Library", value: favorites.length, icon: Heart },
    { label: "History Items", value: history.length, icon: Clock },
  ];

  const recentHistory = history.slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-56px)] py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div
          className="mb-6 overflow-hidden rounded-2xl border"
          style={{
            background: "var(--card)",
            borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="relative h-32 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-600">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #34d399 0%, transparent 60%), radial-gradient(circle at 80% 20%, #10b981 0%, transparent 50%)" }} />
            {user.role === "admin" && (
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold text-[var(--primary)]" style={{ background: "color-mix(in_srgb, var(--primary) 20%, transparent)", borderColor: "color-mix(in_srgb, var(--primary) 40%, transparent)" }}>
                <ShieldCheck className="size-3" />
                Admin
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <div className="relative -mt-14 mb-4 flex items-end justify-between">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="size-24 rounded-2xl border-4 object-cover"
                  style={{ borderColor: "var(--card)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                />
                <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2" style={{ background: "var(--primary)", borderColor: "var(--card)" }} />
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Link
                  href={`/${locale}/settings`}
                  className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-all"
                  style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)", background: "color-mix(in_srgb, var(--foreground) 4%, transparent)" }}
                >
                  <Edit2 className="size-3.5" />
                  Edit Profile
                </Link>
                <button
                  onClick={() => { logout(); router.push(`/${locale}`); }}
                  className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm text-red-400 transition-all"
                  style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}
                >
                  <LogOut className="size-3.5" />
                  Sign Out
                </button>
              </div>
            </div>

            <h1 className="font-serif text-[1.5rem] font-bold text-[var(--foreground)]">{user.username}</h1>
            <p className="mt-0.5 text-[0.8rem] text-[var(--muted-foreground)]">{user.email}</p>
            <p className="mt-2.5 text-[0.85rem] leading-relaxed text-[var(--muted-foreground)]">{user.bio}</p>
            <p className="mt-2 text-[0.75rem] text-[var(--muted-foreground)]">Member since {user.joinedAt}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-2 rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
              <Icon className="size-4 text-[var(--primary)]" />
              <p className="font-serif text-[1.4rem] font-bold text-[var(--foreground)]">{value}</p>
              <p className="text-[0.72rem] text-[var(--muted-foreground)]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "My Library", desc: "Saved novels & favorites", to: "library", icon: Heart, color: "#ec4899" },
            { label: "Reading History", desc: "Continue where you left off", to: "history", icon: Clock, color: "#f59e0b" },
            { label: "Settings", desc: "Preferences & notifications", to: "settings", icon: Settings, color: "var(--primary)" },
          ].map(({ label, desc, to, icon: Icon, color }) => (
            <Link
              key={to}
              href={`/${locale}/${to}`}
              className="flex items-center gap-3 rounded-2xl border p-4 transition-all"
              style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in_srgb, ${color} 10%, transparent)` }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <div>
                <p className="text-[0.85rem] font-semibold text-[var(--foreground)]">{label}</p>
                <p className="mt-0.5 text-[0.72rem] text-[var(--muted-foreground)]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {recentHistory.length > 0 && (
          <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-[1rem] font-bold text-[var(--foreground)]">Recent Reading</h2>
              <Link href={`/${locale}/history`} className="text-[0.75rem] text-[var(--primary)]">View all →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentHistory.map((entry) => (
                <Link
                  key={entry.novelId}
                  href={`/${locale}/novels/${entry.novelId}`}
                  className="flex items-center gap-3"
                >
                  <img src={entry.novelCover} alt={entry.novelTitle} className="size-12 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.85rem] font-medium text-[var(--foreground)]">{entry.novelTitle}</p>
                    <p className="mt-0.5 truncate text-[0.72rem] text-[var(--muted-foreground)]">{entry.chapterTitle}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}>
                        <div className="h-full rounded-full" style={{ width: `${entry.progress}%`, background: "linear-gradient(90deg,var(--primary),color-mix(in_srgb, var(--primary) 70%, white))" }} />
                      </div>
                      <span className="text-[0.65rem] text-[var(--muted-foreground)]">{entry.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
