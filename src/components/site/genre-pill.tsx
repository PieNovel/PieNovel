"use client";

import type { ReactElement } from "react";

type GenrePillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function GenrePill({ label, active, onClick }: GenrePillProps): ReactElement {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border px-4 py-1.5 text-[0.75rem] transition-all"
      style={{
        fontWeight: active ? 600 : 400,
        borderColor: active ? "color-mix(in_srgb, var(--primary) 50%, transparent)" : "color-mix(in_srgb, var(--foreground) 7%, transparent)",
        color: active ? "var(--primary)" : "var(--muted-foreground)",
        background: active ? "color-mix(in_srgb, var(--primary) 10%, transparent)" : "transparent",
        boxShadow: active ? "0 0 12px color-mix(in_srgb, var(--primary) 15%, transparent)" : "none",
      }}
    >
      {label}
    </button>
  );
}
