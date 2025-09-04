import React, { useEffect, useState } from "react";
import styles from "../styles/AlarmDropdown.module.css";
import { useRouter } from "next/navigation";
import { getRecentNotifications } from "@/api/notificationApi";
import {
  FiMessageCircle,
  FiHeart,
  FiGift,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

// 알람 페이지와 동일한 아이콘 매핑 (React Icons 사용)
const ICON_MAP = {
  "notification.comment.created": { icon: FiMessageCircle, color: "blue" },
  "notification.post.liked": { icon: FiHeart, color: "red" },
  "notification.campaign.new": { icon: FiGift, color: "purple" },
  "health.schedule": { icon: "notification-icon.svg", color: "green" },
  "health.schedule.reserve": { icon: FiActivity, color: "blue" },
};
const DEFAULT_ICON = { icon: FiMessageCircle, color: "orange" };

export default function NavbarDropdown({
  open,
  onViewAll,
  onNotificationDeleted,
}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAlarm = () => {
    router.push("/alarm");
  };

  const handleCloseNotification = (id) => {
    setNotifications((prev) => {
      // 삭제만 하고 정렬은 하지 않음 (백엔드에서 이미 정렬되어 옴)
      return prev.filter((notification) => notification.id !== id);
    });
    // 부모 컴포넌트에 알림 삭제 알림
    if (onNotificationDeleted) {
      onNotificationDeleted();
    }
  };

  // 알람 데이터 로드
  const loadNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getRecentNotifications();
      const content = data?.notifications ?? [];
      // 백엔드에서 이미 최신순으로 정렬되어 오므로 그대로 사용
      setNotifications(content);
    } catch (error) {
      console.error("알람 로드 실패:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // 드롭다운이 열릴 때마다 알람 데이터 로드
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <span className={styles.title}>알림</span>
      </div>
      <div
        className={styles.list}
        onClick={handleAlarm}
        style={{ cursor: "pointer" }}
      >
        {loading ? (
          <div className={styles.empty}>로딩 중...</div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>알림이 없습니다.</div>
        ) : (
          notifications.map((notification, idx) => {
            const cfg = ICON_MAP[notification.type] || DEFAULT_ICON;
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
                className={`${styles.item} ${
                  !notification.isRead ? styles.unread : ""
                }`}
                key={id}
              >
                <div
                  className={
                    styles.iconContainer + " " + (styles[colorClass] || "")
                  }
                >
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
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                    textAlign: "left",
                  }}
                >
                  <div className={styles.textContent}>
                    <div className={styles.itemTitle}>{title}</div>
                    <div className={styles.message}>{content}</div>
                  </div>
                  <div className={styles.time}>{time}</div>
                </div>
                <button
                  className={styles.closeBtn}
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
      <div className={styles.footer}></div>
    </div>
  );
}
