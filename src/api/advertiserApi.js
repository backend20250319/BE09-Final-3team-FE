/* eslint-env node */
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

console.log("[ENV] BASE_URL =", BASE_URL);

const advertiserApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

advertiserApi.interceptors.request.use(
  (cfg) => {
    // SSR 가드: 브라우저에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("advertiserToken");
      if (token) {
        // Axios v1: headers가 AxiosHeaders일 수도, plain object일 수도 있음
        if (cfg.headers && typeof cfg.headers.set === "function") {
          cfg.headers.set("Authorization", `Bearer ${token}`);
          // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
          cfg.headers.set(
            "X-User-No",
            localStorage.getItem("advertiserNo") || ""
          );
          cfg.headers.set(
            "X-User-Type",
            localStorage.getItem("userType") || ""
          );
          // 다른 일반적인 헤더명도 시도
          cfg.headers.set(
            "X-Advertiser-No",
            localStorage.getItem("advertiserNo") || ""
          );
          cfg.headers.set(
            "User-No",
            localStorage.getItem("advertiserNo") || ""
          );
          cfg.headers.set("User-Type", localStorage.getItem("userType") || "");
        } else {
          cfg.headers = cfg.headers || {};
          cfg.headers["Authorization"] = `Bearer ${token}`;
          // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
          cfg.headers["X-User-No"] = localStorage.getItem("advertiserNo") || "";
          cfg.headers["X-User-Type"] = localStorage.getItem("userType") || "";
          // 다른 일반적인 헤더명도 시도
          cfg.headers["X-Advertiser-No"] =
            localStorage.getItem("advertiserNo") || "";
          cfg.headers["User-No"] = localStorage.getItem("advertiserNo") || "";
          cfg.headers["User-Type"] = localStorage.getItem("userType") || "";
        }
      } else {
        console.warn("advertiserToken이 없습니다. API 요청:", cfg.url);
        // 토큰이 없을 때는 요청을 지연시켜 토큰 저장 완료 대기
        return new Promise((resolve) => {
          const checkToken = () => {
            const newToken = localStorage.getItem("advertiserToken");
            if (newToken) {
              if (cfg.headers && typeof cfg.headers.set === "function") {
                cfg.headers.set("Authorization", `Bearer ${newToken}`);
                // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
                cfg.headers.set(
                  "X-User-No",
                  localStorage.getItem("advertiserNo") || ""
                );
                cfg.headers.set(
                  "X-User-Type",
                  localStorage.getItem("userType") || ""
                );
                // 다른 일반적인 헤더명도 시도
                cfg.headers.set(
                  "X-Advertiser-No",
                  localStorage.getItem("advertiserNo") || ""
                );
                cfg.headers.set(
                  "User-No",
                  localStorage.getItem("advertiserNo") || ""
                );
                cfg.headers.set(
                  "User-Type",
                  localStorage.getItem("userType") || ""
                );
              } else {
                cfg.headers = cfg.headers || {};
                cfg.headers["Authorization"] = `Bearer ${newToken}`;
                // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
                cfg.headers["X-User-No"] =
                  localStorage.getItem("advertiserNo") || "";
                cfg.headers["X-User-Type"] =
                  localStorage.getItem("userType") || "";
                // 다른 일반적인 헤더명도 시도
                cfg.headers["X-Advertiser-No"] =
                  localStorage.getItem("advertiserNo") || "";
                cfg.headers["User-No"] =
                  localStorage.getItem("advertiserNo") || "";
                cfg.headers["User-Type"] =
                  localStorage.getItem("userType") || "";
              }
              resolve(cfg);
            } else {
              setTimeout(checkToken, 100);
            }
          };
          checkToken();
        });
      }
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

export default advertiserApi;

const ADVERTISER_PREFIX =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ADVERTISER_PREFIX) ||
  "/advertiser-service/advertiser";
// Admin API
const ADMIN_PREFIX = `${ADVERTISER_PREFIX}/admin`;

// 1. 광고주 프로필 정보 조회
export const getAdvertiser = async () => {
  const res = await advertiserApi.get(`${ADVERTISER_PREFIX}/profile`);
  return res.data.data;
};

// 2. 광고주 프로필 정보 수정
export const updateAdvertiser = async (profile) => {
  const res = await advertiserApi.put(`${ADVERTISER_PREFIX}/profile`, profile);
  return res.data.data;
};

const FILE_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FILE_PREFIX) ||
  "/advertiser-service/file";

// 2. 광고주 파일 조회
export const getFileByAdvertiserNo = async () => {
  const res = await advertiserApi.get(`${FILE_PREFIX}/advertiser`);
  return res.data.data;
};

// 3. 광고주 파일 수정
export const updateFile = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await advertiserApi.put(`${FILE_PREFIX}/advertiser`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

//=====================================================================================

// 광고주 신청 목록 조회 (관리자용)
export const getAdvertiserApplications = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await advertiserApi.get(
    `${ADMIN_PREFIX}/advertiser/all?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 광고주 승인 (관리자용)
export const approveAdvertiser = async (advertiserId) => {
  const res = await advertiserApi.patch(
    `${ADMIN_PREFIX}/advertiser/${advertiserId}/approve`
  );
  return res.data?.data ?? res.data;
};

// 광고주 거절 (관리자용)
export const rejectAdvertiser = async (advertiserId, reason) => {
  const res = await advertiserApi.patch(
    `${ADMIN_PREFIX}/advertiser/${advertiserId}/reject`,
    reason,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data?.data ?? res.data;
};

// 광고주 제한 (관리자용)
export const restrictAdvertiser = async (advertiserId) => {
  const res = await advertiserApi.post(
    `${ADMIN_PREFIX}/advertiser/${advertiserId}/restrict`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 목록 조회 (관리자용)
export const getAllCampaigns = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await advertiserApi.get(
    `${ADMIN_PREFIX}/ad/trial?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 대기 중인 캠페인 목록 조회 (관리자용)
export const getPendingCampaigns = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await advertiserApi.get(
    `${ADMIN_PREFIX}/ad/pending?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 승인 (관리자용)
export const approveCampaign = async (adId) => {
  const res = await advertiserApi.patch(`${ADMIN_PREFIX}/ad/${adId}/approve`);
  return res.data?.data ?? res.data;
};

// 캠페인 거절 (관리자용)
export const rejectCampaign = async (adId, reason) => {
  const res = await advertiserApi.patch(
    `${ADMIN_PREFIX}/ad/${adId}/reject?reason=${encodeURIComponent(reason)}`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 삭제 (관리자용)
export const deleteCampaign = async (adId) => {
  const res = await advertiserApi.patch(`${ADMIN_PREFIX}/ad/${adId}/delete`);
  return res.data?.data ?? res.data;
};
