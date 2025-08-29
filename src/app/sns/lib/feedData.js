// Feed 페이지 관련 더미 데이터

import api from "@/api/api"

// 프로필 데이터
export const profileData = {
  username: "@Petful_influencer",
  avatar: "/user-1",
  stats: {
    followers: "245.2K",
    following: "1,847",
    posts: "892",
  },
};

export async function getTopPerformingPosts(instagram_id) {
  const params = { instagram_id: instagram_id };
  const response = await api.get("/sns-service/instagram/medias/top-media", { params });
  const raw = response?.data?.data || response?.data || [];
  const posts = Array.isArray(raw)
    ? raw.map((item) => ({
        id: item.id,
        image: item.media_url,
        title: item.caption || "",
        likes: Number(item.like_count) || 0,
        comments: Number(item.comments_count) || 0,
        permalink: item.permalink,
      }))
    : [];
  return posts;
}



export async function getFollowerData(instagram_id) {
  const params = { instagram_id: instagram_id };
  const response = await api.get("/sns-service/instagram/insights/follower-history", { params });
  const monthly = response?.data?.data || response?.data || [];
  const normalized = Array.isArray(monthly)
    ? monthly
        .map((row) => ({
          month: typeof row.stat_month === "string" ? row.stat_month.slice(0, 7) : row.stat_month,
          followers: Number(row.total_followers) || 0,
        }))
        .sort((a, b) => (a.month < b.month ? -1 : 1))
    : [];

  const withDelta = normalized.map((item, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1].followers : item.followers;
    return {
      month: item.month,
      followers: item.followers,
      newFollowers: Math.max(item.followers - prev, 0),
    };
  });

  return withDelta;
}

export async function getEngagementDistribution(instagram_id) {
  const params = { instagram_id: instagram_id };
  const response = await api.get("/sns-service/instagram/insights/engagement", { params });
  const body = response?.data?.data || response?.data || {};
  const like = Number(body.like_rate) || 0;
  const comment = Number(body.comment_rate) || 0;
  const share = Number(body.share_rate) || 0;
  return [
    { name: "좋아요", value: like, color: "#F5A623" },
    { name: "댓글", value: comment, color: "#8BC34A" },
    { name: "공유", value: share, color: "#FF7675" },
  ];
}



export async function getEngagementAndReachData(instagram_id) {
  const params = { instagram_id: instagram_id };
  const response = await api.get("/sns-service/instagram/insights/analysis-data", { params });
  return response.data;
}


export async function getFeedStats(instagram_id) {
  const params = { instagram_id:instagram_id };

  const response = await api.get("/sns-service/instagram/medias/analysis", {params});
  return response.data;
}

// 인스타그램 프로필 목록을 가져오는 함수
export async function getInstagramProfiles() {
  const response = await api.get("/sns-service/instagram/profiles");
  return response.data;
}
