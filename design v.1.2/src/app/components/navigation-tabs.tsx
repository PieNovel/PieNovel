interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function NavigationTabs({ tabs, activeTab, onTabChange, className }: NavigationTabsProps) {
  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-none ${className ?? ""}`}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative rounded-lg px-4 py-1.5 text-sm transition-all flex-shrink-0"
            style={{
              color: active ? "#ffffff" : "#475569",
              background: active ? "rgba(16,185,129,0.15)" : "transparent",
              fontWeight: active ? 700 : 400,
              border: `1px solid ${active ? "rgba(16,185,129,0.3)" : "transparent"}`,
              boxShadow: active ? "0 0 12px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
              textShadow: active ? "0 0 12px rgba(16,185,129,0.4)" : "none",
              transition: "all 0.2s",
            }}
          >
            {active && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: "16px",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #10b981, transparent)",
                  boxShadow: "0 0 6px rgba(16,185,129,0.6)",
                  bottom: "3px",
                  display: "block",
                  position: "absolute",
                }}
              />
            )}
            {tab.label}
            {tab.count != null && (
              <span
                className="ml-1.5 rounded-full px-1.5 py-0.5"
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  background: active ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
                  color: active ? "#34d399" : "#475569",
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
