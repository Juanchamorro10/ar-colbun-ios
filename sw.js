// Cache para uso sin conexión. Cada vez que cambien archivos, suban el número de versión.
const VERSION = "angostura-v9";
const CORE = [
  "./", "index.html", "lib/model-viewer.min.js",
  "models/estacion1.glb", "models/estacion2.glb", "models/estacion3.glb",
  "models/estacion4.glb", "models/estacion5.glb"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Páginas: primero internet (así siempre ven la última versión), y si no hay señal, el caché.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(h => h || caches.match("index.html")))
    );
    return;
  }

  // Modelos y librerías: primero caché.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit =>
      hit || fetch(req).then(res => {
        if (res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      })
    )
  );
});
