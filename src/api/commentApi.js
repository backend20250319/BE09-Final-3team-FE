import api from "./api";

const COMMUNITY_PREFIX =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_COMMUNITY_PREFIX) ||
  "/community-service/community";

export const getComments = async (postId) => {
  const res = await api.get(`${COMMUNITY_PREFIX}/comments/${postId}`);
  return res.data.data?.content ?? [];
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

// 댓글 수정
export const updateComment = async (commentId, updateData) => {
  const res = await api.put(
    `${COMMUNITY_PREFIX}/comments/${commentId}`,
    updateData
  );
  return res.data;
};
