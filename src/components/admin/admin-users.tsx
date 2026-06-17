"use client";

import { useState } from "react";
import { Search, Shield, ShieldOff, Ban, MoreHorizontal, Users, X } from "lucide-react";
import { MOCK_USERS, type UserRow } from "@/lib/admin/mock-data";

type UserRole = "user" | "admin" | "moderator";
type UserStatus = "active" | "banned" | "inactive";

const ROLE_COLORS: Record<UserRole, string> = { admin: "#ef4444", moderator: "#f59e0b", user: "#10b981" };
const STATUS_COLORS: Record<UserStatus, string> = { active: "#10b981", banned: "#ef4444", inactive: "#94a3b8" };

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [actionUser, setActionUser] = useState<UserRow | null>(null);

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.75rem", color: "var(--foreground)" }}>
            User Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{MOCK_USERS.length} registered users</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: "Active", count: MOCK_USERS.filter((u) => u.status === "active").length, color: "#10b981" },
            { label: "Banned", count: MOCK_USERS.filter((u) => u.status === "banned").length, color: "#ef4444" },
          ].map(({ label, count, color }) => (
            <div key={label} className="rounded-xl border px-4 py-2 text-center" style={{ borderColor: "var(--border)", background: color + "10" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color }}>{count}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "user", "moderator", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="rounded-xl border px-3 py-2 text-sm capitalize transition-all"
              style={{
                background: roleFilter === r ? "rgba(16,185,129,0.12)" : "transparent",
                color: roleFilter === r ? "var(--primary)" : "var(--muted-foreground)",
                borderColor: roleFilter === r ? "rgba(16,185,129,0.3)" : "var(--border)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["User", "Role", "Status", "Read", "Joined", "Last Active", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "color-mix(in_srgb, var(--muted-foreground) 70%, transparent)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_2%,transparent)]" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="size-9 flex-shrink-0 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{user.username}</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2.5 py-0.5 text-xs capitalize" style={{ background: ROLE_COLORS[user.role] + "18", color: ROLE_COLORS[user.role] }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2.5 py-0.5 text-xs capitalize" style={{ background: STATUS_COLORS[user.status] + "18", color: STATUS_COLORS[user.status] }}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--foreground)" }}>{user.totalRead}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{user.joinedAt}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{user.lastActive}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => setActionUser(user)} className="flex size-7 items-center justify-center rounded-lg" style={{ color: "var(--muted-foreground)", background: "color-mix(in_srgb, var(--foreground) 6%, transparent)" }}>
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Users className="size-10 opacity-20" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No users found</p>
          </div>
        )}
      </div>

      {/* User action modal */}
      {actionUser && <UserActionModal user={actionUser} onClose={() => setActionUser(null)} />}
    </div>
  );
}

function UserActionModal({ user, onClose }: { user: UserRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.username} className="size-9 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{user.username}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{user.role}</p>
            </div>
          </div>
          <button onClick={onClose}><X className="size-4" style={{ color: "var(--muted-foreground)" }} /></button>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {[
            { label: "Make Admin", icon: Shield, color: "#ef4444", action: onClose },
            { label: "Make Moderator", icon: Shield, color: "#f59e0b", action: onClose },
            { label: user.status === "banned" ? "Unban User" : "Ban User", icon: user.status === "banned" ? ShieldOff : Ban, color: user.status === "banned" ? "#10b981" : "#ef4444", action: onClose },
          ].map(({ label, icon: Icon, color, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all"
              style={{ color, background: color + "0d" }}
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
  );
}
