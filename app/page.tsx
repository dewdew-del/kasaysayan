import { getPublishedEvents } from "@/lib/events";
import { toCard } from "@/lib/card";
import Storyteller from "@/components/Storyteller";

// Server component: reads and validates the event files at build time,
// then hands the client only the small card data the home page needs.
export default function Home() {
  const cards = getPublishedEvents().map(toCard);
  return <Storyteller events={cards} />;
}
