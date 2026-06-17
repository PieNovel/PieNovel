"use client";

import { Check, Coffee, Copy, ExternalLink, Gift, Heart, Star, Zap } from "lucide-react";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";

const TIERS = [
  {
    id: "coffee",
    icon: Coffee,
    name: "Buy a Coffee",
    amount: "$3",
    color: "#f59e0b",
    desc: "Keep the server lights on for a day.",
    perks: ["Supporter badge on profile", "Our eternal gratitude ☕"],
  },
  {
    id: "reader",
    icon: Star,
    name: "True Reader",
    amount: "$10",
    color: "var(--primary)",
    desc: "Help us add more novels every month.",
    perks: ["All Coffee perks", "Priority novel requests", "Early access to new features"],
    featured: true,
  },
  {
    id: "patron",
    icon: Zap,
    name: "Super Patron",
    amount: "$25",
    color: "#818cf8",
    desc: "You're basically running this place.",
    perks: ["All Reader perks", "Name in credits", "Direct line to dev team", "Exclusive Discord role"],
  },
];

const RECENT_SUPPORTERS = [
  { name: "Ari***", amount: "$10", time: "2 hours ago" },
  { name: "Min***", amount: "$3", time: "5 hours ago" },
  { name: "Wei***", amount: "$25", time: "1 day ago" },
  { name: "Seo***", amount: "$10", time: "2 days ago" },
  { name: "Kang**", amount: "$3", time: "3 days ago" },
];

export function DonationPage(): ReactElement {
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState("reader");

  function copyAddress() {
    navigator.clipboard.writeText("pienovel@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <Heart className="size-7 fill-red-500 text-red-500" />
        </div>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-[var(--foreground)]">
          Support PieNovel
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-[0.95rem] leading-relaxed text-[var(--muted-foreground)]">
          PieNovel is free and ad-supported, but your donations help us grow, add more novels, and keep everything running without paywalls.
        </p>
      </div>

      <AdSlot className="mb-10" />

      <div className="mb-10 grid grid-cols-3 gap-4">
        {[
          { label: "Novels Hosted", value: "12+" },
          { label: "Monthly Readers", value: "48K" },
          { label: "Supporters", value: "312" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border p-5 text-center" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 7%, transparent)" }}>
            <p className="font-serif text-[1.8rem] font-extrabold leading-none text-[var(--primary)]">{s.value}</p>
            <p className="mt-1 text-[0.75rem] text-[var(--muted-foreground)]">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-5 font-serif text-[1.25rem] font-bold text-[var(--foreground)]">Choose your support</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const active = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className="relative rounded-2xl border p-5 text-left transition-all"
              style={{
                background: active ? `color-mix(in_srgb, ${tier.color} 10%, transparent)` : "var(--card)",
                borderColor: active ? tier.color : "color-mix(in_srgb, var(--foreground) 7%, transparent)",
                boxShadow: active ? `0 0 0 1px ${tier.color}` : "none",
              }}
            >
              {tier.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white">
                  MOST POPULAR
                </span>
              )}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl border" style={{ background: `color-mix(in_srgb, ${tier.color} 10%, transparent)`, borderColor: tier.color }}>
                  <Icon className="size-5" style={{ color: tier.color }} />
                </div>
                <span className="font-serif text-[1.4rem] font-extrabold" style={{ color: tier.color }}>{tier.amount}</span>
              </div>
              <p className="mb-1 text-[0.9rem] font-bold text-[var(--foreground)]">{tier.name}</p>
              <p className="mb-3 text-[0.78rem] leading-relaxed text-[var(--muted-foreground)]">{tier.desc}</p>
              <ul className="space-y-1.5">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[0.75rem] text-[var(--muted-foreground)]">
                    <Check className="mt-0.5 size-3 shrink-0" style={{ color: tier.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mb-10 flex flex-col items-center gap-4 rounded-2xl border p-6 sm:flex-row" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 7%, transparent)" }}>
        <div className="flex-1">
          <p className="font-serif text-[1.05rem] font-bold text-[var(--foreground)]">Ready to support?</p>
          <p className="text-[0.8rem] text-[var(--muted-foreground)]">Choose your preferred platform below. Every donation, big or small, makes a real difference.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a
            href="#"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-[0.85rem] font-semibold text-white no-underline transition-all"
          >
            <Coffee className="size-4" /> Ko-fi
            <ExternalLink className="size-3 opacity-70" />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-[0.85rem] font-semibold text-white no-underline transition-all"
          >
            <Gift className="size-4" /> Trakteer
            <ExternalLink className="size-3 opacity-70" />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[0.85rem] font-semibold text-[var(--primary)] no-underline transition-all"
            style={{ borderColor: "color-mix(in_srgb, var(--primary) 30%, transparent)", background: "color-mix(in_srgb, var(--primary) 7%, transparent)" }}
          >
            PayPal
            <ExternalLink className="size-3 opacity-70" />
          </a>
        </div>
      </div>

      <AdSlot className="mb-10" />

      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 7%, transparent)" }}>
          <h3 className="mb-4 font-serif text-[1rem] font-bold text-[var(--foreground)]">Recent Supporters</h3>
          <div className="space-y-3">
            {RECENT_SUPPORTERS.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full" style={{ background: "color-mix(in_srgb, var(--primary) 12%, transparent)" }}>
                    <Heart className="size-3 fill-[var(--primary)] text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[0.82rem] font-semibold text-[var(--foreground)]">{s.name}</p>
                    <p className="text-[0.68rem] text-[var(--muted-foreground)]">{s.time}</p>
                  </div>
                </div>
                <span className="font-serif text-[0.9rem] font-bold text-[var(--primary)]">{s.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 7%, transparent)" }}>
          <h3 className="mb-4 font-serif text-[1rem] font-bold text-[var(--foreground)]">Other Ways to Help</h3>
          <div className="space-y-3">
            {[
              { icon: Star, label: "Leave a review", desc: "Rate novels you've read to help others discover them." },
              { icon: ExternalLink, label: "Share PieNovel", desc: "Tell your friends — word of mouth is everything." },
              { icon: Gift, label: "Direct transfer", desc: "Prefer bank transfer? Email us for details." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border" style={{ background: "color-mix(in_srgb, var(--primary) 8%, transparent)", borderColor: "color-mix(in_srgb, var(--primary) 15%, transparent)" }}>
                    <Icon className="size-3.5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[0.82rem] font-semibold text-[var(--foreground)]">{item.label}</p>
                    <p className="text-[0.73rem] leading-relaxed text-[var(--muted-foreground)]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition-opacity hover:opacity-70"
            style={{ borderColor: "color-mix(in_srgb, var(--foreground) 7%, transparent)", background: "color-mix(in_srgb, var(--foreground) 2%, transparent)" }}
            onClick={copyAddress}
          >
            <span className="flex-1 text-[0.78rem] text-[var(--muted-foreground)]">pienovel@example.com</span>
            {copied ? <Check className="size-3.5 text-[var(--primary)]" /> : <Copy className="size-3.5 text-[var(--muted-foreground)]" />}
          </div>
        </div>
      </div>

      <AdSlot />
    </main>
  );
}
