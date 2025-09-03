import advertiserApi from "./advertiserApi";

const AD_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADVERTISEMENT_PREFIX) ||
    "/advertiser-service/ad";

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