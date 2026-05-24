importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const APP_CACHE = "tidy-team-shell-v3";
const APP_SHELL = ["/", "/index.html", "/manifest.json"];

firebase.initializeApp({
  apiKey: "AIzaSyB7j1ohDOXh6izP0lkVx93_0b9r9Y8Opsw",
  authDomain: "tidy-team-c729a.firebaseapp.com",
  projectId: "tidy-team-c729a",
  storageBucket: "tidy-team-c729a.firebasestorage.app",
  messagingSenderId: "645574159002",
  appId: "1:645574159002:web:4e216beef0b9dbe9eb8d23",
});

const messaging = firebase.messaging();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== APP_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin === self.location.origin && (request.mode === "navigate" || url.pathname === "/" || url.pathname === "/index.html")) {
    event.respondWith(fetch(request).catch(() => caches.match("/index.html")));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (url.origin === self.location.origin) {
        const copy = response.clone();
        caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || "Tidy Team", {
    body: body || "",
    icon: icon || "/icon.png",
    badge: "/icon.png",
    data: payload.data || {},
  });
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow("/"));
});
