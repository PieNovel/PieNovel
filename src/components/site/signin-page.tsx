"use client";

import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

import { useAuth } from "@/lib/site/auth-context";

type SignInPageProps = {
  locale: string;
};

export function SignInPage({ locale }: SignInPageProps): ReactElement {
  const router = useRouter();
  const { fetchSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { error?: string; user?: { email: string; role: string } } = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      await fetchSession();
      router.push(`/${locale}`);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="inline-flex select-none items-baseline gap-0">
            <span className="font-serif text-[1.8rem] font-extrabold text-[var(--foreground)]">Pie</span>
            <span className="bg-gradient-to-r from-[var(--primary)] to-emerald-300 bg-clip-text font-serif text-[1.8rem] font-extrabold text-transparent">Novel</span>
          </Link>
          <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">Sign in to continue reading</p>
        </div>

        <div
          className="rounded-2xl border p-8"
          style={{
            background: "var(--card)",
            borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <h1 className="font-serif text-[1.4rem] font-bold text-[var(--foreground)]">Welcome back</h1>
          <p className="mb-7 text-[0.82rem] text-[var(--muted-foreground)]">Enter your credentials to access your account</p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all"
                  style={{ borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">Password</label>
                <a href="#" className="text-xs text-[var(--primary)]">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] py-2.5 pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition-all"
                  style={{ borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-4 text-[var(--muted-foreground)]" /> : <Eye className="size-4 text-[var(--muted-foreground)]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[0.88rem] font-semibold text-white transition-all"
              style={{
                background: loading ? "color-mix(in_srgb, var(--primary) 50%, transparent)" : "var(--primary)",
                boxShadow: loading ? "none" : "0 0 20px color-mix(in_srgb, var(--primary) 25%, transparent)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <LogIn className="size-4" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t pt-6 text-center" style={{ borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}>
            <p className="text-[0.82rem] text-[var(--muted-foreground)]">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-medium text-[var(--primary)]">Create one</a>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {[
            { label: "Continue with Google", icon: "G" },
            { label: "Continue with Discord", icon: "D" },
          ].map((s) => (
            <button
              key={s.label}
              className="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-[0.85rem] font-medium text-[var(--foreground)] transition-all"
              style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] text-[0.65rem] font-bold text-[var(--primary)]">
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
