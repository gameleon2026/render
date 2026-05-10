var version = "2.25.4";

const cacheName = `superSplat-v${version}`;
const cacheUrls = [
    './',
    './index.css',
    './index.html',
    './index.js',
    './index.js.map',
    './manifest.json',
    './static/icons/logo-192.png',
    './static/icons/logo-512.png',
    './static/images/screenshot-narrow.jpg',
    './static/images/screenshot-wide.jpg',
    './static/lib/lodepng/lodepng.js',
    './static/lib/lodepng/lodepng.wasm',
    './static/lib/webp/webp.mjs',
    './static/lib/webp/webp.wasm',
    './static/locales/de.json',
    './static/locales/en.json',
    './static/locales/fr.json',
    './static/locales/ja.json',
    './static/locales/ko.json',
    './static/locales/zh-CN.json'
];
self.addEventListener('install', (event) => {
    console.log(`installing v${version}`);
    // create cache for current version
    event.waitUntil(caches.open(cacheName)
        .then((cache) => {
        cache.addAll(cacheUrls);
    }));
});
self.addEventListener('activate', () => {
    console.log(`activating v${version}`);
    // delete the old caches once this one is activated
    caches.keys().then((names) => {
        for (const name of names) {
            if (name !== cacheName) {
                caches.delete(name);
            }
        }
    });
});
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    // PLY is large and often loaded with Range (206) / revalidation (304). Cache-first
    // can surface empty or wrong bodies in DevTools; never use the app shell cache for it.
    if (url.pathname.endsWith('.ply')) {
        event.respondWith(fetch(req));
        return;
    }
    event.respondWith(caches.match(req)
        .then((response) => response ?? fetch(req)));
});
//# sourceMappingURL=sw.js.map
