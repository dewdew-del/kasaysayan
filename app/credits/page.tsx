import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/events";
import CreditsList from "@/components/CreditsList";

export const metadata: Metadata = { title: "Credits · Kasaysayan", description: "Every photo, map and font used on Kasaysayan, with its author and license." };

export default function CreditsPage() {
  return (
    <main className="page">
      <h1>Credits</h1>
      <p className="lead">Every photo on the site, its author and its license. This page is built from the event files, so it never falls out of date.</p>
      <CreditsList events={getPublishedEvents()} />
    </main>
  );
}
