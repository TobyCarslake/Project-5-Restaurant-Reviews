const cacheName = 'v1';

const cacheAssets =[
    'index.html'
    

];

//call install event
self.addEventListener('install', z => {
    console.log('Service Worker: installed');

    z.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service worker: caching files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

//call activate event
self.addEventListener('activate', z => {
    console.log('Service Worker: activated');
    //remove old caches
    z.waitUntil(
        caches.keys().then(cacheName => {
            return Promise.all(
                cacheName.map(cache => {
                    if(cache != cacheName) {
                        console.log('Service worker: clearing old caches');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

//call fetch event
self.addEventListener('fetch', z => {
    console.log('Service worker: fetching');
    z.respondWith(
        fetch(z.request).catch(() => caches.match(z.request))
    );
});
