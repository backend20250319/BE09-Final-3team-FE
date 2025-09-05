"use client";
import React, { useEffect, useState } from "react";
import "../styles/AlarmPage.css";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/api/notificationApi";
import WebPushButton from "@/app/components/WebPushButton";
import {
  FiMessageCircle,
  FiHeart,
  FiGift,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

const ICON_MAP = {
  "notification.comment.created": { icon: FiMessageCircle, color: "blue" },
  "notification.post.liked": { icon: FiHeart, color: "red" },
  "notification.campaign.new": { icon: FiGift, color: "purple" },
  "health.schedule": { icon: "notification-icon.svg", color: "green" },
  "health.schedule.reserve": { icon: FiActivity, color: "blue" },
};
const DEFAULT_ICON = { icon: FiMessageCircle, color: "orange" };

const PetFulNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const handleCloseNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleNotificationClick = async (notification) => {
    try {
      // 읽지 않은 알림인 경우에만 읽음 처리
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        // 로컬 상태 업데이트
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notification.id ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const handleMoreNotifications = async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const data = await getNotifications({ page, size: 5 });

      console.log("📦 서버 응답:", data);

      const content = data?.notifications ?? [];
      console.log("📋 content:", content);

      // 백엔드에서 최신순으로 정렬되어 오므로 그대로 사용
      setNotifications((prev) => {
        // 기존 알림 + 새로 로드된 알림 (아래에 추가)
        return [...prev, ...content];
      });
      // Page/Slice 공통: last=true면 더 없음
      const noMore = data?.last === true || content.length === 0;
      setHasNext(!noMore);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error("🔴 알림 불러오기 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleMoreNotifications();
  }, []);

  return (
    <div className="petful-container">
      <div className="notification-card">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="title">알림</h1>
              <p className="subtitle">최신 활동 소식을 받아보세요.</p>
            </div>
            <div className="header-actions">
              <WebPushButton />
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="notification-list">
          {loading && notifications.length === 0 ? (
            <p className="no-notifications">로딩 중...</p>
          ) : notifications.length === 0 ? (
            <p className="no-notifications">받은 알림이 없습니다.</p>
          ) : (
            notifications.map((notification, index) => {
              console.log("🔍 알림 타입:", notification.type);
              const cfg = ICON_MAP[notification.type] || DEFAULT_ICON;
              console.log("🎨 아이콘 설정:", cfg);
              const IconComponent = cfg.icon;
              const colorClass = cfg.color;

              const id = notification.id;
              const title = notification.title ?? "새로운 알림";
              const content = notification.content ?? "";
              const time =
                notification.relativeTime ??
                notification.sentAt ??
                notification.createdAt ??
                notification.time ??
                "";

              return (
                <div
                  key={id}
                  className={`notification-item ${
                    index === 0 ? "first-item" : ""
                  } ${!notification.isRead ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="notification-content">
                    <div className={`icon-container ${colorClass}`}>
                      {typeof IconComponent === "string" ? (
                        <img
                          src={`/icons/${IconComponent}`}
                          alt={notification.type}
                          className="icon"
                        />
                      ) : (
                        <IconComponent size={24} className="icon" />
                      )}
                    </div>

                    <div className="text-content">
                      <h3 className="notification-title">{title}</h3>
                      <p className="notification-message">{content}</p>
                      {time ? (
                        <span className="notification-time">{time}</span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    className="close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseNotification(id);
                    }}
                    aria-label="알림 닫기"
                  >
                    <img src="/icons/close-icon.svg" alt="닫기" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <button
            className="more-btn"
            onClick={handleMoreNotifications}
            disabled={loading || !hasNext}
          >
            {loading ? "로딩 중..." : "더보기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetFulNotification;
