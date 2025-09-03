import api from "./api";

const CAMPAIGN_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CAMPAIGN_PREFIX) ||
    "/campaign-service";

// 1. adStatus별(모집중/종료된) 광고(캠페인) 전체 조회
export const getAdsGrouped = async () => {
    const res = await api.get(`${CAMPAIGN_PREFIX}/ad/adStatus`);
    return res.data.data;
};

// 2. 신청한 광고(캠페인) 전체 조회
export const getAppliedAds = async () => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/ad/applied`);
  return res.data.data;
}

// 3-1. 광고(캠페인) 이미지 조회
export const getImageByAdNo = async (adNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/ad/image/${adNo}`);
  return res.data.data;
}

// 3-2. 광고주 파일 조회
export const getAdvertiserFile = async (advertiserNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/ad/file/${advertiserNo}`);
  return res.data.data;
}

// 4. 광고(캠페인) 단일 조회
export const getAd = async (adNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/ad/${adNo}`);
  return res.data.data;
}

/* 펫 API */
// 1. 사용자별 펫 조회
export const getPets = async () => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/pet/users`);
  return res.data.data;
}

// 2. 포트폴리오 조회
export const getPortfolio = async (petNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/pet/portfolio/${petNo}`);
  return res.data.data;
}

/* 사용자 API */
// 1. 사용자 조회
export const getUser = async () => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/user/profile`);
  return res.data.data;
}

/* 체험단 API */
// 1. petNo로 체험단 신청 내역 조회
export const getApplicantsByPetNo = async (petNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/campaign/${petNo}`);
  return res.data.data;
}

// 2. 체험단 신청
export const applyCampaign = async (adNo, petNo, content) => {
  try {
    const requestBody = { content };
    const res = await api.post(`${CAMPAIGN_PREFIX}/campaign/apply?adNo=${adNo}&petNo=${petNo}`, requestBody);
    return res.data.data;
  } catch (error) {
    console.error('체험단 신청 실패:', error);
    throw error;
  }
}

// 3. 광고별 체험단 전체 조회
export const getApplicants = async (adNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/internal/${adNo}`);
  return res.data.data;
}

// 4. 광고 + 사용별 신청자 조회
export const getApplicantsByAd = async (adNo) => {
  const res = await api.get(`${CAMPAIGN_PREFIX}/campaign/users/${adNo}`);
  return res.data.data;
}

// 5. 체험단 추가 내용 수정
export const updateApplicant = async (applicantNo, content) => {
  try {
    const requestBody = { content };
    const res = await api.put(`${CAMPAIGN_PREFIX}/campaign/applicant/${applicantNo}`, requestBody);
    return res.data.data;
  } catch (error) {
    console.error('추가 내용 수정 실패:', error);
    throw error;
  }
}