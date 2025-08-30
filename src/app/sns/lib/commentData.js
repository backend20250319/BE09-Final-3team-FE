import api from "@/api/api"


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
  "불법",
  "허위정보",
  "가짜뉴스",
  "폭력",
  "협박",
  "괴롭힘",
  "차별",
  "혐오",
  "낚시",
  "클릭베이트",
  "도박",
  "불건전",
  "음란물",
  "성희롱",
  "정치적발언",
  "종교적차별",
  "지역감정",
  "악성댓글",
  "트롤링",
  "어그로",
  "병림픽",
  "무개념",
  "저질",
  "쓰레기",
  "멘탈갑",
  "키보드워리어",
  "댓글충",
  "개념상실자",
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
    isDeleted: false,
  },
  {
    id: 5,
    username: "spam_account",
    avatar: "/user-1.jpg",
    content: "광고) 더 좋은 제품 여기서 판매해요! 링크 클릭하세요",
    timestamp: "2024-01-15 10:30",
    sentiment: "중립",
    isDeleted: true,
  },
  {
    id: 6,
    username: "cute_puppy_fan",
    avatar: "/user-2.jpg",
    content: "우리 강아지가 정말 좋아할 것 같아요! 주문해볼게요",
    timestamp: "2024-01-15 09:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 7,
    username: "negative_nancy",
    avatar: "/user-3.jpg",
    content: "가격이 너무 비싸네요. 다른 곳에서 더 싸게 팔아요",
    timestamp: "2024-01-15 08:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 8,
    username: "bot_account_123",
    avatar: "/user-4.jpg",
    content: "무료 샘플 받으세요! 여기 클릭 -> 악성링크.com",
    timestamp: "2024-01-15 07:15",
    sentiment: "중립",
    isDeleted: true,
  },
  {
    id: 9,
    username: "pet_expert",
    avatar: "/user-1.jpg",
    content: "이런 재질의 장난감은 강아지 치아에 좋습니다",
    timestamp: "2024-01-15 06:00",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 10,
    username: "angry_customer",
    avatar: "/user-2.jpg",
    content: "최악이네요. 품질이 형편없어요. 완전 쓰레기!",
    timestamp: "2024-01-15 05:30",
    sentiment: "부정",
    isDeleted: true,
  },
  // 추가 더미데이터 (11-60번)
  {
    id: 11,
    username: "pet_lover_2024",
    avatar: "/user-1.jpg",
    content: "우리 고양이도 이런 장난감 좋아할까요?",
    timestamp: "2024-01-14 23:45",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 12,
    username: "happy_owner",
    avatar: "/user-3.jpg",
    content: "정말 좋은 상품이네요! 강추합니다 👍",
    timestamp: "2024-01-14 22:30",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 13,
    username: "spam_bot_456",
    avatar: "/user-4.jpg",
    content: "돈벌이 기회! 클릭만 하면 100만원!",
    timestamp: "2024-01-14 21:15",
    sentiment: "중립",
    isDeleted: true,
  },
  {
    id: 14,
    username: "dog_trainer",
    avatar: "/user-2.jpg",
    content: "훈련에 도움되는 좋은 장난감입니다",
    timestamp: "2024-01-14 20:00",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 15,
    username: "critical_reviewer",
    avatar: "/user-1.jpg",
    content: "배송이 너무 늦어요. 별로입니다.",
    timestamp: "2024-01-14 19:30",
    sentiment: "부정",
    isDeleted: false,
  },
  {
    id: 16,
    username: "pet_mom_jane",
    avatar: "/user-3.jpg",
    content: "우리 강아지가 하루종일 가지고 놀아요 😊",
    timestamp: "2024-01-14 18:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 17,
    username: "toxic_user_99",
    avatar: "/user-4.jpg",
    content: "개바보같은 상품이네 돈낭비 ㅋㅋ",
    timestamp: "2024-01-14 17:20",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 18,
    username: "neutral_buyer",
    avatar: "/user-2.jpg",
    content: "보통입니다. 그냥 평범한 장난감이에요",
    timestamp: "2024-01-14 16:10",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 19,
    username: "excited_puppy_dad",
    avatar: "/user-1.jpg",
    content: "우와! 강아지가 엄청 좋아해요!! 💕",
    timestamp: "2024-01-14 15:30",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 20,
    username: "scammer_alert",
    avatar: "/user-3.jpg",
    content: "사기업체입니다! 절대 구매하지 마세요!",
    timestamp: "2024-01-14 14:45",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 21,
    username: "satisfied_customer",
    avatar: "/user-4.jpg",
    content: "품질 좋고 가격도 합리적이에요",
    timestamp: "2024-01-14 13:20",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 22,
    username: "question_asker",
    avatar: "/user-2.jpg",
    content: "사이즈가 어떻게 되나요?",
    timestamp: "2024-01-14 12:15",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 23,
    username: "hate_commenter",
    avatar: "/user-1.jpg",
    content: "완전 쓰레기 상품! 환불해주세요!",
    timestamp: "2024-01-14 11:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 24,
    username: "grateful_owner",
    avatar: "/user-3.jpg",
    content: "감사합니다. 빠른 배송에 만족해요",
    timestamp: "2024-01-14 10:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 25,
    username: "curious_cat_mom",
    avatar: "/user-4.jpg",
    content: "고양이용도 있나요?",
    timestamp: "2024-01-14 09:30",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 26,
    username: "repeat_buyer",
    avatar: "/user-2.jpg",
    content: "두 번째 구매입니다. 역시 좋아요!",
    timestamp: "2024-01-14 08:20",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 27,
    username: "malicious_bot",
    avatar: "/user-1.jpg",
    content: "바이러스 감염! 클릭 금지! 악성코드!",
    timestamp: "2024-01-14 07:15",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 28,
    username: "vet_recommendation",
    avatar: "/user-3.jpg",
    content: "수의사로서 추천합니다. 안전한 소재예요",
    timestamp: "2024-01-14 06:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 29,
    username: "disappointed_buyer",
    avatar: "/user-4.jpg",
    content: "기대했는데 별로네요...",
    timestamp: "2024-01-14 05:30",
    sentiment: "부정",
    isDeleted: false,
  },
  {
    id: 30,
    username: "price_conscious",
    avatar: "/user-2.jpg",
    content: "가격 대비 괜찮은 것 같아요",
    timestamp: "2024-01-14 04:20",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 31,
    username: "enthusiastic_fan",
    avatar: "/user-1.jpg",
    content: "최고예요! 모든 반려동물 가족들께 추천!",
    timestamp: "2024-01-13 23:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 32,
    username: "suspicious_account",
    avatar: "/user-3.jpg",
    content: "돈만 버리는 사기 상품 경고!!!",
    timestamp: "2024-01-13 22:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 33,
    username: "practical_reviewer",
    avatar: "/user-4.jpg",
    content: "실용적이고 내구성이 좋네요",
    timestamp: "2024-01-13 21:15",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 34,
    username: "first_time_buyer",
    avatar: "/user-2.jpg",
    content: "처음 구매해보는데 어떤가요?",
    timestamp: "2024-01-13 20:00",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 35,
    username: "angry_returner",
    avatar: "/user-1.jpg",
    content: "환불 처리 왜 이렇게 늦어요? 짜증나네",
    timestamp: "2024-01-13 19:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 36,
    username: "loyal_customer",
    avatar: "/user-3.jpg",
    content: "항상 이 브랜드 제품 사용해요. 신뢰해요",
    timestamp: "2024-01-13 18:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 37,
    username: "size_questioner",
    avatar: "/user-4.jpg",
    content: "대형견용 사이즈도 있나요?",
    timestamp: "2024-01-13 17:20",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 38,
    username: "quality_checker",
    avatar: "/user-2.jpg",
    content: "품질이 예상보다 좋네요!",
    timestamp: "2024-01-13 16:10",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 39,
    username: "troll_account",
    avatar: "/user-1.jpg",
    content: "ㅋㅋㅋ 이딴걸 왜 사냐 ㅂㅅ들아",
    timestamp: "2024-01-13 15:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 40,
    username: "gift_giver",
    avatar: "/user-3.jpg",
    content: "친구 강아지 선물로 샀어요. 좋아할 것 같아요",
    timestamp: "2024-01-13 14:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 41,
    username: "color_questioner",
    avatar: "/user-4.jpg",
    content: "다른 색상도 있나요?",
    timestamp: "2024-01-13 13:20",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 42,
    username: "satisfied_mom",
    avatar: "/user-2.jpg",
    content: "아이들이 정말 좋아해요! 감사합니다",
    timestamp: "2024-01-13 12:15",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 43,
    username: "complaint_user",
    avatar: "/user-1.jpg",
    content: "배송 포장이 엉망이었어요. 개선 필요",
    timestamp: "2024-01-13 11:30",
    sentiment: "부정",
    isDeleted: false,
  },
  {
    id: 44,
    username: "helpful_reviewer",
    avatar: "/user-3.jpg",
    content: "사용법: 처음엔 천천히 적응시키세요",
    timestamp: "2024-01-13 10:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 45,
    username: "shipping_questioner",
    avatar: "/user-4.jpg",
    content: "배송 얼마나 걸리나요?",
    timestamp: "2024-01-13 09:30",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 46,
    username: "brand_fan",
    avatar: "/user-2.jpg",
    content: "이 브랜드 제품은 항상 만족스러워요",
    timestamp: "2024-01-13 08:20",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 47,
    username: "spam_advertiser",
    avatar: "/user-1.jpg",
    content: "광고) 더 저렴한 대체품 판매합니다!",
    timestamp: "2024-01-13 07:15",
    sentiment: "중립",
    isDeleted: true,
  },
  {
    id: 48,
    username: "durability_tester",
    avatar: "/user-3.jpg",
    content: "내구성 테스트 결과: 매우 우수",
    timestamp: "2024-01-13 06:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 49,
    username: "price_complainer",
    avatar: "/user-4.jpg",
    content: "너무 비싸요. 가격 인하 좀 해주세요",
    timestamp: "2024-01-13 05:30",
    sentiment: "부정",
    isDeleted: false,
  },
  {
    id: 50,
    username: "neutral_observer",
    avatar: "/user-2.jpg",
    content: "평범한 제품입니다",
    timestamp: "2024-01-13 04:20",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 51,
    username: "excited_buyer",
    avatar: "/user-1.jpg",
    content: "드디어 주문했어요! 너무 기대돼요 🎉",
    timestamp: "2024-01-12 23:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 52,
    username: "fake_reviewer",
    avatar: "/user-3.jpg",
    content: "가짜 리뷰 의심됩니다. 조심하세요",
    timestamp: "2024-01-12 22:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 53,
    username: "professional_groomer",
    avatar: "/user-4.jpg",
    content: "펫샵 운영자로서 추천하는 제품입니다",
    timestamp: "2024-01-12 21:15",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 54,
    username: "warranty_questioner",
    avatar: "/user-2.jpg",
    content: "품질보증 기간이 어떻게 되나요?",
    timestamp: "2024-01-12 20:00",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 55,
    username: "dissatisfied_user",
    avatar: "/user-1.jpg",
    content: "기대 이하예요. 다시는 안 사겠어요",
    timestamp: "2024-01-12 19:30",
    sentiment: "부정",
    isDeleted: false,
  },
  {
    id: 56,
    username: "happy_grandma",
    avatar: "/user-3.jpg",
    content: "손주 강아지가 너무 좋아해요. 고마워요",
    timestamp: "2024-01-12 18:45",
    sentiment: "긍정",
    isDeleted: false,
  },
  {
    id: 57,
    username: "material_questioner",
    avatar: "/user-4.jpg",
    content: "소재가 안전한가요? 성분 알려주세요",
    timestamp: "2024-01-12 17:20",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 58,
    username: "recommendation_seeker",
    avatar: "/user-2.jpg",
    content: "비슷한 다른 제품도 추천해주세요",
    timestamp: "2024-01-12 16:10",
    sentiment: "중립",
    isDeleted: false,
  },
  {
    id: 59,
    username: "abusive_user",
    avatar: "/user-1.jpg",
    content: "개같은 서비스! 망해버려라!",
    timestamp: "2024-01-12 15:30",
    sentiment: "부정",
    isDeleted: true,
  },
  {
    id: 60,
    username: "thankful_customer",
    avatar: "/user-3.jpg",
    content: "정말 감사합니다. 훌륭한 제품이에요! ⭐⭐⭐⭐⭐",
    timestamp: "2024-01-12 14:45",
    sentiment: "긍정",
    isDeleted: false,
  },
];

// API 호출 함수들
export async function getCommentStats(instagram_id = null) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getCommentStats");
    return null;
  }

  const params = { instagram_id: instagram_id };

  try {
    const response = await api.get("/sns-service/instagram/comments/status", { params });
    
    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch comment stats:", error);
    return null;
  }
}

export async function getSentimentAnalysis(instagram_id) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getSentimentAnalysis");
    return null;
  }

  try {
    const params = { instagram_id: instagram_id };
    const response = await api.get("/sns-service/instagram/comments/sentiment-ratio", { params });
    
    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch sentiment analysis:", error);
    return null;
  }
}

export async function getBannedWords(instagram_id) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getBannedWords");
    return [];
  }

  try {
    const params = { instagram_id: instagram_id };
    const response = await api.get("/sns-service/instagram/comments/banned-words", { params });
    
    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch banned words:", error);
    return [];
  }
}

export async function getComments(instagram_id, page = 0, size = 20, isDeleted = null, sentiment = null, keyword = null, sortBy = "timestamp") {
  if (!instagram_id) {
    console.warn("instagram_id is required for getComments");
    return null;
  }

  try {
            const params = {
          instagram_id: instagram_id,
          page: page,
          size: size,
          sort: sortBy,
          ...(isDeleted !== null && { is_deleted: isDeleted }),
          ...(sentiment && { sentiment: sentiment }),
          ...(keyword && { keyword: keyword })
        };

    const response = await api.get("/sns-service/instagram/comments/search", { params });
    
    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return null;
  }
}

export async function addBannedWord(instagram_id, word) {
  if (!instagram_id) {
    console.warn("instagram_id is required for addBannedWord");
    return { success: false, message: "instagram_id is required" };
  }

  try {
    const response = await api.post("/sns-service/instagram/comments/banned-words", { 
      instagram_id: instagram_id,
      word: word 
    });
    
    if (response.data && response.data.code === "2000") {
      return { success: true, word };
    }
    
    return { success: false, message: response.data?.message || "Failed to add banned word" };
  } catch (error) {
    console.error("Failed to add banned word:", error);
    return { success: false, message: "Failed to add banned word" };
  }
}

export async function removeBannedWord(instagram_id, word) {
  if (!instagram_id) {
    console.warn("instagram_id is required for removeBannedWord");
    return { success: false, message: "instagram_id is required" };
  }

  try {
    const params = { instagram_id: instagram_id,
      word: word
     };

    const response = await api.delete("/sns-service/instagram/comments/banned-words", {params});
    
    if (response.data && response.data.code === "2000") {
      return { success: true, word };
    }
    
    return { success: false, message: response.data?.message || "Failed to remove banned word" };
  } catch (error) {
    console.error("Failed to remove banned word:", error);
    return { success: false, message: "Failed to remove banned word" };
  }
}

// 댓글 자동삭제 설정 함수
export async function updateAutoDeleteSetting(instagram_id, isAutoDelete) {
  if (!instagram_id) {
    console.warn("instagram_id is required for updateAutoDeleteSetting");
    return null;
  }

  try {
    const params = { 
      instagram_id: instagram_id,
      is_auto_delete: isAutoDelete
     };

     console.log

    const response = await api.put(`/sns-service/instagram/profiles/auto-delete`, params);
    
    console.log("Auto delete setting updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update auto delete setting:", error);
    throw error;
  }
}

// 댓글 삭제 함수
export async function deleteComment(delete_id) {
  if (!delete_id) {
    console.warn("delete_id is required for deleteComment");
    return { success: false, message: "delete_id is required" };
  }

  try {
    const response = await api.delete(`/sns-service/instagram/comments/${delete_id}`);
    
    if (response.data && response.data.code === "2000") {
      return { success: true, message: "댓글이 삭제되었습니다." };
    }
    
    return { success: false, message: response.data?.message || "댓글 삭제에 실패했습니다." };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, message: "댓글 삭제 중 오류가 발생했습니다." };
  }
}
