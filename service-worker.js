// 設定版本號
const VERSION = 'v1.1.0';

self.addEventListener('install', event => {
  console.log(`Service worker installing... [${VERSION}]`);
  // 立即啟用新版本，不等舊版本被關閉
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log(`Service worker activated [${VERSION}]`);
  // 強制接管所有頁面
  event.waitUntil(
    clients.claim()
  );
});

self.addEventListener('fetch', event => {
  // 直接從網路抓取，保證最新資源
  event.respondWith(fetch(event.request));
});
