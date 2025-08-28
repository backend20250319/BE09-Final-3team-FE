// Feed 페이지 관련 더미 데이터

import api from "@/app/api/api";

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



// 인기 게시물 데이터
export const topPerformingPostsData = [
  {
    id: 1,
    image: "/campaign-2.jpg",
    title: "바다 여행 후기 🏖️",
    likes: "15.2K",
    comments: "847",
  },
  {
    id: 2,
    image: "/campaign-3.jpg",
    title: "새 장난감 언박싱! 🎾",
    likes: "12.8K",
    comments: "623",
  },
  {
    id: 3,
    image: "/campaign-4.jpg",
    title: "일요일 낮 바이브! 😴",
    likes: "11.4K",
    comments: "445",
  },
];

// 참여도 분석 차트 데이터
export const engagementData = [
  { month: "1월", likes: 4200, comments: 2400, shares: 800 },
  { month: "2월", likes: 3800, comments: 1398, shares: 650 },
  { month: "3월", likes: 5200, comments: 2800, shares: 920 },
  { month: "4월", likes: 4780, comments: 3908, shares: 1100 },
  { month: "5월", likes: 6890, comments: 4800, shares: 1350 },
  { month: "6월", likes: 7390, comments: 3800, shares: 1200 },
  { month: "7월", likes: 8490, comments: 4300, shares: 1450 },
];

// 도달률 분석 차트 데이터
export const reachData = [
  { month: "1월", reach: 12000, impressions: 15000 },
  { month: "2월", reach: 11000, impressions: 14200 },
  { month: "3월", reach: 14500, impressions: 18500 },
  { month: "4월", reach: 13200, impressions: 17800 },
  { month: "5월", reach: 16800, impressions: 22400 },
  { month: "6월", reach: 18200, impressions: 24000 },
  { month: "7월", reach: 19500, impressions: 26200 },
];

// 팔로워 성장 차트 데이터
export const followerData = [
  { month: "1월", followers: 218500, newFollowers: 12400 },
  { month: "2월", followers: 225300, newFollowers: 6800 },
  { month: "3월", followers: 232100, newFollowers: 6800 },
  { month: "4월", followers: 238900, newFollowers: 6800 },
  { month: "5월", followers: 242700, newFollowers: 3800 },
  { month: "6월", followers: 245200, newFollowers: 2500 },
];

// 참여 분포 데이터
export const engagementDistributionData = [
  { name: "좋아요", value: 45, color: "#F5A623" },
  { name: "댓글", value: 30, color: "#8BC34A" },
  { name: "공유", value: 25, color: "#FF7675" },
];



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
