import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { PlayCircle, Bookmark, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id?: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  chapters: number;
  views: string;
  description: string;
  coverUrl: string;
  bannerUrl: string;
  tags: string[];
}

interface FeaturedHeroProps {
  slides: HeroSlide[];
}

export function FeaturedHero({ slides }: FeaturedHeroProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, slides.length]
  );

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        minHeight: "300px",
        boxShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(16,185,129,0.12)",
      }}
    >
      {/* Banner backgrounds */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
        >
          <img src={s.bannerUrl} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.28) saturate(0.8)" }} />
          {/* Multi-layer cinematic gradients */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(4,8,12,0.98) 30%, rgba(4,8,12,0.65) 60%, rgba(4,8,12,0.15) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,8,12,0.95) 0%, transparent 55%)" }} />
          {/* Emerald ambient light — subtle */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.06) 0%, transparent 60%)" }} />
        </div>
      ))}

      {/* Decorative grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-6 p-5 sm:p-8 md:p-10" style={{ minHeight: "300px" }}>

        {/* Cover art */}
        <div
          className="hidden sm:block flex-shrink-0 transition-all duration-500"
          style={{
            width: "clamp(100px, 15vw, 140px)",
            height: "clamp(143px, 21vw, 200px)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: isAnimating
              ? "0 0 0 0 transparent"
              : "0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08), 0 0 30px rgba(16,185,129,0.15)",
            opacity: isAnimating ? 0.4 : 1,
            transform: isAnimating ? "scale(0.96)" : "scale(1)",
            transition: "all 0.4s ease",
          }}
        >
          <img src={slide.coverUrl} alt={slide.title} className="w-full h-full object-cover" />
          {/* Emerald corner accent */}
          <div className="absolute top-0 left-0 w-8 h-8" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), transparent)" }} />
        </div>

        {/* Text content */}
        <div
          className="flex-1 max-w-lg"
          style={{
            fontFamily: "'Inter', sans-serif",
            opacity: isAnimating ? 0.4 : 1,
            transform: isAnimating ? "translateX(-6px)" : "translateX(0)",
            transition: "all 0.4s ease",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.35)",
                borderRadius: "4px",
                padding: "3px 8px",
                background: "rgba(16,185,129,0.1)",
                boxShadow: "0 0 8px rgba(16,185,129,0.15)",
              }}
            >
              Featured
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                padding: "3px 8px",
              }}
            >
              {slide.genre}
            </span>
          </div>

          <h1
            className="text-white mb-2 leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              letterSpacing: "-0.01em",
            }}
          >
            {slide.title}
          </h1>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>by <span style={{ color: "#94a3b8" }}>{slide.author}</span></p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white text-sm font-semibold">{slide.rating.toFixed(1)}</span>
            </div>
            <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.15)" }} />
            <span className="text-sm" style={{ color: "#64748b" }}>{slide.chapters} Chapters</span>
            <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.15)" }} />
            <span className="text-sm" style={{ color: "#64748b" }}>{slide.views} views</span>
          </div>

          <p className="text-sm leading-relaxed mb-4 line-clamp-2 hidden sm:block" style={{ color: "#64748b" }}>
            {slide.description}
          </p>

          <div className="hidden sm:flex flex-wrap gap-1.5 mb-6">
            {slide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded px-2 py-0.5"
                style={{
                  fontSize: "0.65rem",
                  color: "#64748b",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => slide.id != null ? navigate(`/novel/${slide.id}`) : undefined}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #059669, #10b981, #34d399)",
                fontSize: "0.85rem",
                fontWeight: 700,
                boxShadow: "0 0 28px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "1px solid rgba(52,211,153,0.3)",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(16,185,129,0.65), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 28px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
            >
              <PlayCircle className="size-4" />
              Start Reading
            </button>
            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 border transition-all"
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#94a3b8",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; e.currentTarget.style.color = "#34d399"; e.currentTarget.style.background = "rgba(16,185,129,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <Bookmark className="size-4" />
              Add to Library
            </button>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
          style={{
            width: "36px", height: "36px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
        >
          <ChevronLeft className="size-4 text-white" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
          style={{
            width: "36px", height: "36px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
        >
          <ChevronRight className="size-4 text-white" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-5 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? "22px" : "6px",
              height: "6px",
              background: i === current
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "rgba(255,255,255,0.2)",
              boxShadow: i === current ? "0 0 8px rgba(16,185,129,0.6)" : "none",
            }}
          />
        ))}
      </div>

      {/* Bottom emerald line accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.4) 40%, rgba(52,211,153,0.6) 50%, rgba(16,185,129,0.4) 60%, transparent 100%)" }}
      />
    </div>
  );
}
