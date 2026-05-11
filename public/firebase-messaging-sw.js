importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB7j1ohDOXh6izP0lkVx93_0b9r9Y8Opsw",
  authDomain: "tidy-team-c729a.firebaseapp.com",
  projectId: "tidy-team-c729a",
  storageBucket: "tidy-team-c729a.firebasestorage.app",
  messagingSenderId: "645574159002",
  appId: "1:645574159002:web:4e216beef0b9dbe9eb8d23",
});

const messaging = firebase.messaging();

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
