import api from "./api";



const COMMUNITY_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_COMMUNITY_PREFIX) ||
    "/community-service/community";
// 전체 게시글 조회
export const getAllPost = async ({ page, size, type, signal } = {}) => {
    const params = { page, size };
    if (type) params.type = type;
    const res = await api.get(`${COMMUNITY_PREFIX}/posts/all`, { params, signal });
    return res.data?.data ?? res.data;
};
// 내 게시글 조회
export const getMyPost = async ({ page, size, type, signal} = {}) => {
    const params = { page, size };
    if (type) params.type = type;
    const userNo = localStorage.getItem("userNo")
    console.log("[getMyPost] userNo =", userNo);
    const res = await api.get(`${COMMUNITY_PREFIX}/posts/me`, {
        params,
        signal,
        headers:{
            "X-User-No":userNo,
        },
    });
    return res.data?.data ?? res.data;
};

// 새 게시글 등록
export const registNewPost = async (payload) => {
    const res = await api.post(`${COMMUNITY_PREFIX}/posts/register`,payload);
};

// 게시글 상세 보기
export const getPostDetail = async (postId, { signal } = {}) => {
    const res = await api.get(`${COMMUNITY_PREFIX}/posts/${postId}/detail`, { signal });
    return res.data?.data ?? res.data;
};

// 게시글 삭제
export const deletePost = async (postId) => {
    const res = await api.patch(`${COMMUNITY_PREFIX}/posts/${postId}/delete`);
    return res.data;
};


