// Feed 페이지 관련 더미 데이터

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

// 인스타그램 프로필 목록을 가져오는 함수
export async function getInstagramProfiles(userNo) {
  try {
    
    const response = await fetch(`http://localhost:8000/api/v1/sns-service/instagram/profiles?user_no=${userNo}`);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.code === "2000") {
      console.log('Successfully fetched profiles:', data.data);
      return data.data;
    } else {
      console.error('API returned error:', data);
      throw new Error(data.message || 'Failed to fetch Instagram profiles');
    }
  } catch (error) {
    console.error('Error fetching Instagram profiles:', error);
    console.warn('API 서버에 연결할 수 없습니다. 더미 데이터를 사용합니다.');
    // API가 작동하지 않을 때 더미 데이터 반환
    return [
      {
        id: 17841475913854291,
        username: "petful_influencer",
        name: "펫풀",
        profile_picture_url: "/user-1.jpg",
        followers_count: 245200,
        follows_count: 1847,
        media_count: 892,
        auto_delete: true
      },
      {
        id: 17841475913854292,
        username: "petstar_celeb",
        name: "펫스타 셀럽",
        profile_picture_url: "/user-2.jpg",
        followers_count: 156800,
        follows_count: 1200,
        media_count: 456,
        auto_delete: false
      },
      {
        id: 17841475913854293,
        username: "pet_care_expert",
        name: "펫케어 전문가",
        profile_picture_url: "/user-3.jpg",
        followers_count: 89200,
        follows_count: 890,
        media_count: 234,
        auto_delete: true
      }
    ];
  }
}
