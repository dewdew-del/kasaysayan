"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Event } from "@/lib/events";
import { ERA_LABELS } from "@/lib/schema";
import { dateLabel } from "@/lib/dates";
import Engraving from "./Engraving";
import Figure from "./Figure";
import LongRead, { placedImages } from "./LongRead";
import Gallery from "./Gallery";
import Lightbox from "./Lightbox";
import ReadingProgress from "./ReadingProgress";

const EventMiniMap = dynamic(() => import("./EventMiniMap"), { ssr: false });

/** The long-read page for one event. */
export default function EventArticle({ event: e, prev, next }: { event: Event; prev?: Event; next?: Event }) {
  const [open, setOpen] = useState<number | null>(null);
  const onOpen = useCallback((i: number) => setOpen(i), []);
  const onClose = useCallback(() => setOpen(null), []);
  const cover = e.images[0];
  const exclude = [0, ...placedImages(e.story)];
  const n = e.images.length;

  return (
    <>
      <ReadingProgress />
      <article className="event">
        <Link className="back" href="/">
          ← Back to the map
        </Link>
        {!e.verified && <div className="draft-badge">Draft · not fact-checked</div>}
        <div className="year">{dateLabel(e.date)}</div>
        <div className="era-tag">{ERA_LABELS[e.era]}</div>
        <h1>{e.title}</h1>
        <p className="byline">
          {e.place?.name ?? "The whole archipelago"} · {e.story.readMinutes} min read
          {n > 0 && ` · ${n} photo${n === 1 ? "" : "s"}`}
        </p>

        {cover ? (
          <Figure image={cover} index={0} onOpen={onOpen} className="photo hero" lazy={false} />
        ) : (
          <div className="photo hero engraving-box">
            <Engraving era={e.era} />
          </div>
        )}

        {e.contested && (
          <div className="note">
            <b>Sources differ.</b> {e.contestedNote}
          </div>
        )}

        <LongRead story={e.story} images={e.images} onOpen={onOpen} />
        <Gallery images={e.images} exclude={exclude} onOpen={onOpen} />

        <div className="placebox">
          {e.place ? <EventMiniMap place={e.place} /> : <div className="note">This happened across the whole archipelago, so there is no pin.</div>}
        </div>

        <section className="sources" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources</h2>
          <ol aria-label="Sources">
            {e.sources.map((s, i) => (
              <li key={i} id={`source-${i + 1}`}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                , {s.publisher}. Accessed {s.accessed}.
              </li>
            ))}
          </ol>
        </section>

        <nav className="pn" aria-label="Earlier and later events">
          {prev ? (
            <Link href={`/events/${prev.id}`}>
              <small>← Earlier</small> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/events/${next.id}`} className="later">
              <small>Later →</small> {next.title}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
      {open !== null && n > 0 && <Lightbox images={e.images} startIndex={open} onClose={onClose} />}
    </>
  );
}
