/* eslint-env node */
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
        } else {
          cfg.headers = cfg.headers || {};
          cfg.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

export default advertiserApi;

const ADVERTISER_PREFIX =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADVERTISER_PREFIX) ||
    "/advertiser-service/advertiser";

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

// 1. 광고주 파일 업로드

// 2. 광고주 파일 조회
export const getFileByAdvertiserNo = async () => {
  const res = await advertiserApi.get(`${FILE_PREFIX}/advertiser`);
  return res.data.data;
};

// 3. 광고주 파일 수정
export const updateFile = async (
  newFile = null,
  newImage = null,
  fileMetaRequest = null) => {
  const formData = new FormData();

  if (newFile) {
    formData.append("file", newFile);
  }
  if (newImage) {
    formData.append("image", newImage);
  }
  if (fileMetaRequest) {
    // JSON 객체는 문자열로 변환해서 보내야 함
    formData.append("fileMeta", new Blob([JSON.stringify(fileMetaRequest)], { type: "application/json" }));
  }

  const res = await advertiserApi.put(
    `${FILE_PREFIX}/advertiser`, formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
};