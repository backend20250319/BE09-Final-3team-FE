/* eslint-env node */
import axios from "axios";
import { getCurrentAccessToken, getCurrentUserType, getTokenKeys, USER_TYPES } from "@/utils/tokenManager";

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
      const userType = getCurrentUserType();
      
      // 광고주 토큰 우선 확인
      const token = userType === USER_TYPES.ADVERTISER 
        ? getCurrentAccessToken() 
        : localStorage.getItem("advertiserToken"); // 기존 호환성을 위해 fallback
        
      if (token) {
        const tokenKeys = getTokenKeys(USER_TYPES.ADVERTISER);
        
        // Axios v1: headers가 AxiosHeaders일 수도, plain object일 수도 있음
        if (cfg.headers && typeof cfg.headers.set === "function") {
          cfg.headers.set("Authorization", `Bearer ${token}`);
          // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
          cfg.headers.set(
            "X-User-No",
            localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || ""
          );
          cfg.headers.set(
            "X-User-Type",
            localStorage.getItem(tokenKeys.USER_TYPE) || localStorage.getItem("userType") || "ADVERTISER"
          );
          // 다른 일반적인 헤더명도 시도
          cfg.headers.set(
            "X-Advertiser-No",
            localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || ""
          );
          cfg.headers.set(
            "User-No",
            localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || ""
          );
          cfg.headers.set("User-Type", localStorage.getItem(tokenKeys.USER_TYPE) || localStorage.getItem("userType") || "ADVERTISER");
        } else {
          cfg.headers = cfg.headers || {};
          cfg.headers["Authorization"] = `Bearer ${token}`;
          // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
          cfg.headers["X-User-No"] = localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || "";
          cfg.headers["X-User-Type"] = localStorage.getItem(tokenKeys.USER_TYPE) || localStorage.getItem("userType") || "ADVERTISER";
          // 다른 일반적인 헤더명도 시도
          cfg.headers["X-Advertiser-No"] = localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || "";
          cfg.headers["User-No"] = localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || "";
          cfg.headers["User-Type"] = localStorage.getItem(tokenKeys.USER_TYPE) || localStorage.getItem("userType") || "ADVERTISER";
        }
      } else {
        console.warn("advertiserToken이 없습니다. API 요청:", cfg.url);
        // 토큰이 없을 때는 요청을 지연시켜 토큰 저장 완료 대기
        return new Promise((resolve) => {
          const checkToken = () => {
            const newToken = getCurrentAccessToken() || localStorage.getItem("advertiserToken");
            if (newToken) {
              const tokenKeys = getTokenKeys(USER_TYPES.ADVERTISER);
              if (cfg.headers && typeof cfg.headers.set === "function") {
                cfg.headers.set("Authorization", `Bearer ${newToken}`);
                // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
                cfg.headers.set(
                  "X-User-No",
                  localStorage.getItem(tokenKeys.USER_NO) || localStorage.getItem("advertiserNo") || ""
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
