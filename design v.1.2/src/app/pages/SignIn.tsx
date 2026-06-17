import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";

export function SignInPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const inputBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
  const inputBorder = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";
  const labelColor = isLight ? "#374151" : "#94a3b8";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1200);
  }

  return (
    <div
      className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-16"
      style={{ background: ts.bg }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-0 select-none">
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.8rem", color: ts.text }}>Pie</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.8rem", background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Novel</span>
          </Link>
          <p className="mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: ts.subtext }}>
            Sign in to continue reading
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{ background: cardBg, borderColor: inputBorder, boxShadow: isLight ? "0 4px 24px rgba(0,0,0,0.06)" : "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: ts.text, marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginBottom: "28px" }}>
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "'Inter', sans-serif" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block mb-1.5 text-xs" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: labelColor }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: ts.subtext }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 outline-none border text-sm transition-all"
                  style={{
                    background: inputBg,
                    borderColor: inputBorder,
                    color: ts.text,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: labelColor }}>
                  Password
                </label>
                <a href="#" className="text-xs" style={{ color: "#10b981", fontFamily: "'Inter', sans-serif" }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: ts.subtext }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl pl-10 pr-10 py-2.5 outline-none border text-sm transition-all"
                  style={{
                    background: inputBg,
                    borderColor: inputBorder,
                    color: ts.text,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-4" style={{ color: ts.subtext }} /> : <Eye className="size-4" style={{ color: ts.subtext }} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-white transition-all mt-2"
              style={{
                background: loading ? "rgba(16,185,129,0.5)" : "linear-gradient(135deg,#10b981,#059669)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.88rem",
                fontWeight: 600,
                boxShadow: loading ? "none" : "0 0 20px rgba(16,185,129,0.25)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: inputBorder }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext }}>
              Don't have an account?{" "}
              <a href="#" style={{ color: "#10b981", fontWeight: 500 }}>
                Create one
              </a>
            </p>
          </div>
        </div>

        {/* Social login */}
        <div className="mt-5 flex flex-col gap-3">
          {[
            { label: "Continue with Google", icon: "G" },
            { label: "Continue with Discord", icon: "D" },
          ].map((s) => (
            <button
              key={s.label}
              className="flex items-center justify-center gap-3 w-full rounded-xl py-2.5 border transition-all"
              style={{
                background: inputBg,
                borderColor: inputBorder,
                color: ts.text,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#10b981")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = inputBorder)}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">
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
