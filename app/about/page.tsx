import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = { title: "How we check facts · Kasaysayan", description: "How Kasaysayan chooses, sources and fact-checks every event." };

export default function AboutPage() {
  return (
    <main className="page narrow">
      <h1>How we check facts</h1>
      <AboutContent />
    </main>
  );
}
