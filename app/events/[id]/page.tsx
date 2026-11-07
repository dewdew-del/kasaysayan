import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedEvents } from "@/lib/events";
import EventArticle from "@/components/EventArticle";

export const dynamicParams = false;

export function generateStaticParams() {
  const ids = getPublishedEvents().map((e) => ({ id: e.id }));
  // A static export refuses a dynamic route with zero pages; "_none" renders the 404.
  return ids.length ? ids : [{ id: "_none" }];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = getPublishedEvents().find((x) => x.id === id);
  return e ? { title: `${e.title} · Kasaysayan`, description: e.summary } : {};
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const events = getPublishedEvents();
  const i = events.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const slim = (x?: (typeof events)[number]) => (x ? { id: x.id, title: x.title } : undefined);
  return <EventArticle event={events[i]} prev={slim(events[i - 1])} next={slim(events[i + 1])} />;
}
