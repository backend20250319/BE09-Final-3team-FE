"use client";
import React, { useEffect, useState } from "react";
import { getUnreadNotificationCount } from "@/api/notificationApi";

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadNotificationCount();
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        // 로그 레벨을 줄임 (에러만 표시)
        if (error.message && !error.message.includes("401")) {
          console.error("읽지 않은 알림 개수 조회 실패:", error);
        }
      }
    };

    fetchUnreadCount();

    // 30초마다 알림 개수 업데이트
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className="notification-badge">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
};

export default NotificationBadge;
