import Link from "next/link";
import Engraving from "@/components/Engraving";

export default function NotFound() {
  return (
    <main className="page narrow center">
      <Engraving era="spanish" />
      <h1>Lost at sea</h1>
      <p>This page isn&apos;t on our map. It may have moved, or the link may be wrong.</p>
      <Link href="/" className="read-btn">
        Back to the map <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
