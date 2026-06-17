import { useState } from "react";
import { useNavigate } from "react-router";
import { Settings, Type, Eye, Bell, Shield, ChevronRight, Check, Sun, Moon, Monitor } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

type Tab = "reading" | "appearance" | "notifications" | "account";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const ts = THEME_STYLES[theme];
  const { isLoggedIn, user, readingSettings, notifSettings, updateReadingSettings, updateNotifSettings, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("reading");
  const [saved, setSaved] = useState(false);

  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";
  const inputBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4" style={{ background: ts.bg }}>
        <Settings className="size-12" style={{ color: "#10b981" }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: ts.text }}>Sign in to manage settings</p>
        <button onClick={() => navigate("/signin")} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}>Sign In</button>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "reading", label: "Reading", icon: <Type className="size-4" /> },
    { id: "appearance", label: "Appearance", icon: <Eye className="size-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="size-4" /> },
    { id: "account", label: "Account", icon: <Shield className="size-4" /> },
  ];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 transition-all"
        style={{ width: "42px", height: "24px", borderRadius: "12px", background: checked ? "#10b981" : isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.12)" }}
      >
        <span
          className="absolute top-1 transition-all rounded-full"
          style={{ width: "16px", height: "16px", background: "#fff", left: checked ? "22px" : "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
        />
      </button>
    );
  }

  function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-between gap-4 py-4 border-b last:border-0" style={{ borderColor }}>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.88rem", color: ts.text }}>{label}</p>
          {desc && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: ts.subtext, marginTop: "2px" }}>{desc}</p>}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] py-10" style={{ background: ts.bg }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <h1 className="mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "2rem", color: ts.text }}>Settings</h1>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="sm:w-48 flex-shrink-0">
            <div className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: tab === t.id ? 600 : 400,
                    background: tab === t.id ? "rgba(16,185,129,0.12)" : "transparent",
                    color: tab === t.id ? "#10b981" : ts.subtext,
                    border: `1px solid ${tab === t.id ? "rgba(16,185,129,0.25)" : "transparent"}`,
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>

              {/* Reading settings */}
              {tab === "reading" && (
                <div className="p-5">
                  <h2 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Reading Preferences</h2>
                  <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>Customize your reading experience.</p>

                  <SettingRow label="Font Size" desc={`${readingSettings.fontSize}px`}>
                    <input
                      type="range" min={13} max={24} step={1}
                      value={readingSettings.fontSize}
                      onChange={(e) => updateReadingSettings({ fontSize: Number(e.target.value) })}
                      className="w-24 accent-emerald-500"
                    />
                  </SettingRow>

                  <SettingRow label="Font Family">
                    <select
                      value={readingSettings.fontFamily}
                      onChange={(e) => updateReadingSettings({ fontFamily: e.target.value as any })}
                      className="rounded-xl border px-2.5 py-1.5 text-sm outline-none"
                      style={{ fontFamily: "'Inter', sans-serif", background: inputBg, borderColor, color: ts.text }}
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
                      className="w-24 accent-emerald-500"
                    />
                  </SettingRow>

                  <SettingRow label="Reading Width">
                    <div className="flex rounded-xl border overflow-hidden" style={{ borderColor }}>
                      {(["narrow", "medium", "wide"] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => updateReadingSettings({ width: w })}
                          className="px-3 py-1.5 text-xs capitalize transition-all"
                          style={{ fontFamily: "'Inter', sans-serif", background: readingSettings.width === w ? "rgba(16,185,129,0.12)" : "transparent", color: readingSettings.width === w ? "#10b981" : ts.subtext }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                </div>
              )}

              {/* Appearance */}
              {tab === "appearance" && (
                <div className="p-5">
                  <h2 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Appearance</h2>
                  <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>Choose how PieNovel looks.</p>

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
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all"
                          style={{
                            borderColor: theme === t.id ? "rgba(16,185,129,0.5)" : borderColor,
                            background: theme === t.id ? "rgba(16,185,129,0.08)" : inputBg,
                            minWidth: "60px",
                          }}
                        >
                          <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: t.bg, border: `1px solid ${borderColor}` }}>
                            <span style={{ color: t.id === "light" ? "#f59e0b" : "#94a3b8" }}>{t.icon}</span>
                          </div>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: theme === t.id ? "#10b981" : ts.subtext }}>{t.label}</span>
                          {theme === t.id && <Check className="size-3" style={{ color: "#10b981" }} />}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                </div>
              )}

              {/* Notifications */}
              {tab === "notifications" && (
                <div className="p-5">
                  <h2 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Notifications</h2>
                  <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>Choose what notifications you receive.</p>

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

              {/* Account */}
              {tab === "account" && (
                <div className="p-5">
                  <h2 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: ts.text }}>Account</h2>
                  <p className="mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>Manage your account details.</p>

                  <div className="flex flex-col gap-3 mb-6">
                    <div>
                      <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Username</label>
                      <input
                        defaultValue={user?.username}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ fontFamily: "'Inter', sans-serif", background: inputBg, borderColor, color: ts.text }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Email</label>
                      <input
                        defaultValue={user?.email}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ fontFamily: "'Inter', sans-serif", background: inputBg, borderColor, color: ts.text }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: ts.subtext }}>Bio</label>
                      <textarea
                        defaultValue={user?.bio}
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                        style={{ fontFamily: "'Inter', sans-serif", background: inputBg, borderColor, color: ts.text }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: ts.text }}>Danger Zone</p>
                    <button
                      onClick={() => { logout(); navigate("/"); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border w-fit transition-all"
                      style={{ fontFamily: "'Inter', sans-serif", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
                    >
                      Sign Out of All Devices
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save button */}
            {tab !== "appearance" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white font-semibold transition-all"
                  style={{ background: saved ? "#059669" : "linear-gradient(135deg,#059669,#10b981)", fontFamily: "'Inter', sans-serif" }}
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
