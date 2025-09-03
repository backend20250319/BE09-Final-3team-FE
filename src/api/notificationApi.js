import api from "./api";

const NOTIFICATION_PREFIX =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_NOTIFICATION_PREFIX) ||
  "/notification-service/notifications";

export const getNotifications = async ({ page = 0, size = 5 } = {}) => {
  const res = await api.get(`${NOTIFICATION_PREFIX}/noti/users`, {
    params: { page, size },
  });
  return res.data?.data ?? res.data;
};

// 드롭다운용 최근 5개 알람 조회
export const getRecentNotifications = async () => {
  const res = await api.get(`${NOTIFICATION_PREFIX}/noti/users`, {
    params: { page: 0, size: 5 },
  });
  return res.data?.data ?? res.data;
};

// 읽지 않은 알림 개수 조회
export const getUnreadNotificationCount = async () => {
  const res = await api.get(`${NOTIFICATION_PREFIX}/noti/count`);
  const data = res.data?.data ?? res.data;
  return data?.unreadCount ?? 0;
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
  const res = await api.patch(
    `${NOTIFICATION_PREFIX}/noti/${notificationId}/read`
  );
  return res.data?.data ?? res.data;
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async () => {
  const res = await api.patch(`${NOTIFICATION_PREFIX}/noti/read-all`);
  return res.data?.data ?? res.data;
};

export const createComment = async (payload) => {
  const res = await api.post(`${COMMUNITY_PREFIX}/comments/insert`, payload);
  return res.data.data ?? res.data;
};

export const deleteComment = async (commentId) => {
  const res = await api.patch(
    `${COMMUNITY_PREFIX}/comments/${commentId}/delete`
  );
  return res.data.data ?? res.data;
};
