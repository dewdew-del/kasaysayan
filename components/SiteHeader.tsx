import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <b>Kasaysayan</b>
        <span>Philippine history, island by island</span>
      </Link>
      <nav aria-label="Main">
        <Link href="/">The Map</Link>
        <Link href="/credits">Credits</Link>
        <Link href="/about">How we check facts</Link>
      </nav>
    </header>
  );
}
