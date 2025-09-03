import React, { useEffect, useState } from "react";
import styles from "../styles/AlarmDropdown.module.css";
import { useRouter } from "next/navigation";
import { getRecentNotifications } from "@/api/notificationApi";

const iconBasePath = "/icons/";

// 알람 페이지와 동일한 아이콘 매핑
const ICON_MAP = {
  "notification.comment.created": { icon: "community-icon.svg", color: "blue" },
  "notification.post.liked": { icon: "social-icon.svg", color: "red" },
  "notification.campaign.new": { icon: "campaign-icon.svg", color: "purple" },
  "notification.user.followed": { icon: "health-icon.svg", color: "green" },
};
const DEFAULT_ICON = { icon: "notification-icon.svg", color: "orange" };

export default function NavbarDropdown({ open, onViewAll }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAlarm = () => {
    router.push("/alarm");
  };

  // 알람 데이터 로드
  const loadNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getRecentNotifications();
      const content = data?.notifications ?? [];
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
            const iconFile = cfg.icon;
            const colorClass = cfg.color;

            const id =
              notification.id ??
              notification.notificationId ??
              `${notification.type}-${idx}`;
            const title = notification.title ?? "새로운 알림";
            const content = notification.content ?? "";
            const time = notification.createdAt ?? notification.time ?? "";

            return (
              <div className={styles.item} key={id}>
                <div
                  className={
                    styles.iconContainer + " " + (styles[colorClass] || "")
                  }
                >
                  <div className={`icon-container ${colorClass}`}>
                    <img
                      src={`${iconBasePath}${iconFile}`}
                      alt={notification.type}
                      className="icon"
                    />
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
              </div>
            );
          })
        )}
      </div>
      <div className={styles.footer}></div>
    </div>
  );
}
