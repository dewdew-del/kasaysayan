"use client";

import type { EraId } from "@/lib/schema";

export type ScaleBarProps = {
  count: number;
  current: number;
  eraBands: { era: EraId; n: number }[];
  ticks: { index: number; label: string }[];
  onSeek: (i: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
};

/** The timeline at the foot of the map, drawn like an old map's scale bar, with a Play button. */
export default function ScaleBar({ count, current, eraBands, ticks, onSeek, playing, onTogglePlay }: ScaleBarProps) {
  const max = Math.max(0, count - 1);
  return (
    <div className="ruler">
      <button type="button" className="play" aria-pressed={playing} onClick={onTogglePlay} disabled={count < 2}>
        {playing ? "❚❚ Pause" : "▶ Play"}
      </button>
      <div className="track">
        <div className="bands" aria-hidden="true">
          {eraBands.map((b) => (
            <i key={b.era} style={{ flex: b.n }} />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={Math.min(current, max)}
          aria-label="Move through events"
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={count < 2}
        />
        <div className="ticks" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t.index} style={{ left: `${max ? (t.index / max) * 100 : 0}%` }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
