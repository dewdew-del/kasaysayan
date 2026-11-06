"use client";

import { useEffect, useRef, useState } from "react";
import { startWaltz } from "@/lib/waltz";

type AudioCtor = typeof AudioContext;
const getCtor = (): AudioCtor | undefined =>
  typeof window === "undefined" ? undefined : (window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext);

/**
 * Music button: off by default, never autoplays. The AudioContext is created and
 * resumed inside the click, which iOS Safari requires. Hidden if Web Audio is missing.
 */
export default function MusicToggle() {
  const [supported, setSupported] = useState(false);
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const stop = useRef<(() => void) | null>(null);

  useEffect(() => setSupported(Boolean(getCtor())), []);
  useEffect(() => () => stop.current?.(), []);

  if (!supported) return null;

  const toggle = () => {
    if (on) {
      stop.current?.();
      stop.current = null;
      setOn(false);
      return;
    }
    try {
      const Ctor = getCtor()!;
      ctx.current ??= new Ctor();
      void ctx.current.resume();
      stop.current = startWaltz(ctx.current);
      setOn(true);
    } catch {
      setSupported(false);
    }
  };

  return (
    <button type="button" className="music" aria-pressed={on} onClick={toggle}>
      ♪ {on ? "Music on" : "Music"}
    </button>
  );
}
