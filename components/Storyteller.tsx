"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Event } from "@/lib/events";
import { toCard, type EventCard } from "@/lib/card";
import { ERAS, ERA_LABELS, type TopicId } from "@/lib/schema";
import { dateLabel, sortKey } from "@/lib/dates";
import { filterByTopic, parseTopic } from "@/lib/filter";
import { markerPositions } from "@/lib/map";
import { centerView, fullView, isComfortablyInView, panView, zoomLevel, zoomView, type View } from "@/lib/zoom";
import StoryMap from "./StoryMap";
import StoryStep from "./StoryStep";
import ScaleBar from "./ScaleBar";
import TopicFilter from "./TopicFilter";
import Engraving from "./Engraving";
import MusicToggle from "./MusicToggle";

export const PLAY_INTERVAL_MS = 2200;
const ZOOM_STEP = 1.6;
/** Events within this many map units of each other count as "the same place". */
const SAME_PLACE = 30;

export const toCards = (events: Event[]): EventCard[] => events.map(toCard);

/**
 * The storyteller home page. ?topic= is read from the address bar after the page loads,
 * so the static HTML (and first paint) always shows every event.
 */
export default function Storyteller({ events }: { events: EventCard[] }) {
  const [topic, setTopicState] = useState<TopicId | null>(null);
  useEffect(() => {
    const read = () => setTopicState(parseTopic(new URLSearchParams(window.location.search).get("topic")));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const setTopic = (t: TopicId | null) => {
    window.history.replaceState(null, "", t ? `${window.location.pathname}?topic=${t}` : window.location.pathname);
    setTopicState(t);
  };
  return <StorytellerView events={events} topic={topic} onTopicChange={setTopic} />;
}

type ViewProps = { events: EventCard[]; topic: TopicId | null; onTopicChange: (t: TopicId | null) => void };

function StorytellerView({ events: all, topic, onTopicChange: setTopic }: ViewProps) {
  const events = useMemo(() => filterByTopic(all, topic), [all, topic]);
  const pos = useMemo(() => markerPositions(events), [events]);

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<View>(fullView);
  const [cardId, setCardId] = useState<string | null>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  // Reset when the filter changes the list.
  useEffect(() => {
    setCurrent(0);
    setPlaying(false);
    setCardId(null);
  }, [topic]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    const el = stepRefs.current[i];
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, []);

  // Scroll sync: the step crossing the middle of the screen becomes current.
  useEffect(() => {
    if (playing) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setCurrent(Number((en.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [events, playing]);

  // Play: advance every PLAY_INTERVAL_MS and stop at the last event.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setCurrent((c) => {
        if (c >= events.length - 1) {
          setPlaying(false);
          return c;
        }
        const next = c + 1;
        stepRefs.current[next]?.scrollIntoView({ block: "center", behavior: "smooth" });
        if (next >= events.length - 1) setPlaying(false);
        return next;
      });
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(t);
  }, [playing, events.length]);

  // When zoomed in, keep the current event in view.
  useEffect(() => {
    const e = events[current];
    const p = e && pos.get(e.id);
    if (!p) return;
    setView((v) => (zoomLevel(v) > 1.02 && !isComfortablyInView(v, p.x, p.y) ? centerView(v, p.x, p.y) : v));
  }, [current, events, pos]);

  // Escape closes the place card.
  useEffect(() => {
    const onKey = (k: KeyboardEvent) => k.key === "Escape" && setCardId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const togglePlay = () => {
    if (playing) return setPlaying(false);
    if (current >= events.length - 1) goTo(0);
    setPlaying(true);
  };
  const seek = (i: number) => {
    setPlaying(false);
    goTo(i);
  };

  const eraBands = ERAS.map((era) => ({ era, n: events.filter((e) => e.era === era).length })).filter((b) => b.n);
  const ticks = useMemo(() => pickTicks(events), [events]);

  return (
    <div className="stage">
      <section className="story" aria-label="Story">
        <div className="intro">
          <div className="orn" aria-hidden="true">❦</div>
          <h1>A History of the Islands</h1>
          <p>Scroll down to travel through time.</p>
          <TopicFilter value={topic} onChange={setTopic} />
        </div>
        {events.length === 0 && (
          <p className="empty">{all.length ? "No events for this topic yet." : "No events published yet."}</p>
        )}
        {events.map((e, i) => (
          <div key={e.id} ref={(el) => void (stepRefs.current[i] = el)} data-index={i} className="step-anchor">
            <StoryStep event={e} index={i} active={i === current} />
          </div>
        ))}
      </section>

      <aside className="mapside" aria-label="Map">
        <ZoomableMap view={view} setView={setView}>
          <StoryMap events={events} current={current} onMarkerClick={setCardId} viewBox={view} />
        </ZoomableMap>
        {cardId && <PlaceCard id={cardId} events={events} pos={pos} onPick={setCardId} onClose={() => setCardId(null)} />}
        <ScaleBar
          count={events.length}
          current={current}
          eraBands={eraBands}
          ticks={ticks}
          onSeek={seek}
          playing={playing}
          onTogglePlay={togglePlay}
        />
      </aside>
    </div>
  );
}

/** About seven evenly spaced, short year labels under the scale bar. */
export function pickTicks(events: Pick<EventCard, "date">[]) {
  if (!events.length) return [];
  const n = Math.min(7, events.length);
  const idx = [...new Set(Array.from({ length: n }, (_, k) => Math.round((k * (events.length - 1)) / Math.max(1, n - 1))))];
  return idx.map((index) => {
    const year = Math.floor(sortKey(events[index].date));
    return { index, label: year < 0 ? `${Math.abs(year).toLocaleString("en-US")} BP` : String(year) };
  });
}

function ZoomableMap({ view, setView, children }: { view: View; setView: (f: (v: View) => View) => void; children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pts: Map<number, [number, number]>; moved: number; pinch: number | null }>({ pts: new Map(), moved: 0, pinch: null });

  /** Converts a screen point to map units using the svg's current transform. */
  const toMap = (clientX: number, clientY: number): [number, number] | null => {
    const svg = wrap.current?.querySelector("svg");
    const m = svg?.getScreenCTM?.();
    if (!m) return null;
    const inv = m.inverse();
    return [inv.a * clientX + inv.c * clientY + inv.e, inv.b * clientX + inv.d * clientY + inv.f];
  };
  const unitsPerPx = () => wrap.current?.querySelector("svg")?.getScreenCTM?.()?.a ?? 1;

  // Wheel zoom needs a non-passive listener so the page doesn't scroll.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const p = toMap(ev.clientX, ev.clientY);
      setView((v) => zoomView(v, ev.deltaY < 0 ? 1.25 : 0.8, p?.[0] ?? v.x + v.w / 2, p?.[1] ?? v.y + v.h / 2));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setView]);

  const onPointerDown = (ev: React.PointerEvent) => {
    const d = drag.current;
    d.pts.set(ev.pointerId, [ev.clientX, ev.clientY]);
    d.moved = 0;
    if (d.pts.size === 2) {
      const [a, b] = [...d.pts.values()];
      d.pinch = Math.hypot(a[0] - b[0], a[1] - b[1]);
    }
  };
  const onPointerMove = (ev: React.PointerEvent) => {
    const d = drag.current;
    const last = d.pts.get(ev.pointerId);
    if (!last) return;
    d.pts.set(ev.pointerId, [ev.clientX, ev.clientY]);
    if (d.pts.size === 2 && d.pinch) {
      const [a, b] = [...d.pts.values()];
      const dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const mid = toMap((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      const f = dist / d.pinch;
      d.pinch = dist;
      d.moved = 99;
      setView((v) => zoomView(v, f, mid?.[0] ?? v.x + v.w / 2, mid?.[1] ?? v.y + v.h / 2));
      return;
    }
    const dx = ev.clientX - last[0];
    const dy = ev.clientY - last[1];
    d.moved += Math.abs(dx) + Math.abs(dy);
    if (d.moved > 4) {
      (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
      const k = unitsPerPx();
      setView((v) => panView(v, -dx / k, -dy / k));
    }
  };
  const onPointerUp = (ev: React.PointerEvent) => {
    const d = drag.current;
    d.pts.delete(ev.pointerId);
    if (d.pts.size < 2) d.pinch = null;
  };
  // A drag must not also count as a click on a marker.
  const onClickCapture = (ev: React.MouseEvent) => {
    if (drag.current.moved > 4) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  };

  const center = (v: View): [number, number] => [v.x + v.w / 2, v.y + v.h / 2];
  return (
    <div
      className="mapwrap"
      ref={wrap}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      {children}
      <MusicToggle />
      <div className="zoomctl" role="group" aria-label="Map zoom">
        <button type="button" aria-label="Zoom in" onClick={() => setView((v) => zoomView(v, ZOOM_STEP, ...center(v)))}>
          +
        </button>
        <span>{zoomLevel(view).toFixed(1)}×</span>
        <button type="button" aria-label="Zoom out" onClick={() => setView((v) => zoomView(v, 1 / ZOOM_STEP, ...center(v)))}>
          −
        </button>
        <button type="button" aria-label="Show whole map" onClick={() => setView(() => fullView())}>
          ⤢
        </button>
      </div>
    </div>
  );
}

function PlaceCard({
  id,
  events,
  pos,
  onPick,
  onClose,
}: {
  id: string;
  events: EventCard[];
  pos: Map<string, { x: number; y: number }>;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const e = events.find((x) => x.id === id);
  const p = pos.get(id);
  if (!e || !p) return null;
  const others = events.filter((x) => {
    const q = pos.get(x.id);
    return x.id !== id && q && Math.hypot(q.x - p.x, q.y - p.y) < SAME_PLACE;
  });
  const cover = e.images[0];
  return (
    <div className="place-card" role="dialog" aria-label={e.title}>
      <button type="button" className="close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cover" src={`/images/events/${cover.file}`} alt={cover.alt} />
      ) : (
        <div className="cover engraving-box">
          <Engraving era={e.era} />
        </div>
      )}
      <div className="body">
        <div className="when">
          {dateLabel(e.date)} · {ERA_LABELS[e.era]}
        </div>
        <h3>{e.title}</h3>
        <div className="where">{e.place?.name}</div>
        <Link className="read-btn small" href={`/events/${e.id}`}>
          Read the story <span aria-hidden="true">→</span>
        </Link>
        {others.length > 0 && (
          <div className="also">
            <small>Also at this place</small>
            {others.map((o) => (
              <button type="button" key={o.id} onClick={() => onPick(o.id)}>
                {o.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/images/events/${o.images[0].file}`} alt="" />
                )}
                <span>
                  {dateLabel(o.date)} · {o.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
