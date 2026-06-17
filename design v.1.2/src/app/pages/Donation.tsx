import { Heart, Coffee, Star, Zap, Gift, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";

const TIERS = [
  {
    id: "coffee",
    icon: Coffee,
    name: "Buy a Coffee",
    amount: "$3",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    desc: "Keep the server lights on for a day.",
    perks: ["Supporter badge on profile", "Our eternal gratitude ☕"],
  },
  {
    id: "reader",
    icon: Star,
    name: "True Reader",
    amount: "$10",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.35)",
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
    bg: "rgba(129,140,248,0.1)",
    border: "rgba(129,140,248,0.25)",
    desc: "You're basically running this place.",
    perks: ["All Reader perks", "Name in credits", "Direct line to dev team", "Exclusive Discord role"],
  },
];

const RECENT_SUPPORTERS = [
  { name: "Ari***", amount: "$10", time: "2 hours ago" },
  { name: "Min***", amount: "$3",  time: "5 hours ago" },
  { name: "Wei***", amount: "$25", time: "1 day ago" },
  { name: "Seo***", amount: "$10", time: "2 days ago" },
  { name: "Kang**", amount: "$3",  time: "3 days ago" },
];

export function DonationPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)";

  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState("reader");

  function copyAddress() {
    navigator.clipboard.writeText("pienovel@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <Heart className="size-7" style={{ color: "#ef4444", fill: "#ef4444" }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: ts.sectionTitle, marginBottom: "10px" }}>
          Support PieNovel
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: ts.subtext, maxWidth: "520px", margin: "0 auto", lineHeight: 1.65 }}>
          PieNovel is free and ad-supported, but your donations help us grow, add more novels, and keep everything running without paywalls.
        </p>
      </div>

      {/* Ad Slot 1 — below header */}
      <AdSlot type="leaderboard" label="728×90" className="mb-10" />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Novels Hosted", value: "12+" },
          { label: "Monthly Readers", value: "48K" },
          { label: "Supporters", value: "312" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 border text-center" style={{ background: cardBg, borderColor: cardBorder }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.8rem", color: "#10b981", lineHeight: 1 }}>{s.value}</p>
            <p className="mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tiers */}
      <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem", color: ts.sectionTitle }}>Choose your support</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const active = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className="text-left rounded-2xl p-5 border transition-all relative"
              style={{
                background: active ? tier.bg : cardBg,
                borderColor: active ? tier.border : cardBorder,
                boxShadow: active ? `0 0 0 1px ${tier.border}` : "none",
                outline: "none",
              }}
            >
              {tier.featured && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white"
                  style={{ fontSize: "0.6rem", fontWeight: 700, background: "#10b981", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}
                >
                  MOST POPULAR
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: tier.bg, border: `1px solid ${tier.border}` }}>
                  <Icon className="size-5" style={{ color: tier.color }} />
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.4rem", color: tier.color }}>{tier.amount}</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: ts.text, marginBottom: "4px" }}>{tier.name}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.muted, marginBottom: "12px", lineHeight: 1.5 }}>{tier.desc}</p>
              <ul className="space-y-1.5">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.subtext }}>
                    <Check className="size-3 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Donate buttons */}
      <div className="rounded-2xl border p-6 mb-10 flex flex-col sm:flex-row items-center gap-4" style={{ background: cardBg, borderColor: cardBorder }}>
        <div className="flex-1">
          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: ts.text, marginBottom: "4px" }}>
            Ready to support?
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: ts.muted }}>
            Choose your preferred platform below. Every donation, big or small, makes a real difference.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a
            href="#"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
          >
            <Coffee className="size-4" /> Ko-fi
            <ExternalLink className="size-3 opacity-70" />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
          >
            <Gift className="size-4" /> Trakteer
            <ExternalLink className="size-3 opacity-70" />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all"
            style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)", color: "#10b981", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
          >
            PayPal
            <ExternalLink className="size-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Ad Slot 2 — mid page */}
      <AdSlot type="leaderboard" label="728×90" className="mb-10" />

      {/* Two column: recent supporters + contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* Recent supporters */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: ts.text }}>Recent Supporters</h3>
          <div className="space-y-3">
            {RECENT_SUPPORTERS.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                    <Heart className="size-3" style={{ color: "#10b981", fill: "#10b981" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: ts.text }}>{s.name}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: ts.muted }}>{s.time}</p>
                  </div>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.9rem", color: "#10b981" }}>{s.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other ways to support */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: ts.text }}>Other Ways to Help</h3>
          <div className="space-y-3">
            {[
              { icon: Star, label: "Leave a review", desc: "Rate novels you've read to help others discover them." },
              { icon: ExternalLink, label: "Share PieNovel", desc: "Tell your friends — word of mouth is everything." },
              { icon: Gift, label: "Direct transfer", desc: "Prefer bank transfer? Email us for details." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <Icon className="size-3.5" style={{ color: "#10b981" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: ts.text }}>{item.label}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.73rem", color: ts.muted, lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-opacity hover:opacity-70"
            style={{ borderColor: cardBorder, background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)" }}
            onClick={copyAddress}
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext, flex: 1 }}>pienovel@example.com</span>
            {copied ? (
              <Check className="size-3.5" style={{ color: "#10b981" }} />
            ) : (
              <Copy className="size-3.5" style={{ color: ts.muted }} />
            )}
          </div>
        </div>
      </div>

      {/* Ad Slot 3 — bottom */}
      <AdSlot type="leaderboard" label="728×90" />

    </main>
  );
}
