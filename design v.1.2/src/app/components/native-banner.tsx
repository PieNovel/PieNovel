interface NativeBannerProps {
  bg: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  className?: string;
}

export function NativeBanner({ bg, borderColor, textColor, accentColor, className = "" }: NativeBannerProps) {
  return (
    <div
      className={`w-full rounded-xl overflow-hidden relative ${className}`}
      style={{
        border: `1px dashed ${borderColor}`,
        background: bg,
        minHeight: 80,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02)`,
      }}
    >
      {/* Emerald dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${accentColor}12 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          pointerEvents: "none",
        }}
      />
      {/* Subtle corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "80px",
          height: "80px",
          background: `radial-gradient(circle at top right, ${accentColor}10, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div className="relative flex items-center justify-between px-5 py-4 gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <span
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              color: accentColor,
              opacity: 0.6,
            }}
          >
            Advertisement
          </span>
          <span
            style={{
              fontSize: "0.82rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: textColor,
              opacity: 0.55,
            }}
          >
            Native Banner Ad — 728×90
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "'Inter', sans-serif",
              color: textColor,
              opacity: 0.3,
            }}
          >
            Your ad could be here. Reach thousands of readers daily.
          </span>
        </div>
        <div
          className="flex-shrink-0 px-4 py-2 rounded-lg"
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            border: `1px solid ${accentColor}40`,
            background: `${accentColor}12`,
            color: accentColor,
            fontFamily: "'Inter', sans-serif",
            boxShadow: `0 0 10px ${accentColor}15`,
          }}
        >
          Advertise
        </div>
      </div>
    </div>
  );
}
