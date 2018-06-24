const CACHENAME = 'APPShell';
const DynamicCacheName = 'news';
const staticAssets = ['/','/site.css','/app.js'];


self.addEventListener('install', async function (event) {
    //Cache all the internal static assets (AKA AppShell) on the installation of service worker
    console.log('caching started');
    event.waitUntil(
      caches.open(CACHENAME).then(async function(cache){
        for(var i=0 ; i< staticAssets.length; i++)
        {
          await cache.add(staticAssets[i]);
        }
        console.log('Cache successful');
      })
    );
  });
  
  self.addEventListener('fetch', event => {
   
    const request = event.request;
    const url = new URL(request.url);
    console.log('entering fetch');
    if (url.origin === location.origin) {
      //Use cache first approach for the internal requests
      event.respondWith(CacheFirst(request));
    } 
   else {
     //Use network first approach for the requests from different domain
      event.respondWith(NetworkFirst(request));
   }
  });
  
  //Primarily gets the file from cache, if not found gets the files from server.
  async function CacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
  }
  
  //Primarily tries to connect to the network to get latest records, if not fetches from the cache
  async function NetworkFirst(request) {
    const dynamic = await caches.open(DynamicCacheName);
    try {
      const networkResponse = await fetch(request);
      //Use clone to cache it as the response can be consumed only once
      dynamic.put(request, networkResponse.clone());
      return networkResponse;
    } catch (e) {
      const cachedResponse = await dynamic.match(request);
      return cachedResponse || await caches.match('./noFound.json');
    }
  }