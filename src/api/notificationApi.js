import api from "./api";



const NOTIFICATION_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_NOTIFICATION_PREFIX) ||
    "/notification-service/notifications";

export const getNotifications = async ({ page = 0, size = 5 } = {}) => {

    const res = await api.get(`${NOTIFICATION_PREFIX}/noti/users`, {
        params: { page, size },
    });
    return res.data?.data ?? res.data;
};

export const createComment = async (payload) => {
    const res = await api.post(`${COMMUNITY_PREFIX}/comments/insert`, payload);
    return res.data.data ?? res.data;
};

export const deleteComment = async (commentId) => {
    const res = await api.patch(`${COMMUNITY_PREFIX}/comments/${commentId}/delete`);
    return res.data.data ?? res.data;
};
