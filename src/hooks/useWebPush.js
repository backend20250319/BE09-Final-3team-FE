import { useState, useEffect, useCallback } from "react";
import {
  getVapidPublicKey,
  subscribeToWebPush,
  getWebPushSubscriptions,
  unsubscribeFromWebPush,
} from "@/api/notificationApi";

/**
 * 웹푸시 구독을 관리하는 커스텀 훅
 *
 * 브라우저의 웹푸시 API를 사용하여 알림 구독을 관리합니다.
 */
export const useWebPush = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [vapidPublicKey, setVapidPublicKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 브라우저 지원 여부 확인
  useEffect(() => {
    const checkSupport = () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      if (!supported) {
        setError("이 브라우저는 웹푸시를 지원하지 않습니다.");
      }
    };

    checkSupport();
  }, []);

  // VAPID 공개키 가져오기
  const fetchVapidPublicKey = useCallback(async () => {
    try {
      const key = await getVapidPublicKey();
      setVapidPublicKey(key);
      return key;
    } catch (err) {
      console.error("VAPID 공개키 가져오기 실패:", err);
      setError("VAPID 공개키를 가져올 수 없습니다.");
      return null;
    }
  }, []);

  // 현재 구독 상태 확인
  const checkSubscriptionStatus = useCallback(async () => {
    if (!isSupported) return;

    try {
      setLoading(true);

      // 서비스 워커 등록
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("서비스 워커 등록됨:", registration);

      // 현재 구독 확인
      const currentSubscription =
        await registration.pushManager.getSubscription();

      if (currentSubscription) {
        setSubscription(currentSubscription);
        setIsSubscribed(true);
        console.log("현재 구독됨:", currentSubscription);
      } else {
        setIsSubscribed(false);
        console.log("구독되지 않음");
      }
    } catch (err) {
      console.error("구독 상태 확인 실패:", err);
      setError("구독 상태를 확인할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  // 웹푸시 구독
  const subscribe = useCallback(async () => {
    if (!isSupported || !vapidPublicKey) {
      setError("웹푸시를 지원하지 않거나 VAPID 키가 없습니다.");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // 서비스 워커 등록
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("서비스 워커 등록됨:", registration);

      // 구독 생성
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log("새 구독 생성됨:", newSubscription);

      // 서버에 구독 정보 전송
      const subscriptionData = {
        endpoint: newSubscription.endpoint,
        p256dhKey: arrayBufferToBase64(newSubscription.getKey("p256dh")),
        authKey: arrayBufferToBase64(newSubscription.getKey("auth")),
      };

      await subscribeToWebPush(subscriptionData);

      setSubscription(newSubscription);
      setIsSubscribed(true);

      console.log("웹푸시 구독 성공");
      return true;
    } catch (err) {
      console.error("웹푸시 구독 실패:", err);

      if (err.name === "NotAllowedError") {
        setError(
          "알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요."
        );
      } else {
        setError("웹푸시 구독에 실패했습니다.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [isSupported, vapidPublicKey]);

  // 웹푸시 구독 해제
  const unsubscribe = useCallback(async () => {
    if (!subscription) return false;

    try {
      setLoading(true);
      setError(null);

      // 브라우저에서 구독 해제
      await subscription.unsubscribe();

      // 서버에서도 구독 해제 (구독 ID가 있다면)
      // TODO: 구독 ID를 저장하고 관리하는 로직 필요

      setSubscription(null);
      setIsSubscribed(false);

      console.log("웹푸시 구독 해제 성공");
      return true;
    } catch (err) {
      console.error("웹푸시 구독 해제 실패:", err);
      setError("웹푸시 구독 해제에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  // 초기화
  useEffect(() => {
    if (isSupported) {
      fetchVapidPublicKey().then(() => {
        checkSubscriptionStatus();
      });
    }
  }, [isSupported, fetchVapidPublicKey, checkSubscriptionStatus]);

  return {
    isSupported,
    isSubscribed,
    subscription,
    vapidPublicKey,
    loading,
    error,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
  };
};

/**
 * VAPID 공개키를 Uint8Array로 변환
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * ArrayBuffer를 Base64 문자열로 변환
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
