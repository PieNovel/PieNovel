import type { ReactElement, ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  icon,
  action,
}: SectionHeadingProps): ReactElement {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-9 w-1 rounded-full bg-gradient-to-b from-[var(--primary)] to-transparent shadow-[0_0_18px_color-mix(in_srgb,var(--primary)_60%,transparent)]" />
        <div>
          <p className="mb-1 flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            {icon}
            {eyebrow}
          </p>
          <h2 className="text-xl font-black tracking-tight text-[var(--foreground)] sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>
      {action}
    </div>
  );
}
