"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

/**
 * Street map of the event's place (Leaflet + OpenStreetMap), sepia-toned.
 * Client-only: load it with next/dynamic and ssr:false.
 */
export default function EventMiniMap({ place }: { place: { name: string; lat: number; lng: number } }) {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true }).setView([place.lat, place.lng], 11);
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      }).addTo(map);
      let errors = 0;
      tiles.on("tileerror", () => {
        if (++errors >= 4) setFailed(true);
      });
      L.circleMarker([place.lat, place.lng], { radius: 8, color: "#2a2118", weight: 2, fillColor: "#a3322a", fillOpacity: 1 })
        .addTo(map)
        .bindTooltip(place.name);
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [place.lat, place.lng, place.name]);

  return (
    <div className="mini-map">
      {failed ? <p className="mini-map-fallback">{place.name}</p> : <div ref={el} className="mini-map-canvas" aria-label={`Map of ${place.name}`} role="img" />}
      <small>{place.name}</small>
    </div>
  );
}
