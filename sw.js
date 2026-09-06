/* sw.js — Service Worker עבור "חתימה+"
   תפקידו היחיד: לקבל התראות Push של Firebase Cloud Messaging ולהציג אותן
   כשהאתר סגור או ברקע. חייב לשבת בתיקיית השורש של האתר (לצד index.html),
   כדי שיהיה לו הרשאה להירשם על כל האתר.

   הערה: firebaseConfig כאן זהה בכוונה לזה שבתוך index.html. אלו מזהים
   ציבוריים (לא סודיים) — האבטחה האמיתית היא ב-Firestore Rules, לא כאן. */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBm_y2EELDkt1xCnKiFwqxSuPfGuN59K70",
  authDomain: "signflow-bet-el-bbd2f.firebaseapp.com",
  projectId: "signflow-bet-el-bbd2f",
  storageBucket: "signflow-bet-el-bbd2f.firebasestorage.app",
  messagingSenderId: "7159769913",
  appId: "1:7159769913:web:0573a62e31d666d6f7d6e8",
});

const messaging = firebase.messaging();

// מוצג כשהאתר סגור/ברקע (כשהאתר פתוח וממוקד, ההתראה לא מוצגת כאן בכלל —
// אפשר להוסיף טיפול ל-onMessage בקובץ הראשי אם רוצים גם התראה בזמן שהאתר פתוח)
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'חתימה+';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, {
    body,
    icon: undefined, // אפשר להוסיף כאן נתיב לאייקון של האתר בהמשך
    dir: 'rtl',
  });
});

// לחיצה על ההתראה עצמה פותחת/ממקדת את האתר
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
