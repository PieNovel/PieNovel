"use client";

import { Bell, Check, Eye, Monitor, Moon, Shield, Sun, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactElement, ReactNode } from "react";

import { useAuth } from "@/lib/site/auth-context";
import { useTheme } from "@/lib/site/theme-context";

type Tab = "reading" | "appearance" | "notifications" | "account";

type SettingsPageProps = {
  locale: string;
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }): ReactElement {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative shrink-0 transition-all"
      style={{ width: "42px", height: "24px", borderRadius: "12px", background: checked ? "var(--primary)" : "color-mix(in_srgb, var(--foreground) 12%, transparent)" }}
    >
      <span
        className="absolute top-1 rounded-full bg-white transition-all"
        style={{ width: "16px", height: "16px", left: checked ? "22px" : "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
      />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: ReactNode }): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-4 last:border-0" style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
      <div className="min-w-0 flex-1">
        <p className="text-[0.88rem] font-medium text-[var(--foreground)]">{label}</p>
        {desc && <p className="mt-0.5 text-[0.75rem] text-[var(--muted-foreground)]">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage({ locale }: SettingsPageProps): ReactElement {
  const router = useRouter();
  const { isLoggedIn, user, readingSettings, notifSettings, updateReadingSettings, updateNotifSettings, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("reading");
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
        <Type className="size-12 text-[var(--primary)]" />
        <p className="font-serif text-[1.4rem] font-bold text-[var(--foreground)]">Sign in to manage settings</p>
        <button onClick={() => router.push(`/${locale}/signin`)} className="rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white">
          Sign In
        </button>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "reading", label: "Reading", icon: <Type className="size-4" /> },
    { id: "appearance", label: "Appearance", icon: <Eye className="size-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="size-4" /> },
    { id: "account", label: "Account", icon: <Shield className="size-4" /> },
  ];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 font-serif text-[2rem] font-extrabold text-[var(--foreground)]">Settings</h1>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="shrink-0 sm:w-48">
            <div className="flex gap-1 overflow-x-auto pb-2 sm:flex-col sm:overflow-visible sm:pb-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-all"
                  style={{
                    fontWeight: tab === t.id ? 600 : 400,
                    background: tab === t.id ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent",
                    color: tab === t.id ? "var(--primary)" : "var(--muted-foreground)",
                    border: tab === t.id ? "1px solid color-mix(in_srgb, var(--primary) 25%, transparent)" : "1px solid transparent",
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
              {tab === "reading" && (
                <div className="p-5">
                  <h2 className="mb-1 font-serif text-[1.1rem] font-bold text-[var(--foreground)]">Reading Preferences</h2>
                  <p className="mb-5 text-[0.78rem] text-[var(--muted-foreground)]">Customize your reading experience.</p>

                  <SettingRow label="Font Size" desc={`${readingSettings.fontSize}px`}>
                    <input
                      type="range" min={13} max={24} step={1}
                      value={readingSettings.fontSize}
                      onChange={(e) => updateReadingSettings({ fontSize: Number(e.target.value) })}
                      className="w-24 accent-[var(--primary)]"
                    />
                  </SettingRow>

                  <SettingRow label="Font Family">
                    <select
                      value={readingSettings.fontFamily}
                      onChange={(e) => updateReadingSettings({ fontFamily: e.target.value as "inter" | "georgia" | "merriweather" })}
                      className="rounded-xl border px-2.5 py-1.5 text-sm text-[var(--foreground)] outline-none"
                      style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
                    >
                      <option value="inter">Inter (Sans-serif)</option>
                      <option value="georgia">Georgia (Serif)</option>
                      <option value="merriweather">Merriweather</option>
                    </select>
                  </SettingRow>

                  <SettingRow label="Line Spacing" desc={`${readingSettings.lineHeight}x`}>
                    <input
                      type="range" min={1.4} max={2.4} step={0.1}
                      value={readingSettings.lineHeight}
                      onChange={(e) => updateReadingSettings({ lineHeight: Number(e.target.value) })}
                      className="w-24 accent-[var(--primary)]"
                    />
                  </SettingRow>

                  <SettingRow label="Reading Width">
                    <div className="flex overflow-hidden rounded-xl border" style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
                      {(["narrow", "medium", "wide"] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => updateReadingSettings({ width: w })}
                          className="px-3 py-1.5 text-xs capitalize transition-all"
                          style={{ background: readingSettings.width === w ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent", color: readingSettings.width === w ? "var(--primary)" : "var(--muted-foreground)" }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                </div>
              )}

              {tab === "appearance" && (
                <div className="p-5">
                  <h2 className="mb-1 font-serif text-[1.1rem] font-bold text-[var(--foreground)]">Appearance</h2>
                  <p className="mb-5 text-[0.78rem] text-[var(--muted-foreground)]">Choose how PieNovel looks.</p>

                  <SettingRow label="Theme">
                    <div className="flex gap-2">
                      {([
                        { id: "dark" as const, label: "Dark", icon: <Moon className="size-3.5" />, bg: "#07090D" },
                        { id: "light" as const, label: "Light", icon: <Sun className="size-3.5" />, bg: "#f8fafc" },
                        { id: "gray" as const, label: "Slate", icon: <Monitor className="size-3.5" />, bg: "#1a1c22" },
                      ]).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className="flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all"
                          style={{
                            borderColor: theme === t.id ? "color-mix(in_srgb, var(--primary) 50%, transparent)" : "color-mix(in_srgb, var(--foreground) 6%, transparent)",
                            background: theme === t.id ? "color-mix(in_srgb, var(--primary) 8%, transparent)" : "color-mix(in_srgb, var(--foreground) 4%, transparent)",
                            minWidth: "60px",
                          }}
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg border" style={{ background: t.bg, borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
                            <span style={{ color: t.id === "light" ? "#f59e0b" : "#94a3b8" }}>{t.icon}</span>
                          </div>
                          <span style={{ fontSize: "0.68rem", color: theme === t.id ? "var(--primary)" : "var(--muted-foreground)" }}>{t.label}</span>
                          {theme === t.id && <Check className="size-3 text-[var(--primary)]" />}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                </div>
              )}

              {tab === "notifications" && (
                <div className="p-5">
                  <h2 className="mb-1 font-serif text-[1.1rem] font-bold text-[var(--foreground)]">Notifications</h2>
                  <p className="mb-5 text-[0.78rem] text-[var(--muted-foreground)]">Choose what notifications you receive.</p>

                  <SettingRow label="New Chapters" desc="Get notified when novels in your library update">
                    <Toggle checked={notifSettings.newChapters} onChange={(v) => updateNotifSettings({ newChapters: v })} />
                  </SettingRow>
                  <SettingRow label="Recommendations" desc="Personalized novel suggestions">
                    <Toggle checked={notifSettings.recommendations} onChange={(v) => updateNotifSettings({ recommendations: v })} />
                  </SettingRow>
                  <SettingRow label="Newsletter" desc="Monthly PieNovel digest">
                    <Toggle checked={notifSettings.newsletter} onChange={(v) => updateNotifSettings({ newsletter: v })} />
                  </SettingRow>
                </div>
              )}

              {tab === "account" && (
                <div className="p-5">
                  <h2 className="mb-1 font-serif text-[1.1rem] font-bold text-[var(--foreground)]">Account</h2>
                  <p className="mb-5 text-[0.78rem] text-[var(--muted-foreground)]">Manage your account details.</p>

                  <div className="mb-6 flex flex-col gap-3">
                    <div>
                      <label className="mb-1.5 block text-[0.78rem] font-medium text-[var(--muted-foreground)]">Username</label>
                      <input
                        defaultValue={user?.username}
                        className="w-full rounded-xl border px-3 py-2.5 text-sm text-[var(--foreground)] outline-none"
                        style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.78rem] font-medium text-[var(--muted-foreground)]">Email</label>
                      <input
                        defaultValue={user?.email}
                        className="w-full rounded-xl border px-3 py-2.5 text-sm text-[var(--foreground)] outline-none"
                        style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.78rem] font-medium text-[var(--muted-foreground)]">Bio</label>
                      <textarea
                        defaultValue={user?.bio}
                        rows={3}
                        className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-[var(--foreground)] outline-none"
                        style={{ background: "color-mix(in_srgb, var(--foreground) 4%, transparent)", borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
                    <p className="text-[0.78rem] font-semibold text-[var(--foreground)]">Danger Zone</p>
                    <button
                      onClick={() => { logout(); router.push(`/${locale}`); }}
                      className="flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-red-400 transition-all"
                      style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}
                    >
                      Sign Out of All Devices
                    </button>
                  </div>
                </div>
              )}
            </div>

            {tab !== "appearance" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all"
                  style={{ background: saved ? "var(--primary)" : undefined }}
                >
                  {saved ? <><Check className="size-4" /> Saved!</> : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
