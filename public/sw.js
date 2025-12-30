importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDTKchS9EW7rmmRLXRlRzZa1j_edtkPoBE",
  authDomain: "lostaf-onboarding.firebaseapp.com",
  projectId: "lostaf-onboarding",
  storageBucket: "lostaf-onboarding.firebasestorage.app",
  messagingSenderId: "870423670830",
  appId: "1:870423670830:web:60df5f7a40ff6662876fbf",
  measurementId: "G-B3MLB6F3L2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
