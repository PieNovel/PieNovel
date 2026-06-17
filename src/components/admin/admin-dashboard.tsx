"use client";

import Link from "next/link";
import { BookOpen, Users, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { ALL_NOVELS } from "@/lib/admin/mock-data";

const STATS = [
  { label: "Total Novels", value: "1,284", change: "+12 this week", icon: BookOpen, color: "#10b981" },
  { label: "Registered Users", value: "48,921", change: "+340 today", icon: Users, color: "#3b82f6" },
  { label: "Total Views", value: "9.2M", change: "+84k today", icon: Eye, color: "#f59e0b" },
  { label: "Active Readers", value: "6,712", change: "right now", icon: TrendingUp, color: "#ec4899" },
];

const RECENT_NOVELS = ALL_NOVELS.slice(0, 5);

const RECENT_ACTIVITY = [
  { action: "New chapter added", target: "Shadow Monarch's Ascension Ch. 543", time: "2m ago", type: "chapter" },
  { action: "Novel uploaded", target: "The Eternal Flame Path", time: "14m ago", type: "novel" },
  { action: "User registered", target: "reader_k2891", time: "23m ago", type: "user" },
  { action: "Novel completed", target: "Mystic Cultivation Chronicles", time: "1h ago", type: "status" },
  { action: "Chapter reported", target: "Celestial Emperor's Legacy Ch. 120", time: "2h ago", type: "report" },
];

const TYPE_COLORS: Record<string, string> = {
  chapter: "#10b981", novel: "#3b82f6", user: "#f59e0b", status: "#8b5cf6", report: "#ef4444",
};

export function AdminDashboard({ locale }: { locale: string }) {
  const completedCount = ALL_NOVELS.filter((n) => n.status === "completed").length;
  const ongoingCount = ALL_NOVELS.filter((n) => n.status === "ongoing").length;
  const hiatusCount = ALL_NOVELS.length - ongoingCount - completedCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--foreground)" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Welcome back. Here&apos;s what&apos;s happening on PieNovel.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: color + "18" }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <ArrowUpRight className="size-4 opacity-30" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--foreground)" }}>
              {value}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
            <p className="mt-1.5 text-xs font-medium" style={{ color }}>&uarr; {change}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Novel status breakdown */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="mb-4 font-serif text-base font-bold" style={{ color: "var(--foreground)" }}>Novel Status</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Ongoing", count: ongoingCount, color: "#f59e0b", pct: Math.round((ongoingCount / ALL_NOVELS.length) * 100) },
              { label: "Completed", count: completedCount, color: "#10b981", pct: Math.round((completedCount / ALL_NOVELS.length) * 100) },
              { label: "On Hiatus", count: hiatusCount, color: "#ef4444", pct: Math.round((hiatusCount / ALL_NOVELS.length) * 100) },
            ].map(({ label, count, color, pct }) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border p-5 lg:col-span-2" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="mb-4 font-serif text-base font-bold" style={{ color: "var(--foreground)" }}>Recent Activity</h2>
          <div className="flex flex-col gap-0">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3 border-b py-3 last:border-0" style={{ borderColor: "var(--border)" }}>
                <div className="size-2 flex-shrink-0 rounded-full" style={{ background: TYPE_COLORS[item.type] }} />
                <div className="min-w-0 flex-1">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.action}: </span>
                  <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{item.target}</span>
                </div>
                <span className="flex-shrink-0 text-xs" style={{ color: "color-mix(in_srgb, var(--muted-foreground) 70%, transparent)" }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent novels table */}
      <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-serif text-base font-bold" style={{ color: "var(--foreground)" }}>Recent Novels</h2>
          <Link href={`/${locale}/admin/novels`} className="text-xs" style={{ color: "var(--primary)" }}>
            View all &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Novel", "Author", "Chapters", "Views", "Status", "Updated"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "color-mix(in_srgb, var(--muted-foreground) 70%, transparent)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_NOVELS.map((novel) => (
                <tr key={novel.id} className="transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_2%,transparent)]" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={novel.coverUrl} alt={novel.title} className="size-9 flex-shrink-0 rounded-lg object-cover" />
                      <Link href={`/${locale}/novels/${novel.id}`} className="max-w-[180px] truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {novel.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{novel.author}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--foreground)" }}>{novel.chapters}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--foreground)" }}>{novel.views}</td>
                  <td className="px-5 py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs"
                      style={{
                        background: novel.status === "completed" ? "rgba(16,185,129,0.12)" : novel.status === "ongoing" ? "rgba(251,191,36,0.12)" : "rgba(239,68,68,0.12)",
                        color: novel.status === "completed" ? "#10b981" : novel.status === "ongoing" ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {novel.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{novel.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
