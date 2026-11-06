import { Suspense } from "react";
import { getPublishedEvents } from "@/lib/events";
import Storyteller, { StorytellerFallback } from "@/components/Storyteller";

// Server component: reads and validates the event files at build time.
export default function Home() {
  const events = getPublishedEvents();
  return (
    // useSearchParams (for ?topic=) needs a Suspense boundary in a static export.
    // The fallback is the full page, so the static HTML is never empty.
    <Suspense fallback={<StorytellerFallback events={events} />}>
      <Storyteller events={events} />
    </Suspense>
  );
}
