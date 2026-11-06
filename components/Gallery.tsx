import type { EventImage } from "@/lib/schema";
import Figure from "./Figure";

/** "More photographs": every image not used as the cover or placed in the text. */
export default function Gallery({ images, exclude, onOpen }: { images: EventImage[]; exclude: number[]; onOpen: (i: number) => void }) {
  const rest = images.map((image, index) => ({ image, index })).filter((x) => !exclude.includes(x.index));
  if (!rest.length) return null;
  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title">More photographs</h2>
      <div className="grid">
        {rest.map(({ image, index }) => (
          <Figure key={index} image={image} index={index} onOpen={onOpen} className="gcell" />
        ))}
      </div>
    </section>
  );
}
