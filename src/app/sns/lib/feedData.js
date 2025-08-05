// Feed 페이지 관련 더미 데이터

// 프로필 데이터
export const profileData = {
  username: "@Petful_influencer",
  avatar: "/images/profile-avatar.jpg",
  stats: {
    followers: "245.2K",
    following: "1,847",
    posts: "892",
  },
};

// 피드 통계 데이터
export const feedStatsData = [
  {
    id: 1,
    value: "8,247",
    label: "게시물 별 평균 좋아요",
    change: "+12.5%",
    iconType: "heart",
    borderColor: "#F5A623",
  },
  {
    id: 2,
    value: "342",
    label: "게시물 별 평균 댓글",
    change: "+8.3%",
    iconType: "comment",
    borderColor: "#8BC34A",
  },
  {
    id: 3,
    value: "3.4%",
    label: "삭제 비율",
    change: "+15.7%",
    iconType: "engagement",
    borderColor: "#FF7675",
  },
  {
    id: 4,
    value: "156.8K",
    label: "게시물 별 평균 조회 수",
    change: "+22.1%",
    iconType: "reach",
    borderColor: "#60A5FA",
  },
];

// 인기 게시물 데이터
export const topPerformingPostsData = [
  {
    id: 1,
    image: "/images/post-1.jpg",
    title: "Beach day adventures! 🏖️",
    likes: "15.2K",
    comments: "847",
  },
  {
    id: 2,
    image: "/images/post-2.jpg",
    title: "New toy unboxing! 🎾",
    likes: "12.8K",
    comments: "623",
  },
  {
    id: 3,
    image: "/images/post-3.jpg",
    title: "Sunday nap vibes 😴",
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

// API 호출 함수들
export async function getProfileData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(profileData), 500);
  });
}

export async function getFeedStats() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(feedStatsData), 500);
  });
}

export async function getTopPerformingPosts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(topPerformingPostsData), 500);
  });
}

export async function getEngagementData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(engagementData), 500);
  });
}

export async function getReachData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(reachData), 500);
  });
}

export async function getFollowerData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(followerData), 500);
  });
}

export async function getEngagementDistribution() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(engagementDistributionData), 500);
  });
}
