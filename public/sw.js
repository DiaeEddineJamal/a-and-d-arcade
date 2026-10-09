// Offline support.
// Downloaded games (src/app/offline.ts, "offline:<id>" caches) are answered from disk first: playing them
// never touches the network. Portal pages: network first, with the cached copy when offline.
// ponytail: the "shell" cache is never pruned; old deploy chunks pile up until the user clears site data.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", event => {
  const { request } = event;
  const sameOrigin = new URL(request.url).origin === location.origin;
  if (request.method !== "GET" || (sameOrigin && request.headers.has("range"))) return;
  event.respondWith(respond(request, sameOrigin));
});

async function respond(request, sameOrigin) {
  // a Range request gets the whole file: the only ranged loader (Hill Climb's split shim) trims a 200 itself
  for (const name of await caches.keys()) {
    if (!name.startsWith("offline:")) continue;
    const saved = await (await caches.open(name)).match(request, { ignoreVary: true });
    if (saved) return saved;
  }
  return sameOrigin ? page(request) : fetch(request);
}

async function page(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open("shell").then(cache => cache.put(request, copy)).catch(() => {});
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreVary: true }) || await offlineStandIn(request);
    if (cached) return cached;
    throw error;
  }
}

// Offline and nothing saved under this exact address.
async function offlineStandIn(request) {
  const url = new URL(request.url);
  // a resized image: any saved width of the same picture (the shelf saves every cover at 256px)
  if (url.pathname === "/_next/image") {
    const shell = await caches.open("shell");
    const picture = url.searchParams.get("url");
    for (const saved of await shell.keys()) {
      const savedUrl = new URL(saved.url);
      if (savedUrl.pathname === "/_next/image" && savedUrl.searchParams.get("url") === picture) return shell.match(saved, { ignoreVary: true });
    }
    return caches.match(picture, { ignoreVary: true });
  }
  // a page or its router data under another query string: the saved page itself
  if (request.mode === "navigate" || request.headers.has("rsc")) return caches.match(url.pathname, { ignoreVary: true });
}
