import type { EventImage } from "@/lib/schema";

/** One credited photo. Clicking it opens the lightbox at `index`. */
export default function Figure({
  image,
  index,
  className,
  onOpen,
  lazy = true,
}: {
  image: EventImage;
  index: number;
  className: string;
  onOpen: (index: number) => void;
  lazy?: boolean;
}) {
  return (
    <figure className={className}>
      <button type="button" className="zoom" aria-label={`Enlarge photo: ${image.caption}`} onClick={() => onOpen(index)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/events/${image.file}`} alt={image.alt} loading={lazy ? "lazy" : "eager"} />
      </button>
      <figcaption>
        <span className="cap">{image.caption}.</span> <Credit image={image} />
      </figcaption>
    </figure>
  );
}

export function Credit({ image }: { image: EventImage }) {
  return (
    <span className="credit">
      {image.author}. {image.license}, via{" "}
      <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
        {new URL(image.sourceUrl).hostname.replace(/^www\./, "")}
      </a>
    </span>
  );
}
