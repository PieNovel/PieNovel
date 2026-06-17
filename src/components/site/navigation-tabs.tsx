"use client";

import type { ReactElement } from "react";

export type Tab = {
  id: string;
  label: string;
  count?: number;
};

type NavigationTabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
};

export function NavigationTabs({ tabs, activeTab, onTabChange, className = "" }: NavigationTabsProps): ReactElement {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_3%,transparent)] p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative shrink-0 rounded-lg px-4 py-1.5 text-sm transition-all"
            style={{
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
              background: active ? "color-mix(in_srgb, var(--primary) 15%, transparent)" : "transparent",
              fontWeight: active ? 700 : 400,
              border: active ? "1px solid color-mix(in_srgb, var(--primary) 30%, transparent)" : "1px solid transparent",
              boxShadow: active ? "0 0 12px color-mix(in_srgb, var(--primary) 15%, transparent), inset 0 1px 0 color-mix(in_srgb, var(--foreground) 5%, transparent)" : "none",
            }}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className="ml-1.5 rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold"
                style={{
                  background: active ? "color-mix(in_srgb, var(--primary) 30%, transparent)" : "color-mix(in_srgb, var(--foreground) 8%, transparent)",
                  color: active ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
