import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { AdSlot } from "../components/ad-slot";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { ALL_NOVELS, GENRES } from "../data/novels";

const GENRE_DATA: Record<string, { desc: string }> = {
  Action:        { desc: "A work typically depicting fighting, violence, chaos, and fast paced motion." },
  Adventure:     { desc: "Exploring new places, environments or situations. Often associated with people on long journeys encountering amazing things." },
  Fantasy:       { desc: "Anything that involves, but not limited to, magic, dream world, and fairy tales." },
  Romance:       { desc: "A story in this genre focus heavily on the romantic relationship between two or more people." },
  Cultivation:   { desc: "Characters train, meditate, and refine their bodies or spirits to achieve higher levels of power and enlightenment." },
  Regression:    { desc: "A protagonist travels back in time or is reborn, using foreknowledge to change their fate or the world around them." },
  System:        { desc: "Novels related to game-like elements, RPG stats, or a hidden system. Characters are often immersed in VR or game-like mechanics." },
  Isekai:        { desc: "A protagonist is transported, reincarnated, or otherwise transferred to another world, fantasy land, or virtual reality." },
  Horror:        { desc: "Novels whose focus is to scare the audience through fear, dread, and disturbing or supernatural elements." },
  Mystery:       { desc: "Usually an unexplained event occurs, and the main protagonist attempts to find out what caused it." },
  "Sci-Fi":      { desc: "Short for science fiction. These works involve twists on technology and other science related phenomena contrary to the modern world." },
  "Dark Fantasy": { desc: "A subgenre of fantasy that incorporates darker, frightening themes, as well as elements of horror and morally ambiguous characters." },
  Xianxia:       { desc: "Xianxia is fictional martial art stories where the main goal is cultivating to immortality, influenced heavily by Chinese folklore and mythology." },
  Wuxia:         { desc: "Fictional stories about mortal humans who can achieve superhuman ability through martial arts training or internal energy cultivation, usually in an ancient China setting." },
  Drama:         { desc: "A work meant to bring on an emotional response, such as instilling sadness or tension, through conflict and deep character development." },
  Comedy:        { desc: "A dramatic work that is light and often humorous or satirical in tone, usually containing a happy resolution of the thematic conflict." },
  Psychological: { desc: "Usually deals with the philosophy of a state of mind, in most cases detailing abnormal or complex psychology." },
  "Martial Arts":{ desc: "The novel has a focus on any of several arts of combat or self-defense such as aikido, karate, judo, kendo, and so forth." },
  Supernatural:  { desc: "Usually entails amazing and unexplained powers or events which defy the laws of physics." },
  Tragedy:       { desc: "Contains events resulting in great loss and misfortune for the characters." },
  "Slice of Life":{ desc: "Novels with no focused plot. Naturalistic and mainly focuses around the characters and their everyday lives." },
  Seinen:        { desc: "Seinen means 'Young Man.' Novels that specifically target young adult males around the ages of 18 to 25." },
  Shounen:       { desc: "A work intended and primarily written for younger male audiences. Usually involves fighting and/or adventure." },
  Historical:    { desc: "Novels whose setting is in the past. Frequently these follow historical tales, sagas or facts." },
  "School Life": { desc: "Having a major setting of the story deal with some type of school environment." },
  Mecha:         { desc: "A work involving and usually concentrating on all types of large robotic machines." },
  Game:          { desc: "Novels related to game elements, or a similar system. Characters are immersed in VR, god-closed systems, or game-like technologies." },
};

export function GenresPage() {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const navigate = useNavigate();
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const isLight = theme === "light";
  const bg = isLight ? "#f5f5f5" : theme === "gray" ? "#1a1d23" : "#0d1117";
  const rowBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
  const hoverBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
  const titleColor = ts.text;
  const descColor = ts.muted;
  const accentColor = "#10b981";

  const displayGenres = GENRES.filter((g) => g !== "All");
  // merge with any extra genres from GENRE_DATA not in GENRES
  const allGenreKeys = [
    ...displayGenres,
    ...Object.keys(GENRE_DATA).filter((k) => !displayGenres.includes(k)),
  ];

  const mid = Math.floor(allGenreKeys.length / 2);

  function renderRow(genre: string, isLastOverall: boolean) {
    const data = GENRE_DATA[genre];
    const count = ALL_NOVELS.filter((n) => n.genre === genre || n.tags.includes(genre)).length;
    const isHovered = hoveredGenre === genre;
    return (
      <div
        key={genre}
        onClick={() => navigate(`/browse?genre=${encodeURIComponent(genre)}`)}
        onMouseEnter={() => setHoveredGenre(genre)}
        onMouseLeave={() => setHoveredGenre(null)}
        style={{
          padding: "14px 16px",
          borderBottom: isLastOverall ? "none" : `1px solid ${rowBorder}`,
          background: isHovered ? hoverBg : "transparent",
          cursor: "pointer",
          transition: "background 0.12s",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: isHovered ? accentColor : titleColor, marginBottom: data ? "4px" : "0", transition: "color 0.12s" }}>
            {genre}
          </p>
          {data && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: descColor, lineHeight: 1.5 }}>
              {data.desc}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, paddingTop: "2px" }}>
          {count > 0 && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: descColor, whiteSpace: "nowrap" }}>
              {count} novels
            </span>
          )}
          <ChevronRight style={{ width: "14px", height: "14px", color: isHovered ? accentColor : descColor, transition: "color 0.12s", flexShrink: 0 }} />
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", color: titleColor, marginBottom: "4px" }}>
            Genres
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: descColor }}>
            {allGenreKeys.length} genres available
          </p>
        </div>

        {/* Ad Slot 1 — below header */}
        <AdSlot type="leaderboard" label="728×90" className="mb-6" />

        {/* Genre list first half */}
        <div className="mb-6" style={{ border: `1px solid ${rowBorder}`, borderRadius: "8px", overflow: "hidden" }}>
          {allGenreKeys.slice(0, mid).map((genre) => renderRow(genre, false))}
        </div>

        {/* Ad Slot 2 — mid list */}
        <AdSlot type="leaderboard" label="728×90" className="mb-6" />

        {/* Genre list second half */}
        <div style={{ border: `1px solid ${rowBorder}`, borderRadius: "8px", overflow: "hidden" }}>
          {allGenreKeys.slice(mid).map((genre, i) => renderRow(genre, i === allGenreKeys.slice(mid).length - 1))}
        </div>

        {/* Ad Slot 3 — bottom */}
        <AdSlot type="leaderboard" label="728×90" className="mt-6" />

      </div>
    </main>
  );
}
