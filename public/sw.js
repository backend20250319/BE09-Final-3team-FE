/**
 * 서비스 워커 - 웹푸시 알림 처리
 *
 * 웹푸시 알림을 수신하고 표시하는 역할을 담당합니다.
 */

// 서비스 워커 설치
self.addEventListener("install", (event) => {
  console.log("Service Worker 설치됨");
  self.skipWaiting();
});

// 서비스 워커 활성화
self.addEventListener("activate", (event) => {
  console.log("Service Worker 활성화됨");
  event.waitUntil(self.clients.claim());
});

// 푸시 이벤트 처리
self.addEventListener("push", (event) => {
  console.log("푸시 알림 수신:", event);

  let notificationData = {
    title: "PetFul",
    body: "새로운 알림이 도착했습니다.",
    icon: "/icons/notification-icon.svg",
    badge: "/icons/badge-icon.svg",
    tag: "petful-notification",
    requireInteraction: false,
    actions: [
      {
        action: "open",
        title: "확인",
        icon: "/icons/check-icon.svg",
      },
      {
        action: "close",
        title: "닫기",
        icon: "/icons/close-icon.svg",
      },
    ],
  };

  // 푸시 데이터가 있는 경우 파싱
  if (event.data) {
    try {
      const data = event.data.json();
      console.log("푸시 데이터:", data);

      notificationData = {
        ...notificationData,
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data.data || {},
      };
    } catch (error) {
      console.error("푸시 데이터 파싱 실패:", error);
    }
  }

  // 알림 표시
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 알림 클릭 이벤트 처리
self.addEventListener("notificationclick", (event) => {
  console.log("알림 클릭됨:", event);

  event.notification.close();

  if (event.action === "close") {
    return;
  }

  // 클라이언트 창 열기 또는 포커스
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 창이 있는지 확인
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }

        // 새 창 열기
        const notificationData = event.notification.data;
        let url = "/";

        if (notificationData && notificationData.linkUrl) {
          url = notificationData.linkUrl;
        }

        return clients.openWindow(url);
      })
  );
});

// 알림 닫기 이벤트 처리
self.addEventListener("notificationclose", (event) => {
  console.log("알림 닫힘:", event);
});

// 백그라운드 동기화 (선택사항)
self.addEventListener("sync", (event) => {
  console.log("백그라운드 동기화:", event);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

// 백그라운드 동기화 작업
async function doBackgroundSync() {
  try {
    console.log("백그라운드 동기화 실행");
    // 여기에 동기화할 작업들을 추가할 수 있습니다
  } catch (error) {
    console.error("백그라운드 동기화 실패:", error);
  }
}
