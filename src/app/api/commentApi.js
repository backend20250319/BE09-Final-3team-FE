import api from "./api";

/** 댓글 등록: POST /comments/insert
 *  @param {object} payload - CommentCreateRequest와 동일
 *  예: { postId, content, parentId }  (필드명은 백엔드 DTO에 맞춰 전달)
 */
export const createComment = async (payload) => {
    const res = await api.post("/community/comments/insert", payload);
    return res.data.data ?? res.data;
};

/** 댓글 삭제(소프트 삭제): PATCH /comments/{commentId}/delete */
export const deleteComment = async (commentId) => {
    const res = await api.patch(`/community/comments/${commentId}/delete`);
    return res.data.data ?? res.data;
};
