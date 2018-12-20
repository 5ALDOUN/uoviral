/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

const PRECACHE_URLS = [
    '/',
    // html file
    'https://radio.uoviral.com',
    // html manifest pointer
    'index.html?homescreen=1',
    '?homescreen=1',
    // css file
    'styles/index.min.css',
    // jquery file if you are using jquery in your site
    'functions/jquery.min.js',
    // javascript filter
    'functions/index.js',
    // manifest file
    'functions/manifest.json',
    // assets
    'https://lh3.googleusercontent.com/-ccPYTEQF8ck/XBlMpgq_trI/AAAAAAAAKWc/1HKHznYb5rMv8VxptTPXhFNl6DzPkyyOwCEwYBhgL/w512/unnamed.svg',
    'https://lh3.googleusercontent.com/-ccPYTEQF8ck/XBlMpgq_trI/AAAAAAAAKWc/1HKHznYb5rMv8VxptTPXhFNl6DzPkyyOwCEwYBhgL/w512/unnamed.png',
    'http://radio.uoviral.com/favicon.ico'

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.dlete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {

  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {

            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
