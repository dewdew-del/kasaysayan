import type { EraId } from "@/lib/schema";

// Original sepia line drawings, one per era (ported from docs/mockups/ui-prototype-v3.html).
// Classes: .f = paper fill, .d = ink fill, .r = red fill.
const edsaCrowd = [14, 28, 42, 56, 70, 84, 98]
  .map((x, i) => `<circle cx="${x + 3}" cy="${44 - (i % 2) * 4}" r="5" class="f"/><path d="M${x - 3},66 q6,-18 12,0"/>`)
  .join("");

const DRAWINGS: Record<EraId, string> = {
  precolonial: `<path d="M10,58 q50,14 100,0"/><path class="f" d="M18,52 Q60,66 102,52 L96,46 L24,46 Z"/><path d="M60,46 V10"/><path class="f" d="M60,12 L88,40 L60,40 Z"/><path class="f" d="M58,16 L36,40 L58,40 Z"/><circle cx="20" cy="18" r="7"/><path d="M8,68 q6,-4 12,0 t12,0 t12,0 M70,70 q6,-4 12,0 t12,0"/>`,
  spanish: `<path class="f" d="M20,52 L100,52 L92,64 L30,64 Z"/><path d="M28,52 V12 M60,52 V6 M88,52 V16"/><path class="f" d="M22,16 q6,8 0,16 h12 q6,-8 0,-16 Z M50,10 q8,10 0,22 h20 q8,-12 0,-22 Z M50,36 q6,6 0,12 h20 q6,-6 0,-12 Z M82,20 q5,7 0,14 h12 q5,-7 0,-14 Z"/><path class="r" d="M60,6 l10,3 l-10,3 Z"/><path d="M6,70 q8,-5 16,0 t16,0 t16,0 t16,0 t16,0 t16,0"/>`,
  revolution: `<path d="M24,70 V8"/><path class="r" d="M24,10 h70 v34 h-70 Z"/><circle cx="59" cy="27" r="7" class="f"/><path d="M59,14 v-2 M59,42 v-2 M46,27 h-2 M74,27 h-2 M50,18 l-2,-2 M68,36 l2,2 M68,18 l2,-2 M50,36 l-2,2"/><text x="59" y="31" font-size="9" text-anchor="middle" class="t">K</text><path d="M14,70 h20"/>`,
  american: `<path class="f" d="M14,30 L60,10 L106,30 Z"/><path class="f" d="M18,30 h84 v6 h-84 Z"/><path d="M26,36 v26 M40,36 v26 M54,36 v26 M66,36 v26 M80,36 v26 M94,36 v26"/><path class="f" d="M12,62 h96 v6 h-96 Z"/><path d="M8,72 h104"/>`,
  japanese: `<path class="f" d="M22,40 h76 l-8,6 h-60 Z"/><path d="M60,40 V30"/><path class="f" d="M30,30 h60 l-6,-4 h-48 Z"/><path d="M20,62 l8,-6 l8,6 l8,-6 l8,6 l8,-6 l8,6 l8,-6 l8,6 l8,-6 l8,6"/><path d="M14,58 h92"/><path d="M34,14 l12,4 l12,-4 M70,10 l8,3 l8,-3"/>`,
  third: `<path d="M20,72 V6"/><path class="f" d="M20,8 h74 v22 h-74 Z"/><path class="d" d="M20,30 h74 v22 h-74 Z" opacity=".55"/><path class="f" d="M20,8 L48,30 L20,52 Z"/><circle cx="30" cy="30" r="5" class="r"/><path d="M24,14 l1,2 M24,46 l1,-2 M42,30 h2"/>`,
  martial: `<path class="f" d="M30,8 h60 v58 h-60 Z"/><path d="M38,18 h44 M38,26 h44 M38,34 h36 M38,42 h44 M38,50 h28"/><circle cx="74" cy="56" r="8" class="r"/><text x="60" y="76" font-size="8" text-anchor="middle" class="t">No. 1081</text>`,
  edsa: `${edsaCrowd}<path d="M26,36 L22,14 M60,32 L62,10 M94,36 L98,14"/><path class="r" d="M58,8 q6,6 12,0 l-4,10 Z"/>`,
  modern: `<path d="M60,40 m0,-4 a4,4 0 1,1 -4,4 a10,10 0 1,1 10,10 a18,18 0 1,1 -18,-18 a26,26 0 0,1 26,26"/><path class="r" d="M14,66 l14,-6 l-6,-4 l14,-6 M78,66 l10,-8 l-4,-2 l10,-8"/>`,
};

export default function Engraving({ era, className = "" }: { era: EraId; className?: string }) {
  // The drawings are fixed strings written for this project, not user content.
  return (
    <svg
      className={`engraving ${className}`}
      viewBox="0 0 120 80"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: DRAWINGS[era] }}
    />
  );
}
