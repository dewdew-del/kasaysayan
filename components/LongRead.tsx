import { Fragment } from "react";
import type { Story } from "@/lib/story";
import type { EventImage } from "@/lib/schema";
import Figure from "./Figure";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** "[1]" in the text becomes a superscript link to source 1. */
function withCitations(text: string) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((p, i) => {
    const m = /^\[(\d+)\]$/.exec(p);
    return m ? (
      <sup key={i}>
        <a href={`#source-${m[1]}`}>{p}</a>
      </sup>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    );
  });
}

/** The story in chapters, with {{photo:n}} photos placed between paragraphs. */
export default function LongRead({ story, images, onOpen }: { story: Story; images: EventImage[]; onOpen: (i: number) => void }) {
  let titled = 0;
  let placed = 0;
  return (
    <div className="longread">
      {story.chapters.map((ch, ci) => (
        <section className="chapter" key={ci}>
          {ch.heading && (
            <h2>
              <span className="num">{ROMAN[titled++] ?? titled}</span>
              {ch.heading}
            </h2>
          )}
          {ch.blocks.map((b, bi) =>
            b.type === "p" ? (
              <p key={bi}>{withCitations(b.text)}</p>
            ) : images[b.index] ? (
              <Figure key={bi} image={images[b.index]} index={b.index} onOpen={onOpen} className={`photo inline ${placed++ % 2 ? "right" : "left"}`} />
            ) : null,
          )}
        </section>
      ))}
    </div>
  );
}

/** Indexes of images placed in the text with {{photo:n}}. */
export function placedImages(story: Story): number[] {
  return story.chapters.flatMap((c) => c.blocks.flatMap((b) => (b.type === "photo" ? [b.index] : [])));
}
