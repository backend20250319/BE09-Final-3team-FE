// Comment 페이지 관련 더미 데이터

// 댓글 관리 통계 데이터
export const commentStatsData = [
  {
    id: 1,
    icon: "message",
    label: "총 댓글 수",
    value: "1,247",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  {
    id: 2,
    icon: "delete",
    label: "자동 삭제",
    value: "89",
    color: "#EF4444",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  {
    id: 3,
    icon: "percentage",
    label: "삭제 비율",
    value: "7.1%",
    color: "#22C55E",
    bgColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  {
    id: 4,
    icon: "ban",
    label: "금지어 개수",
    value: "24",
    color: "#A855F7",
    bgColor: "#FAF5FF",
    borderColor: "#E9D5FF",
  },
];

// 감정 분석 데이터
export const sentimentAnalysisData = [
  { sentiment: "긍정", count: 847, percentage: 64, color: "#22C55E" },
  { sentiment: "중립", count: 312, percentage: 28, color: "#6B7280" },
  { sentiment: "부정", count: 88, percentage: 8, color: "#EF4444" },
];

// 금지어 데이터
export const bannedWordsData = [
  "스팸",
  "광고",
  "홍보",
  "판매",
  "구매",
  "사기",
  "욕설1",
  "욕설2",
  "혐오발언",
  "비속어",
  "도배",
  "링크",
];

// 댓글 목록 데이터
export const commentsData = [
  {
    id: 1,
    username: "happy_pet_mom",
    avatar: "/user-1.jpg",
    content: "너무 귀여워요! 우리 강아지도 이런 장난감 좋아해요 ❤️",
    timestamp: "2024-01-15 14:30",
    sentiment: "긍정",
    status: "승인됨",
    isDeleted: false,
  },
  {
    id: 2,
    username: "dog_lover_123",
    avatar: "/user-2.jpg",
    content: "어디서 구매하셨나요? 정보 좀 알려주세요!",
    timestamp: "2024-01-15 13:45",
    sentiment: "중립",
    status: "승인됨",
    isDeleted: false,
  },
  {
    id: 3,
    username: "suspicious_user",
    avatar: "/user-3.jpg",
    content: "이거 사기 같은데... 절대 사지마세요",
    timestamp: "2024-01-15 12:20",
    sentiment: "부정",
    status: "삭제됨",
    isDeleted: true,
  },
  {
    id: 4,
    username: "pet_trainer_pro",
    avatar: "/user-4.jpg",
    content: "훈련용으로도 좋은 장난감이네요. 추천합니다!",
    timestamp: "2024-01-15 11:15",
    sentiment: "긍정",
    status: "승인됨",
    isDeleted: false,
  },
  {
    id: 5,
    username: "spam_account",
    avatar: "/user-1.jpg",
    content: "광고) 더 좋은 제품 여기서 판매해요! 링크 클릭하세요",
    timestamp: "2024-01-15 10:30",
    sentiment: "중립",
    status: "삭제됨",
    isDeleted: true,
  },
  {
    id: 6,
    username: "cute_puppy_fan",
    avatar: "/user-2.jpg",
    content: "우리 강아지가 정말 좋아할 것 같아요! 주문해볼게요",
    timestamp: "2024-01-15 09:45",
    sentiment: "긍정",
    status: "승인됨",
    isDeleted: false,
  },
  {
    id: 7,
    username: "negative_nancy",
    avatar: "/user-3.jpg",
    content: "가격이 너무 비싸네요. 다른 곳에서 더 싸게 팔아요",
    timestamp: "2024-01-15 08:30",
    sentiment: "부정",
    status: "삭제됨",
    isDeleted: true,
  },
  {
    id: 8,
    username: "bot_account_123",
    avatar: "/user-4.jpg",
    content: "무료 샘플 받으세요! 여기 클릭 -> 악성링크.com",
    timestamp: "2024-01-15 07:15",
    sentiment: "중립",
    status: "삭제됨",
    isDeleted: true,
  },
  {
    id: 9,
    username: "pet_expert",
    avatar: "/user-1.jpg",
    content: "이런 재질의 장난감은 강아지 치아에 좋습니다",
    timestamp: "2024-01-15 06:00",
    sentiment: "긍정",
    status: "승인됨",
    isDeleted: false,
  },
  {
    id: 10,
    username: "angry_customer",
    avatar: "/user-2.jpg",
    content: "최악이네요. 품질이 형편없어요. 완전 쓰레기!",
    timestamp: "2024-01-15 05:30",
    sentiment: "부정",
    status: "삭제됨",
    isDeleted: true,
  },
];

// API 호출 함수들
export async function getCommentStats() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(commentStatsData), 500);
  });
}

export async function getSentimentAnalysis() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sentimentAnalysisData), 500);
  });
}

export async function getBannedWords() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(bannedWordsData), 500);
  });
}

export async function getComments() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(commentsData), 500);
  });
}

export async function addBannedWord(word) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, word }), 300);
  });
}

export async function removeBannedWord(word) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, word }), 300);
  });
}
