"use client";

import { AlertTriangle, BookOpen, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";

import { useAuth } from "@/lib/site/auth-context";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type HistoryPageProps = {
  locale: string;
};

export function HistoryPage({ locale }: HistoryPageProps): ReactElement {
  const router = useRouter();
  const { isLoggedIn, history, clearHistory } = useAuth();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
        <Clock className="size-12 text-[var(--primary)]" />
        <p className="font-serif text-[1.4rem] font-bold text-[var(--foreground)]">Sign in to see your history</p>
        <button onClick={() => router.push(`/${locale}/signin`)} className="rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[2rem] font-extrabold text-[var(--foreground)]">Reading History</h1>
            <p className="mt-1 text-[0.82rem] text-[var(--muted-foreground)]">{history.length} {history.length === 1 ? "entry" : "entries"}</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm text-red-400 transition-all"
              style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}
            >
              <Trash2 className="size-3.5" />
              Clear All
            </button>
          )}
        </div>

        {confirmClear && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border p-5" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-[0.88rem] font-semibold text-[var(--foreground)]">Clear all reading history?</p>
              <p className="mt-1 text-[0.78rem] text-[var(--muted-foreground)]">This action cannot be undone.</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => { clearHistory(); setConfirmClear(false); }}
                  className="rounded-xl bg-red-500 px-4 py-1.5 text-sm text-white"
                >
                  Clear History
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="rounded-xl border px-4 py-1.5 text-sm text-[var(--muted-foreground)]"
                  style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Clock className="size-14 opacity-20 text-[var(--muted-foreground)]" />
            <p className="font-serif text-[1.2rem] font-bold text-[var(--foreground)]">No reading history yet</p>
            <p className="text-[0.82rem] text-[var(--muted-foreground)]">Start reading to track your progress here.</p>
            <Link href={`/${locale}/browse`} className="rounded-xl bg-[var(--primary)] px-5 py-2 text-sm text-white">
              Browse Novels
            </Link>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((entry) => (
              <div
                key={`${entry.novelId}-${entry.readAt}`}
                className="group overflow-hidden rounded-2xl border"
                style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
              >
                <div className="flex items-center gap-4 p-4">
                  <Link href={`/${locale}/novels/${entry.novelId}`} className="shrink-0">
                    <img src={entry.novelCover} alt={entry.novelTitle} className="size-16 rounded-xl object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/${locale}/novels/${entry.novelId}`}>
                      <p className="truncate font-serif font-semibold text-[var(--foreground)]">{entry.novelTitle}</p>
                    </Link>
                    <p className="mt-0.5 truncate text-[0.78rem] text-[var(--muted-foreground)]">{entry.chapterTitle}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${entry.progress}%`,
                            background: entry.progress === 100
                              ? "linear-gradient(90deg,var(--primary),color-mix(in_srgb, var(--primary) 70%, white))"
                              : "linear-gradient(90deg,#f59e0b,#fbbf24)",
                          }}
                        />
                      </div>
                      <span className="shrink-0 text-[0.65rem] text-[var(--muted-foreground)]">
                        {entry.progress === 100 ? "\u2713 Done" : `${entry.progress}%`}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[0.7rem] text-[var(--muted-foreground)]">{timeAgo(entry.readAt)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/read/${entry.novelId}/${entry.chapterId}`}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all"
                  >
                    <BookOpen className="size-3.5" />
                    {entry.progress === 100 ? "Reread" : "Continue"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
