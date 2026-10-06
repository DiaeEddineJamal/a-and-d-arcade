// Same-origin copies of Flash files whose host sends no CORS headers, so Ruffle can fetch them.
// Only listed files are served; this is not an open proxy.
const SOURCES: Record<string, string> = {
  "zuma-the-lost-treasure.swf": "https://archive.org/download/suma-the-lost-treasure_flash/Suma-The-Lost-Treasure.swf",
};

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const source = SOURCES[(await params).file];
  if (!source) return new Response("Not found", { status: 404 });
  const upstream = await fetch(source, { next: { revalidate: 86400 } });
  if (!upstream.ok || !upstream.body) return new Response("Upstream unavailable", { status: 502 });
  return new Response(upstream.body, {
    headers: { "content-type": "application/x-shockwave-flash", "cache-control": "public, max-age=86400" },
  });
}
