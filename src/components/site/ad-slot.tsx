import type { ReactElement } from "react";

type AdSlotProps = {
  label?: string;
  className?: string;
};

export function AdSlot({ label = "728x90", className = "" }: AdSlotProps): ReactElement {
  return (
    <div
      className={`relative flex min-h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[color-mix(in_srgb,var(--primary)_22%,transparent)] bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary)_9%,transparent)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="relative grid justify-items-center gap-1 py-4 text-center">
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--primary)] opacity-60">
          Advertisement
        </span>
        <span className="text-xs text-[var(--muted-foreground)] opacity-70">{label}</span>
      </div>
    </div>
  );
}
