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
    const cached = await caches.match(request, { ignoreVary: true }) || await caches.match(request, { ignoreVary: true, ignoreSearch: true });
    if (cached) return cached;
    throw error;
  }
}
