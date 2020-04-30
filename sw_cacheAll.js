const cacheName = 'restaurantSiteCache';

//call install event
self.addEventListener('install', z => {
    console.log('Service Worker: installed');
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
        fetch(z.request)
            .then(response => {
            //make copy.clone of response
            const responseClone = response.clone();
            //open cache
            caches
                .open(cacheName)
                .then(cache => {
                    //add response to caches
                    cache.put(z.request, responseClone);
                });
                return response;
            }).catch(error => caches.match(z.request).then(response => response))
    );
});
