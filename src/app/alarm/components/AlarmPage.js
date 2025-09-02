"use client";
import React, { useEffect, useState } from "react";
import "../styles/AlarmPage.css";
import { getNotifications } from "@/api/notificationApi";

const iconBasePath = "/icons/";

const ICON_MAP = {
  "notification.comment.created": { icon: "community-icon.svg", color: "blue" },
  "notification.post.liked": { icon: "social-icon.svg", color: "red" },
  "notification.campaign.new": { icon: "campaign-icon.svg", color: "purple" },
  "notification.user.followed": { icon: "health-icon.svg", color: "green" },
};
const DEFAULT_ICON = { icon: "notification-icon.svg", color: "orange" };

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

  const handleMoreNotifications = async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const data = await getNotifications({ page, size: 5 });

      console.log("📦 서버 응답:", data);

      const content = data?.notifications ?? [];
      console.log("📋 content:", content);

      setNotifications((prev) => [...prev, ...content]);
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
          <h1 className="title">알림</h1>
          <p className="subtitle">최신 활동 소식을 받아보세요.</p>
        </div>

        {/* Notification List */}
        <div className="notification-list">
          {loading && notifications.length === 0 ? (
            <p className="no-notifications">로딩 중...</p>
          ) : notifications.length === 0 ? (
            <p className="no-notifications">받은 알림이 없습니다.</p>
          ) : (
            notifications.map((notification, index) => {
              const cfg = ICON_MAP[notification.type] || DEFAULT_ICON;
              const iconFile = cfg.icon;
              const colorClass = cfg.color;

              const id =
                notification.id ??
                notification.notificationId ??
                `${notification.type}-${index}`;
              const title = notification.title ?? "새로운 알림";
              const content = notification.content ?? "";
              const time = notification.createdAt ?? notification.time ?? "";

              return (
                <div
                  key={id}
                  className={`notification-item ${
                    index === 0 ? "first-item" : ""
                  }`}
                >
                  <div className="notification-content">
                    <div className={`icon-container ${colorClass}`}>
                      <img
                        src={`${iconBasePath}${iconFile}`}
                        alt={notification.type}
                        className="icon"
                      />
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
                    onClick={() => handleCloseNotification(id)}
                    aria-label="알림 닫기"
                  >
                    <img src={`${iconBasePath}close-icon.svg`} alt="닫기" />
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
