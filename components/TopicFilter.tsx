"use client";

import { TOPICS, type TopicId } from "@/lib/schema";
import { TOPIC_LABELS } from "@/lib/filter";

export default function TopicFilter({ value, onChange }: { value: TopicId | null; onChange: (t: TopicId | null) => void }) {
  return (
    <div className="topics" role="group" aria-label="Filter by topic">
      <button type="button" aria-pressed={value === null} onClick={() => onChange(null)}>
        All
      </button>
      {TOPICS.map((t) => (
        <button key={t} type="button" aria-pressed={value === t} onClick={() => onChange(value === t ? null : t)}>
          {TOPIC_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
