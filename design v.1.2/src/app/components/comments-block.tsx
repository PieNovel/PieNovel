import { useState } from "react";
import { ThumbsUp, MessageSquare, Bold, Italic, Underline, Strikethrough, Quote, AlignLeft, AlignCenter, AlignRight, Smile, Pen } from "lucide-react";
import { NativeBanner } from "./native-banner";

const MOCK_COMMENTS = [
  { id: 1, user: "NightReader99",   avatar: "N", text: "This novel is absolutely incredible! The world building is so detailed and the character development is on another level.", likes: 142, replies: 4,  time: "2 hours ago" },
  { id: 2, user: "CultivationFan", avatar: "C", text: "Just binged all chapters in 3 days. Can't wait for the next update!", likes: 89, replies: 2, time: "5 hours ago" },
  { id: 3, user: "LightNovelsKing",avatar: "L", text: "The power system in this novel is one of the most unique I've ever seen. Highly recommend.", likes: 67, replies: 1, time: "1 day ago" },
  { id: 4, user: "ReaderX2024",    avatar: "R", text: "Author really knows how to write tension. Every chapter ends on a cliffhanger.", likes: 54, replies: 0, time: "2 days ago" },
  { id: 5, user: "WuxiaAddict",    avatar: "W", text: "The pacing is perfect — not too slow, not too rushed. This is peak fiction.", likes: 48, replies: 3, time: "3 days ago" },
];

const TOTAL_LIKES = MOCK_COMMENTS.reduce((s, c) => s + c.likes, 0);
const TOTAL_REPLIES = MOCK_COMMENTS.reduce((s, c) => s + c.replies, 0);

interface CommentsBlockProps {
  bg: string;
  surface: string;
  surfaceHover: string;
  borderColor: string;
  accentColor: string;
  isLight: boolean;
  textColor: string;
  subtextColor: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onChapterList: () => void;
  showChapterList: boolean;
  novelId: number;
  currentChapter: number;
  totalChapters: number;
  onNavigateChapter: (ch: number) => void;
}

export function CommentsBlock({
  surface, surfaceHover: _surfaceHover, borderColor, accentColor, isLight,
  textColor, subtextColor,
}: CommentsBlockProps) {
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [comment, setComment] = useState("");

  const toolbarBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: subtextColor,
    cursor: "pointer",
    transition: "all 0.12s",
    flexShrink: 0,
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Stats ── */}
      <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: subtextColor, fontFamily: "'Inter', sans-serif" }}>
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="size-3" />
          {TOTAL_LIKES} likes
        </span>
        <span className="w-px h-3" style={{ background: borderColor }} />
        <span className="flex items-center gap-1.5">
          <MessageSquare className="size-3" />
          {TOTAL_REPLIES} replies
        </span>
      </div>

      {/* Ad Banner 3 — above Add Comment */}
      <NativeBanner
        bg={surface}
        borderColor={borderColor}
        textColor={textColor}
        accentColor={accentColor}
        className="mb-8"
      />

      {/* ── Add Comment ── */}
      <div className="mb-8">
        <h3 className="text-sm font-bold tracking-widest uppercase mb-1" style={{ color: textColor }}>Add Comment</h3>
        <p className="text-xs mb-4" style={{ color: subtextColor }}>
          Problems with the chapters? Write a report (#panic#).
        </p>

        {/* Editor box */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${borderColor}`, background: surface }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center gap-0.5 px-3 py-2 border-b flex-wrap"
            style={{ borderColor }}
          >
            {[
              { Icon: Bold },
              { Icon: Italic },
              { Icon: Underline },
              { Icon: Strikethrough },
              { Icon: Pen },
              { Icon: Quote },
              { Icon: AlignLeft },
              { Icon: AlignCenter },
              { Icon: AlignRight },
              { Icon: Smile },
            ].map(({ Icon }, i) => (
              <button
                key={i}
                style={toolbarBtnStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = textColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = subtextColor; }}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Maximum 7000 characters. The tag for the spoiler [spoiler] is the future here [/spoiler]"
            rows={5}
            maxLength={7000}
            className="w-full px-4 py-3 text-sm resize-y outline-none"
            style={{
              background: "transparent",
              color: textColor,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.7,
              minHeight: 120,
            }}
          />
        </div>

        {/* Submit */}
        <div className="mt-3">
          <button
            className="px-6 py-2.5 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all"
            style={{
              background: surface,
              border: `1px solid ${borderColor}`,
              color: textColor,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${accentColor}22`; (e.currentTarget as HTMLElement).style.borderColor = accentColor; (e.currentTarget as HTMLElement).style.color = accentColor; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = surface; (e.currentTarget as HTMLElement).style.borderColor = borderColor; (e.currentTarget as HTMLElement).style.color = textColor; }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* ── Comment list ── */}
      <div className="flex flex-col gap-px" style={{ borderTop: `1px solid ${borderColor}` }}>
        {MOCK_COMMENTS.map((c) => (
          <div key={c.id} className="flex gap-3 py-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg,${accentColor},#059669)` }}
            >
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold" style={{ color: textColor }}>{c.user}</span>
                <span className="text-xs" style={{ color: subtextColor }}>{c.time}</span>
              </div>
              <p className="text-sm" style={{ color: subtextColor, lineHeight: 1.65 }}>{c.text}</p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setLikes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: likes[c.id] ? accentColor : subtextColor, background: "none", border: "none", cursor: "pointer" }}
                >
                  <ThumbsUp className={`size-3 ${likes[c.id] ? "fill-current" : ""}`} />
                  {c.likes + (likes[c.id] ? 1 : 0)}
                </button>
                {c.replies > 0 && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: subtextColor }}>
                    <MessageSquare className="size-3" />
                    {c.replies}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
