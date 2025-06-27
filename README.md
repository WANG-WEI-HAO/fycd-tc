# 基本 PWA Service Worker

這是一個用於漸進式網頁應用（Progressive Web App, PWA）的基礎 Service Worker 腳本 (`service-worker.js`)。

## 專案描述

此專案包含一個最小化的 Service Worker 設定，其主要目的是作為建構更複雜 PWA 功能的起點。它展示了 Service Worker 生命週期的基本事件監聽（`install`, `activate`, `fetch`）。

## 功能

這個 Service Worker 目前實現了最基本的功能：

*   **安裝與啟用日誌**: 在瀏覽器開發者工具的控制台（Console）中，會顯示 Service Worker 的安裝和啟用訊息，方便開發時進行調試。
*   **立即更新**: 使用 `self.skipWaiting()` 確保新的 Service Worker 在安裝後能立即取代舊的並生效，加速更新流程。
*   **網路代理 (Network-Only Strategy)**: 攔截所有的網路請求 (`fetch` event)，並直接從網路獲取資源。

> **注意：** 此版本的 Service Worker **不提供任何離線快取功能**。如果網路中斷，應用程式將無法存取資源。

## 如何運作

### `service-worker.js`

*   **`install` 事件**: 當 Service Worker 被註冊並首次安裝時觸發。`self.skipWaiting()` 會強制新的 Service Worker 立即進入 `activate` 階段，而不會停在 `waiting` 狀態。
*   **`activate` 事件**: 當 Service Worker 成功安裝並啟用時觸發。這是一個清理舊版本快取資源的理想位置（目前腳本中未實現此邏輯）。
*   **`fetch` 事件**: 每當應用程式發出網路請求（例如，載入圖片、CSS、或 API 請求）時觸發。目前的實作是 `event.respondWith(fetch(event.request))`，這意味著它會攔截請求，然後簡單地將其轉發到網路，行為與沒有 Service Worker 時相同。

## 如何使用

要讓這個 Service Worker 生效，你需要在你的主要 JavaScript 檔案（例如 `main.js` 或 `app.js`）中註冊它。

1.  將 `service-worker.js` 檔案放在您網站的根目錄下。
2.  在您的主要 JavaScript 檔案中加入以下程式碼來註冊 Service Worker：

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered successfully: ', registration);
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}
```

## 未來的改進方向

這個 Service Worker 是一個很好的起點，但可以透過以下方式進行增強以提供更豐富的 PWA 體驗：

1.  **實現快取策略**:
    *   **Cache First (快取優先)**: 優先從快取讀取資源，若快取中沒有，再從網路請求。適合靜態資源如 CSS, JS, 圖片。
    *   **Network First (網路優先)**: 優先從網路請求資源，若網路失敗，再從快取讀取。適合需要最新內容的資源，如 API 數據。
    *   **Stale-While-Revalidate**: 立即從快取提供舊版資源，同時在背景發送網路請求以更新快取，兼顧速度與內容更新。
2.  **預快取核心資源**: 在 `install` 事件中，將 App Shell（應用程式核心的 HTML, CSS, JS）預先快取，以加速首次載入並實現離線可用。
3.  **清理舊快取**: 在 `activate` 事件中，遍歷並刪除不再需要的舊快取，避免儲存空間浪費。
4.  **背景同步 (Background Sync)**: 當使用者在離線狀態下執行操作（如發送表單），可以在網路恢復時自動完成。
5.  **推播通知 (Push Notifications)**: 讓你的應用程式可以向使用者發送通知，提高使用者參與度。