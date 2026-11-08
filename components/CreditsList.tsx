import Link from "next/link";
import type { Event } from "@/lib/events";
import { TRACKS } from "@/lib/tracks";

const OTHER = [
  ["Coastline", "Natural Earth, Admin 0 Countries 1:10m (v5.1.1)", "Public domain", "https://www.naturalearthdata.com/"],
  ["Street maps on event pages", "© OpenStreetMap contributors", "Open Database License", "https://www.openstreetmap.org/copyright"],
  ["Fonts", "IM Fell English and IM Fell English SC by Igino Marini", "SIL Open Font License", "https://fonts.google.com/specimen/IM+Fell+English"],
  ["Ink illustrations and map drawings", "Original drawings for this site", "Public domain (CC0)", null],
] as const;

/** Every photo on the site with its author, license and source, built from the event files. */
export default function CreditsList({ events }: { events: Event[] }) {
  const rows = events.flatMap((e) => e.images.map((image, i) => ({ e, image, i })));
  return (
    <>
      <div className="tablewrap">
        <table aria-label="Photo credits">
          <thead>
            <tr>
              <th>Event</th>
              <th>Photo</th>
              <th>Author</th>
              <th>License</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ e, image, i }) => (
              <tr key={`${e.id}-${i}`}>
                <td>
                  <Link href={`/events/${e.id}`}>{e.title}</Link>
                </td>
                <td>{image.caption}</td>
                <td>{image.author}</td>
                <td>{image.license}</td>
                <td>
                  <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {new URL(image.sourceUrl).hostname.replace(/^www\./, "")}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="lead">No photos published yet.</p>}

      <h2>Maps and fonts</h2>
      <ul className="other-credits">
        {OTHER.map(([what, who, license, url]) => (
          <li key={what}>
            <b>{what}:</b> {url ? <a href={url} target="_blank" rel="noopener noreferrer">{who}</a> : who}. {license}.
          </li>
        ))}
      </ul>

      <h2>Music</h2>
      <ul className="other-credits" aria-label="Music credits">
        {TRACKS.map((t) => (
          <li key={t.id}>
            <b>{t.name}:</b> {t.sourceUrl ? <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer">{t.performer}</a> : t.performer}. {t.about}. {t.license}.
          </li>
        ))}
      </ul>
    </>
  );
}
