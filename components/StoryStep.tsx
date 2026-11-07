import Link from "next/link";
import type { EventCard } from "@/lib/card";
import { ERA_LABELS } from "@/lib/schema";
import { dateLabel } from "@/lib/dates";
import Engraving from "./Engraving";

export type StoryStepProps = { event: EventCard; index: number; active: boolean };

/** One event on the storyteller page: cover photo, era, year, title, summary and one Read button. */
export default function StoryStep({ event: e, index, active }: StoryStepProps) {
  const href = `/events/${e.id}`;
  const cover = e.images[0];
  const label = dateLabel(e.date);
  return (
    <article className={`step${active ? " active" : ""}`} data-index={index} aria-current={active ? "step" : undefined}>
      <Link href={href} className="step-pic" tabIndex={-1} aria-hidden="true">
        {cover ? (
          <figure className="print">
            {/* Static export: plain img, already sized WebP. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/events/${cover.file}`} alt="" loading="lazy" />
          </figure>
        ) : (
          <Engraving era={e.era} />
        )}
      </Link>
      {!e.verified && <div className="draft-badge">Draft · not fact-checked</div>}
      <div className="era-tag">{ERA_LABELS[e.era]}</div>
      <div className={`year${label.length > 6 ? " long" : ""}`}>{label}</div>
      <h2>{e.title}</h2>
      <p>{e.summary}</p>
      <div className="meta">
        <span>{e.place?.name ?? "The whole archipelago"}</span>
        {e.contested && <span className="contested">· Sources differ</span>}
      </div>
      <Link href={href} className="read-btn">
        Read the story <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
