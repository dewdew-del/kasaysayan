"use client";

import { useEffect, useRef, useState } from "react";
import type { EventImage } from "@/lib/schema";
import { Credit } from "./Figure";

/** Full-size photo viewer: Previous/Next, "n / N", arrow keys and Escape. */
export default function Lightbox({ images, startIndex, onClose }: { images: EventImage[]; startIndex: number; onClose: () => void }) {
  const [at, setAt] = useState(startIndex);
  const close = useRef<HTMLButtonElement>(null);
  const n = images.length;
  const go = (d: number) => setAt((i) => (i + d + n) % n);

  useEffect(() => close.current?.focus(), []);
  useEffect(() => {
    const onKey = (k: KeyboardEvent) => {
      if (k.key === "Escape") onClose();
      else if (k.key === "ArrowRight") setAt((i) => (i + 1) % n);
      else if (k.key === "ArrowLeft") setAt((i) => (i - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [n, onClose]);

  const image = images[at];
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="lb-close" aria-label="Close" ref={close} onClick={onClose}>
        ✕
      </button>
      <button type="button" className="lb-prev" aria-label="Previous photo" onClick={() => go(-1)}>
        ‹
      </button>
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/events/${image.file}`} alt={image.alt} />
        <figcaption>
          <span className="count">
            {at + 1} / {n}
          </span>
          <span className="cap">{image.caption}.</span> <Credit image={image} />
        </figcaption>
      </figure>
      <button type="button" className="lb-next" aria-label="Next photo" onClick={() => go(1)}>
        ›
      </button>
    </div>
  );
}
