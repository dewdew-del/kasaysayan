"use client";

import { useEffect, useState } from "react";

/** Thin red bar at the top of the page that fills as you read. */
export default function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setP(Math.min(1, d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="reading-progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}
