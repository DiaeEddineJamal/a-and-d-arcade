import Link from "next/link";
export default function NotFound() {
  return <section className="not-found"><h1>404</h1><p>This disk is empty.</p><Link href="/collection" className="retro-button">Back to the collection ↗</Link></section>;
}
