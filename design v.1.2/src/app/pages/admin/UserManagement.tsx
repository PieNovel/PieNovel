import { useState } from "react";
import { Search, Shield, ShieldOff, Ban, MoreHorizontal, Users, X } from "lucide-react";
import { useTheme, THEME_STYLES } from "../../context/ThemeContext";

// DB mapping:
// List users  → SELECT * FROM users ORDER BY created_at DESC
// Search      → WHERE username ILIKE '%q%' OR email ILIKE '%q%'
// Ban user    → UPDATE users SET status = 'banned' WHERE id = ?
// Set role    → UPDATE users SET role = ? WHERE id = ?

type UserRole = "user" | "admin" | "moderator";
type UserStatus = "active" | "banned" | "inactive";

interface UserRow {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  totalRead: number;
  lastActive: string;
}

const MOCK_USERS: UserRow[] = [
  { id: "u001", username: "Aria Sinclair", email: "aria.sinclair@email.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop", role: "admin", status: "active", joinedAt: "Jan 2024", totalRead: 47, lastActive: "Just now" },
  { id: "u002", username: "kai_reader", email: "kai@mail.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Mar 2024", totalRead: 23, lastActive: "2h ago" },
  { id: "u003", username: "novel_addict_99", email: "ninetyni@gmail.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Feb 2024", totalRead: 89, lastActive: "5h ago" },
  { id: "u004", username: "xianxia_fan", email: "xfan@webnovel.net", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", role: "moderator", status: "active", joinedAt: "Dec 2023", totalRead: 312, lastActive: "1d ago" },
  { id: "u005", username: "spam_bot_2024", email: "spam@fake.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop", role: "user", status: "banned", joinedAt: "Apr 2024", totalRead: 0, lastActive: "3d ago" },
  { id: "u006", username: "readerZ", email: "readerz@yahoo.com", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop", role: "user", status: "inactive", joinedAt: "Nov 2023", totalRead: 5, lastActive: "30d ago" },
  { id: "u007", username: "cultivator_mk", email: "mk.cult@gmail.com", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Jan 2024", totalRead: 156, lastActive: "4h ago" },
  { id: "u008", username: "fantasy_luna", email: "luna@fant.io", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop", role: "user", status: "active", joinedAt: "Feb 2024", totalRead: 74, lastActive: "12h ago" },
];

const ROLE_COLORS: Record<UserRole, string> = { admin: "#ef4444", moderator: "#f59e0b", user: "#10b981" };
const STATUS_COLORS: Record<UserStatus, string> = { active: "#10b981", banned: "#ef4444", inactive: "#94a3b8" };

export function UserManagement() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const cardBg = isLight ? "#ffffff" : theme === "gray" ? "#1e2026" : "#0d1117";
  const borderColor = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [actionUser, setActionUser] = useState<UserRow | null>(null);

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: ts.text }}>User Management</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: ts.subtext, marginTop: "4px" }}>{MOCK_USERS.length} registered users</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: "Active", count: MOCK_USERS.filter((u) => u.status === "active").length, color: "#10b981" },
            { label: "Banned", count: MOCK_USERS.filter((u) => u.status === "banned").length, color: "#ef4444" },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-center px-4 py-2 rounded-xl border" style={{ borderColor, background: color + "10" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color }}>{count}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: ts.subtext }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: ts.subtext }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ fontFamily: "'Inter', sans-serif", background: cardBg, borderColor, color: ts.text }}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "user", "moderator", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3 py-2 rounded-xl text-sm capitalize transition-all border"
              style={{ fontFamily: "'Inter', sans-serif", background: roleFilter === r ? "rgba(16,185,129,0.12)" : "transparent", color: roleFilter === r ? "#10b981" : ts.subtext, borderColor: roleFilter === r ? "rgba(16,185,129,0.3)" : borderColor }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {["User", "Role", "Status", "Read", "Joined", "Last Active", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, color: ts.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: `1px solid ${borderColor}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="size-9 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.82rem", color: ts.text }}>{user.username}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: ts.subtext }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs capitalize" style={{ fontFamily: "'Inter', sans-serif", background: ROLE_COLORS[user.role] + "18", color: ROLE_COLORS[user.role] }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs capitalize" style={{ fontFamily: "'Inter', sans-serif", background: STATUS_COLORS[user.status] + "18", color: STATUS_COLORS[user.status] }}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.text }}>{user.totalRead}</td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{user.joinedAt}</td>
                  <td className="px-5 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: ts.subtext }}>{user.lastActive}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setActionUser(user)}
                      className="size-7 rounded-lg flex items-center justify-center"
                      style={{ color: ts.subtext, background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)" }}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Users className="size-10 opacity-20" style={{ color: ts.subtext }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: ts.subtext }}>No users found</p>
          </div>
        )}
      </div>

      {/* User action modal */}
      {actionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor }}>
              <div className="flex items-center gap-3">
                <img src={actionUser.avatar} alt={actionUser.username} className="size-9 rounded-xl object-cover" />
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: ts.text }}>{actionUser.username}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: ts.subtext }}>{actionUser.role}</p>
                </div>
              </div>
              <button onClick={() => setActionUser(null)}><X className="size-4" style={{ color: ts.subtext }} /></button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                { label: "Make Admin", icon: Shield, color: "#ef4444", action: () => setActionUser(null) },
                { label: "Make Moderator", icon: Shield, color: "#f59e0b", action: () => setActionUser(null) },
                { label: actionUser.status === "banned" ? "Unban User" : "Ban User", icon: actionUser.status === "banned" ? ShieldOff : Ban, color: actionUser.status === "banned" ? "#10b981" : "#ef4444", action: () => setActionUser(null) },
              ].map(({ label, icon: Icon, color, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all w-full"
                  style={{ fontFamily: "'Inter', sans-serif", color, background: color + "0d" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = color + "18"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = color + "0d"; }}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
