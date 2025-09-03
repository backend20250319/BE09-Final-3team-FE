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
        console.log("API 요청에 토큰 적용:", {
          url: cfg.url,
          token: token.substring(0, 20) + "...",
          authorization: cfg.headers.Authorization,
          userNo: cfg.headers["X-User-No"],
          userType: cfg.headers["X-User-Type"],
          allHeaders: Object.fromEntries(Object.entries(cfg.headers)),
        });
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
              console.log("토큰 대기 후 API 요청에 토큰 적용:", {
                url: cfg.url,
                token: newToken.substring(0, 20) + "...",
                authorization: cfg.headers.Authorization,
                userNo: cfg.headers["X-User-No"],
                userType: cfg.headers["X-User-Type"],
                allHeaders: Object.fromEntries(Object.entries(cfg.headers)),
              });
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
    process.env?.NEXT_PUBLIC_COMMUNITY_PREFIX) ||
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
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_COMMUNITY_PREFIX) ||
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
  fileMetaRequest = null
) => {
  const formData = new FormData();

  if (newFile) {
    formData.append("file", newFile);
  }
  if (newImage) {
    formData.append("image", newImage);
  }
  if (fileMetaRequest) {
    // JSON 객체는 문자열로 변환해서 보내야 함
    formData.append(
      "fileMeta",
      new Blob([JSON.stringify(fileMetaRequest)], { type: "application/json" })
    );
  }

  const res = await advertiserApi.put(`${FILE_PREFIX}/advertiser`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};
