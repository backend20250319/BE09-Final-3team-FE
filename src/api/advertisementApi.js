import advertiserApi from "./advertiserApi";

const AD_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADVERTISEMENT_PREFIX) ||
    "/advertiser-service/ad";

const CAMPAIGN_PREFIX =
(typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CAMPAIGN_PREFIX) ||
"/advertiser-service/campaign";

// 1. 광고 생성
export const createAd = async (ad) => {
  const res = await advertiserApi.post(`${AD_PREFIX}`, ad);
  return res.data.data;
};

// 2-1. 광고(캠페인) 단일 조회
export const getAd = async (adNo) => {
  const res = await advertiserApi.get(`${AD_PREFIX}/${adNo}`);
  return res.data.data;
};

// 2-2. 광고주별 광고(캠페인) 전체 조회 (+ adStatus에 따라 필터링 적용)
export const getAllAdsByAdvertiser = async (adStatus) => {
  const query = adStatus ? `?adStatus=${adStatus}` : "";
  const res = await advertiserApi.get(`${AD_PREFIX}/advertiser${query}`);
  return res.data.data;
};

// 3. 광고 수정
export const updateAdByAdvertiser = async (adNo, request) => {
  const res = await advertiserApi.put(`${AD_PREFIX}/advertiser/${adNo}`, request);
  return res.data.data;
};

/* 광고 이미지 API */
const FILE_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_COMMUNITY_PREFIX) ||
    "/advertiser-service/file";

// 1. 광고 이미지 업로드
export const uploadImage = async (image = null, adNo) => {
  const formData = new FormData();

  if (image) {
    formData.append("image", image);
  }
  const res = await advertiserApi.post(`${FILE_PREFIX}/ad/${adNo}`, formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
};

// 2. 광고 이미지 조회
export const getImageByAdNo = async (adNo) => {
  const res = await advertiserApi.get(`${FILE_PREFIX}/ad/${adNo}`, adNo);
  return res.data.data;
};

// 3. 광고 이미지 수정
export const updateImage = async (adNo, newImage = null, isDeleted) => {
  const formData = new FormData();

  if (newImage) {
    formData.append("image", newImage);
  }

  const res = await advertiserApi.put(
    `${FILE_PREFIX}/ad/${adNo}`, 
    formData, 
    {
      params: { isDeleted },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
};

/* 체험단 */
// 1. 체험단 조회
export const getApplicants = async(adNo) => {
  const res = await advertiserApi.get(`${CAMPAIGN_PREFIX}/${adNo}`);
  return res.data.data;
};

// 2. 체험단 선정
export const updateApplicant = async (applicantNo, status, isSaved) => {
  const body = {
    status,
    isSaved,
  };
  const res = await advertiserApi.put(`${CAMPAIGN_PREFIX}/applicant/${applicantNo}`, body);
  return res.data.data;
};

/* PET API */
const PET_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_PET_PREFIX) ||
  "/advertiser-service/pet";

// 1. 포트폴리오 조회
export const getPortfolio = async (petNo) => {
  const res = await advertiserApi.get(`${PET_PREFIX}/portfolio/${petNo}`);
  return res.data.data;
}

// 2. 활동이력 조회
export const getHistory = async (petNo) => {
  const res = await advertiserApi.get(`${PET_PREFIX}/history/${petNo}`);
  return res.data.data;
}

// 3. 반려동물 상세 조회
export const getPet = async (petNo) => {
  const res = await advertiserApi.get(`${PET_PREFIX}/${petNo}`);
  return res.data.data;
}

// 4. 펫스타 조회
export const getPetstar = async () => {
  const res = await advertiserApi.get(`${PET_PREFIX}/petstars`);
  return res.data.data;
}

/* USER API */
const USER_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USER_PREFIX) ||
  "/advertiser-service/user";

// 1. 사용자 조회
export const getUser = async (uerNo) => {
  const res = await advertiserApi.get(`${USER_PREFIX}/profile/${uerNo}`);
  return res.data.data;
}

// 2. 사용자 신고하기
export const reportUser = async (reportRequest) => {
  const res = await advertiserApi.post(`${USER_PREFIX}/reports`, reportRequest, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data.data;
};

/* SNS API */
const SNS_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SNS_PREFIX) ||
  "/advertiser-service/instagram";

// 1. 인스타그램 프로필 조회
export const getInstagramProfile = async (userNo) => {
  const res = await advertiserApi.get(`${SNS_PREFIX}/${userNo}`);
  return res.data.data;
}

/* 리뷰 API */
const REVIEW_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_REVIEW_PREFIX) ||
  "/advertiser-service/review";

// 1. 리뷰 조회
export const getReview = async (adNo) => {
  const res = await advertiserApi.get(`${REVIEW_PREFIX}/ad/${adNo}`);
  return res.data.data;
}

// 2. 개인 리뷰 조회
export const getPersonalReview = async (applicantNo) => {
  const res = await advertiserApi.get(`${REVIEW_PREFIX}/${applicantNo}`);
  return res.data.data;
}

// 2. 리뷰 수정
export const updateReview = async (applicantNo, reviewRequest) => {
  const res = await advertiserApi.put(`${REVIEW_PREFIX}/${applicantNo}`, reviewRequest, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data.data;
}