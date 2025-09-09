"use client";
import React, { useState } from "react";
import { useWebPush } from "@/hooks/useWebPush";
import "../styles/WebPushButton.css";
import styles from "@/app/health/activity/styles/ActivityManagement.module.css";

/**
 * 웹푸시 구독/해제 버튼 컴포넌트
 *
 * 사용자가 웹푸시 알림을 구독하거나 해제할 수 있는 버튼을 제공합니다.
 */
export default function WebPushButton({ className = "" }) {
  const { isSupported, isSubscribed, loading, error, subscribe, unsubscribe } =
    useWebPush();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showSubscribeInfo, setSubscribeInfo] = useState(false);

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleUnsubscribe = async () => {
    await unsubscribe();
  };

  // 브라우저가 웹푸시를 지원하지 않는 경우
  if (!isSupported) {
    return (
      <div className={`webpush-unsupported ${className}`}>
        이 브라우저는 웹푸시를 지원하지 않습니다.
      </div>
    );
  }

  return (
    <div className={`webpush-container ${className}`}>
      {/* 성공 메시지 */}
      {showSuccess && (
        <div className="webpush-success-message">
          ✅ 웹푸시 알림이 활성화되었습니다!
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className="webpush-error-message">❌ {error}</div>}
      {/* 구독/해제 버튼 */}
      <div className="webpush-button-container">
        <button
          type="button"
          className={styles.infoButton}
          onClick={() => setSubscribeInfo((v) => !v)}
          aria-label="구독 정보 안내"
        >
          i
        </button>

        {showSubscribeInfo && (
          <div className={styles.infoDropdown}>
            <span className="webpush-status-inactive">
              알림을 받으려면 구독해주세요
            </span>
            <div>
              알림을 구독하면 새로운 활동, 건강 알림, 캠페인 선정 등의 소식을
              실시간으로 받을 수 있습니다.
            </div>
          </div>
        )}
        {isSubscribed ? (
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="webpush-button webpush-button-unsubscribe"
          >
            {loading ? "해제 중..." : "알림 해제"}
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="webpush-button webpush-button-subscribe"
          >
            {loading ? "구독 중..." : "알림 구독"}
          </button>
        )}
      </div>
      <div className="webpush-status">
        {isSubscribed === true ? (
          <span className="webpush-status-active">✅ 알림 활성화됨</span>
        ) : (
          <span className="webpush-status-inactive">❌ 알림 비활성화됨</span>
        )}
      </div>
    </div>
  );
}
