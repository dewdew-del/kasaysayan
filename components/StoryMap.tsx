"use client";

import { useMemo } from "react";
import type { Event } from "@/lib/events";
import { MAP_H, MAP_W, coastPaths, doodles, markerPositions, project } from "@/lib/map";

// Drawn once per module: the coast and doodles never change.
const COAST = coastPaths();
const DOODLES = doodles(7);

const ISLAND_LABELS: [string, number, number][] = [
  ["LUZON", 121.2, 16.3],
  ["MINDANAO", 124.9, 7.7],
  ["PALAWAN", 118.4, 9.4],
  ["SAMAR", 125.0, 11.9],
  ["PANAY", 122.5, 11.15],
  ["MINDORO", 121.0, 13.0],
  ["NEGROS", 122.9, 10.0],
];
const SEA_LABELS: [string, number, number, number?][] = [
  ["PACIFIC OCEAN", 126.4, 15.6, 68],
  ["SULU SEA", 119.0, 8.2],
  ["SIBUYAN SEA", 122.3, 12.5],
];
const SHIPS: [number, number, number][] = [
  [118.6, 15.0, 1.1],
  [125.9, 13.6, 0.9],
  [120.8, 8.0, 0.8],
];

export type StoryMapProps = {
  events: Event[];
  current: number;
  onMarkerClick: (id: string) => void;
  /** Optional zoomed viewBox; defaults to the whole map. */
  viewBox?: { x: number; y: number; w: number; h: number };
};

export default function StoryMap({ events, current, onMarkerClick, viewBox }: StoryMapProps) {
  const pos = useMemo(() => markerPositions(events), [events]);
  const vb = viewBox ?? { x: 0, y: 0, w: MAP_W, h: MAP_H };
  // Marks are drawn at a constant on-screen size, whatever the zoom.
  const s = vb.w / MAP_W;
  const now = events[current];
  const nowPos = now ? pos.get(now.id) : undefined;
  const nationwide = Boolean(now && !now.place);

  return (
    <svg
      className="storymap"
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      role="img"
      aria-label="Old-style map of the Philippine Islands with event markers"
      data-nationwide={nationwide ? "true" : "false"}
    >
      {SEA_LABELS.map(([t, lng, lat, rot]) => {
        const [x, y] = project(lng, lat);
        return (
          <text key={t} className="sea-label" x={rot ? undefined : x} y={rot ? undefined : y} transform={rot ? `translate(${x},${y}) rotate(${rot})` : undefined}>
            {t}
          </text>
        );
      })}
      {SHIPS.map(([lng, lat, k]) => {
        const [x, y] = project(lng, lat);
        return (
          <g key={`${lng}`} className="ship" transform={`translate(${x},${y}) scale(${k})`}>
            <path d="M-14,0 Q0,7 14,0" />
            <path className="sail" d="M0,-2 L0,-22 L11,-4 Z" />
            <path d="M-22,6 q4,-3 8,0 t8,0" />
          </g>
        );
      })}
      <g className="rose" transform={`translate(${project(117.3, 19.6).join(",")})`}>
        <circle r="26" />
        <circle r="20" />
        <path d="M0,-34 L5,0 L0,34 L-5,0 Z" className="ink" />
        <path d="M-34,0 L0,5 L34,0 L0,-5 Z" className="paper" />
        <text y="-38" textAnchor="middle">N</text>
      </g>
      <g className="cart" transform={`translate(${MAP_W - 200},14)`}>
        <rect width="186" height="74" rx="3" />
        <rect x="5" y="5" width="176" height="64" rx="2" fill="none" />
        <text x="93" y="32" textAnchor="middle" fontSize="20">Kasaysayan</text>
        <text x="93" y="54" textAnchor="middle" fontSize="13">of the Philippine Islands</text>
      </g>

      <g className="coast">
        {COAST.map((d, i) => (
          <path key={`r${i}`} className="ripple" d={d} />
        ))}
        {COAST.map((d, i) => (
          <path key={`l${i}`} className="land" d={d} />
        ))}
      </g>
      <g className="doodles" aria-hidden="true">
        {DOODLES.map((o, i) =>
          o.kind === "palm" ? (
            <g key={i} className="palm">
              <path d={`M${o.x},${o.y} q1,-8 3,-13`} />
              <path className="leaf" d={`M${o.x + 3},${o.y - 13} q-7,-2 -9,3 q5,-3 9,-3 q7,-3 9,2 q-5,-2 -9,-2 q-2,-6 2,-8 q-1,4 -2,8`} />
            </g>
          ) : (
            <g key={i} className="hill">
              <path className="mound" d={`M${o.x - 9},${o.y} L${o.x},${o.y - 11} L${o.x + 9},${o.y} Z`} />
              <path d={`M${o.x},${o.y - 11} l-3,6 M${o.x + 2},${o.y - 8} l2,5`} />
            </g>
          ),
        )}
      </g>
      {ISLAND_LABELS.map(([t, lng, lat]) => {
        const [x, y] = project(lng, lat);
        return (
          <text key={t} className="island-label" x={x} y={y} textAnchor="middle">
            {t}
          </text>
        );
      })}

      <g className="markers">
        {events.map((e, i) => {
          const p = pos.get(e.id);
          if (!p) return null;
          const state = i < current ? "past" : i === current ? "current" : "future";
          return (
            <g
              key={e.id}
              className={`marker ${state}`}
              data-state={state}
              role="button"
              tabIndex={0}
              aria-label={`${e.title}, ${e.place!.name}`}
              transform={`translate(${p.x},${p.y}) scale(${s})`}
              onClick={() => onMarkerClick(e.id)}
              onKeyDown={(k) => {
                if (k.key === "Enter" || k.key === " ") {
                  k.preventDefault();
                  onMarkerClick(e.id);
                }
              }}
            >
              <circle r="9" className="hit" />
              <circle r="5" className="dot" />
            </g>
          );
        })}
      </g>

      {now && nowPos && (
        <g className="now" transform={`translate(${nowPos.x},${nowPos.y}) scale(${s})`} pointerEvents="none">
          <circle r="9" className="ring" data-testid="current-ring" />
          <PlaceFlag text={now.place!.name} flip={nowPos.x > vb.x + vb.w * 0.62} />
        </g>
      )}
      {nationwide && (
        <g className="now" transform={`translate(${vb.x + vb.w / 2},${vb.y + vb.h - 32 * s}) scale(${s})`} pointerEvents="none">
          <g className="flag">
            <rect x="-120" y="-14" width="240" height="28" />
            <text y="5" textAnchor="middle">The whole archipelago</text>
          </g>
        </g>
      )}
    </svg>
  );
}

function PlaceFlag({ text, flip }: { text: string; flip: boolean }) {
  const w = text.length * 7 + 20;
  return (
    <g className="flag" transform={`translate(${flip ? -14 - w : 14},0)`}>
      <rect y="-13" width={w} height="24" />
      <text x="10" y="4">{text}</text>
    </g>
  );
}
