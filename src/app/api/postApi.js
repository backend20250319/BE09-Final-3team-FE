import api from "./api";

// 전체 게시글 조회
export const getAllPost = () => api.get("community/posts/all");

// 내 게시글 조회
export const getMyPost = () => api.get("community/posts/me");

// 새 게시글 등록
export const registNewPost = async (postData) => {
    const res = await api.post("community/posts/register",postData);
};

// 게시글 상세 보기
export const getPostDetail = async (postId) =>{
    const res = await api.get(`community/posts/${postId}/detail`);
    return res.data.data ?? res.data;
};

// 게시글 삭제
export const deletePost = async (postId) => {
    const res = await api.patch(`community/posts/${postId}/delete`);
    return res.data;
};
