/* eslint-env node */
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

console.log("[ENV] BASE_URL =", BASE_URL);

const userServiceApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

userServiceApi.interceptors.request.use(
  (cfg) => {
    console.log("🔍 userServiceApi 인터셉터 시작 - URL:", cfg.url);

    // SSR 가드: 브라우저에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      console.log("🔑 토큰 존재 여부:", !!token);
      if (token) {
        // Axios v1: headers가 AxiosHeaders일 수도, plain object일 수도 있음
        if (cfg.headers && typeof cfg.headers.set === "function") {
          cfg.headers.set("Authorization", `Bearer ${token}`);
          // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
          cfg.headers.set("X-User-No", localStorage.getItem("userNo") || "");
          cfg.headers.set(
            "X-User-Type",
            localStorage.getItem("userType") || ""
          );
          // 다른 일반적인 헤더명도 시도
          cfg.headers.set("User-No", localStorage.getItem("userNo") || "");
          cfg.headers.set("User-Type", localStorage.getItem("userType") || "");
        } else {
          cfg.headers = cfg.headers || {};
          cfg.headers["Authorization"] = `Bearer ${token}`;
          // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
          cfg.headers["X-User-No"] = localStorage.getItem("userNo") || "";
          cfg.headers["X-User-Type"] = localStorage.getItem("userType") || "";
          // 다른 일반적인 헤더명도 시도
          cfg.headers["User-No"] = localStorage.getItem("userNo") || "";
          cfg.headers["User-Type"] = localStorage.getItem("userType") || "";
        }
      } else {
        // 로그인 관련 API들은 토큰 체크를 건너뛰기
        const isAuthAPI =
          cfg.url &&
          (cfg.url.includes("/auth/login") ||
            cfg.url.includes("/auth/signup") ||
            cfg.url.includes("/auth/email/send") ||
            cfg.url.includes("/auth/email/verify") ||
            cfg.url.includes("/auth/password/reset") ||
            cfg.url.includes("/auth/password/verify") ||
            cfg.url.includes("/auth/password/change"));

        console.log(
          "🔍 인증 API 체크 - URL:",
          cfg.url,
          "isAuthAPI:",
          isAuthAPI
        );

        if (isAuthAPI) {
          // 인증이 필요하지 않은 API들은 토큰 없이도 진행
          console.log("✅ 인증이 필요하지 않은 API - 토큰 없이 진행:", cfg.url);
          return cfg;
        }

        console.warn("token이 없습니다. API 요청:", cfg.url);
        // 토큰이 없을 때는 요청을 지연시켜 토큰 저장 완료 대기
        return new Promise((resolve) => {
          const checkToken = () => {
            const newToken = localStorage.getItem("token");
            if (newToken) {
              if (cfg.headers && typeof cfg.headers.set === "function") {
                cfg.headers.set("Authorization", `Bearer ${newToken}`);
                // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
                cfg.headers.set(
                  "X-User-No",
                  localStorage.getItem("userNo") || ""
                );
                cfg.headers.set(
                  "X-User-Type",
                  localStorage.getItem("userType") || ""
                );
                // 다른 일반적인 헤더명도 시도
                cfg.headers.set(
                  "User-No",
                  localStorage.getItem("userNo") || ""
                );
                cfg.headers.set(
                  "User-Type",
                  localStorage.getItem("userType") || ""
                );
              } else {
                cfg.headers = cfg.headers || {};
                cfg.headers["Authorization"] = `Bearer ${newToken}`;
                // 백엔드에서 토큰 파싱에 문제가 있을 경우를 대비해 추가 정보 포함
                cfg.headers["X-User-No"] = localStorage.getItem("userNo") || "";
                cfg.headers["X-User-Type"] =
                  localStorage.getItem("userType") || "";
                // 다른 일반적인 헤더명도 시도
                cfg.headers["User-No"] = localStorage.getItem("userNo") || "";
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

export default userServiceApi;

const USER_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USER_PREFIX) ||
  "/user-service";

// Auth API
const AUTH_PREFIX = `${USER_PREFIX}/auth`;

// 1. 사용자 로그인
export const loginUser = async (loginData) => {
  const res = await userServiceApi.post(`${AUTH_PREFIX}/login`, loginData);
  return res.data.data;
};

// 2. 사용자 회원가입
export const signupUser = async (signupData) => {
  const res = await userServiceApi.post(`${AUTH_PREFIX}/signup`, signupData);
  return res.data.data;
};

// 3. 이메일 인증번호 발송
export const sendEmailVerification = async (email) => {
  // 여러 엔드포인트를 시도해보기
  const endpoints = [
    `${BASE_URL}/user-service/auth/email/send`,
    `${BASE_URL}/user-service/email/verify`,
    `${BASE_URL}/auth/email/send`,
    `${BASE_URL}${AUTH_PREFIX}/email/send`,
    `${BASE_URL}/email/send`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log("이메일 인증 API 시도:", endpoint);
      const res = await axios.post(
        endpoint,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("이메일 인증 성공:", endpoint);
      return res.data.data || res.data;
    } catch (error) {
      console.log("이메일 인증 실패:", endpoint, error.response?.status);
      if (endpoint === endpoints[endpoints.length - 1]) {
        // 마지막 엔드포인트까지 실패한 경우
        throw error;
      }
    }
  }
};

// 4. 이메일 인증번호 확인
export const verifyEmailCode = async (email, code) => {
  // 여러 엔드포인트를 시도해보기
  const endpoints = [
    `${BASE_URL}/user-service/auth/email/verify`,
    `${BASE_URL}/user-service/email/verify`,
    `${BASE_URL}/auth/email/verify`,
    `${BASE_URL}${AUTH_PREFIX}/email/verify`,
    `${BASE_URL}/email/verify`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log("이메일 인증번호 확인 API 시도:", endpoint);
      const res = await axios.post(
        endpoint,
        {
          email,
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("이메일 인증번호 확인 성공:", endpoint);
      return res.data.data || res.data;
    } catch (error) {
      console.log(
        "이메일 인증번호 확인 실패:",
        endpoint,
        error.response?.status
      );
      if (endpoint === endpoints[endpoints.length - 1]) {
        // 마지막 엔드포인트까지 실패한 경우
        throw error;
      }
    }
  }
};

// 5. 비밀번호 재설정 요청
export const requestPasswordReset = async (email) => {
  const res = await userServiceApi.post(`${AUTH_PREFIX}/password/reset`, {
    email,
  });
  return res.data.data;
};

// 6. 비밀번호 재설정 인증번호 확인
export const verifyPasswordResetCode = async (email, code) => {
  const res = await userServiceApi.post(`${AUTH_PREFIX}/password/verify`, {
    email,
    code,
  });
  return res.data;
};

// 7. 비밀번호 재설정
export const resetPassword = async (token, newPassword) => {
  const res = await userServiceApi.post(
    `${AUTH_PREFIX}/password/reset/confirm`,
    {
      token,
      newPassword,
    }
  );
  return res.data.data;
};

// User Profile API
const PROFILE_PREFIX = `${USER_PREFIX}/profile`;

// 1. 사용자 프로필 조회
export const getUserProfile = async () => {
  const res = await userServiceApi.get(`${PROFILE_PREFIX}`);
  return res.data.data;
};

// 2. 사용자 프로필 수정
export const updateUserProfile = async (profileData) => {
  const res = await userServiceApi.put(`${PROFILE_PREFIX}`, profileData);
  return res.data.data;
};

// 3. 사용자 프로필 이미지 업로드
export const uploadUserProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await userServiceApi.post(`${PROFILE_PREFIX}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

// Pet API
const PET_PREFIX = `${USER_PREFIX}/pets`;

// 1. 반려동물 목록 조회
export const getPets = async () => {
  const res = await userServiceApi.get(`${PET_PREFIX}`);
  return res.data.data;
};

// 2. 반려동물 상세 조회
export const getPet = async (petNo) => {
  const res = await userServiceApi.get(`${PET_PREFIX}/${petNo}`);
  return res.data.data;
};

// 3. 반려동물 등록
export const createPet = async (petData) => {
  const res = await userServiceApi.post(`${PET_PREFIX}`, petData);
  return res.data.data;
};

// 4. 반려동물 수정
export const updatePet = async (petNo, petData) => {
  const res = await userServiceApi.put(`${PET_PREFIX}/${petNo}`, petData);
  return res.data.data;
};

// 5. 반려동물 삭제
export const deletePet = async (petNo) => {
  const res = await userServiceApi.delete(`${PET_PREFIX}/${petNo}`);
  return res.data.data;
};

// 6. 반려동물 이미지 업로드
export const uploadPetImage = async (petNo, imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const res = await userServiceApi.post(
    `${PET_PREFIX}/${petNo}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
};

// PetStar API
const PETSTAR_PREFIX = `${PET_PREFIX}/petstar`;

// 1. PetStar 신청
export const applyPetStar = async (petNo) => {
  const res = await userServiceApi.post(`${PET_PREFIX}/${petNo}/petstar/apply`);
  return res.data.data;
};

// 2. PetStar 신청 상태 조회
export const getPetStarStatus = async (petNo) => {
  const res = await userServiceApi.get(`${PET_PREFIX}/${petNo}/petstar/status`);
  return res.data.data;
};

// 3. PetStar 목록 조회
export const getPetStars = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await userServiceApi.get(
    `${PETSTAR_PREFIX}?${queryParams.toString()}`
  );
  return res.data.data;
};

// Portfolio API
const PORTFOLIO_PREFIX = `${USER_PREFIX}/portfolio`;

// 1. 포트폴리오 조회
export const getPortfolio = async (petNo) => {
  const res = await userServiceApi.get(`${PORTFOLIO_PREFIX}/${petNo}`);
  return res.data.data;
};

// 2. 포트폴리오 활동 추가
export const addPortfolioActivity = async (petNo, activityData) => {
  const res = await userServiceApi.post(
    `${PORTFOLIO_PREFIX}/${petNo}/activities`,
    activityData
  );
  return res.data.data;
};

// 3. 펫 포트폴리오 조회 (pet-service)
export const getPetPortfolio = async (petNo) => {
  const res = await userServiceApi.get(`${PET_PREFIX}/${petNo}/portfolio`);
  return res.data.data;
};

// 4. 펫 포트폴리오 업데이트 (pet-service)
export const updatePetPortfolio = async (petNo, portfolioData) => {
  const res = await userServiceApi.post(
    `${PET_PREFIX}/${petNo}/portfolio`,
    portfolioData
  );
  return res.data.data;
};

// 5. 펫 활동 이력 조회
export const getPetHistories = async (petNo) => {
  const res = await userServiceApi.get(`${PET_PREFIX}/${petNo}/histories`);
  return res.data.data;
};

// 6. 펫 활동 이력 정리
export const cleanupPetHistories = async (petNo) => {
  const res = await userServiceApi.post(
    `${PET_PREFIX}/${petNo}/histories/cleanup`,
    {}
  );
  return res.data;
};

// 7. 펫 활동 이력 삭제
export const deletePetHistory = async (petNo, historyNo) => {
  const res = await userServiceApi.delete(
    `${PET_PREFIX}/${petNo}/histories/${historyNo}`
  );
  return res.data;
};

// 8. 포트폴리오 이미지 업로드
export const uploadPortfolioImage = async (petNo, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("petNo", petNo);

  const res = await userServiceApi.post(
    `${PET_PREFIX}/${petNo}/portfolio/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
};

// 9. 포트폴리오 활동 수정
export const updatePortfolioActivity = async (
  petNo,
  activityId,
  activityData
) => {
  const res = await userServiceApi.put(
    `${PORTFOLIO_PREFIX}/${petNo}/activities/${activityId}`,
    activityData
  );
  return res.data.data;
};

// 4. 포트폴리오 활동 삭제
export const deletePortfolioActivity = async (petNo, activityId) => {
  const res = await userServiceApi.delete(
    `${PORTFOLIO_PREFIX}/${petNo}/activities/${activityId}`
  );
  return res.data.data;
};

// Report API
const REPORT_PREFIX = `${USER_PREFIX}/reports`;

// 1. 사용자 신고
export const reportUser = async (reportData) => {
  const res = await userServiceApi.post(`${REPORT_PREFIX}`, reportData);
  return res.data.data;
};

// 2. 신고 사유 목록 조회
export const getReportReasons = async () => {
  const res = await userServiceApi.get(`${REPORT_PREFIX}/reasons`);
  return res.data.data;
};

// Admin API
const ADMIN_PREFIX = `${USER_PREFIX}/admin`;

// 1. 사용자 목록 조회 (관리자용)
export const getAllUsers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.status) queryParams.append("status", params.status);

  const res = await userServiceApi.get(
    `${ADMIN_PREFIX}/users?${queryParams.toString()}`
  );
  return res.data.data;
};

// 2. 사용자 상세 조회 (관리자용)
export const getUserDetail = async (userNo) => {
  const res = await userServiceApi.get(`${ADMIN_PREFIX}/users/${userNo}`);
  return res.data.data;
};

// 3. 사용자 제한 (관리자용)
export const restrictUser = async (userNo, reason) => {
  const res = await userServiceApi.patch(
    `${ADMIN_PREFIX}/users/${userNo}/restrict`,
    { reason }
  );
  return res.data.data;
};

// 4. 사용자 제한 해제 (관리자용)
export const unrestrictUser = async (userNo) => {
  const res = await userServiceApi.patch(
    `${ADMIN_PREFIX}/users/${userNo}/unrestrict`
  );
  return res.data.data;
};

// 5. 신고 목록 조회 (관리자용)
export const getReportList = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.targetType) queryParams.append("targetType", params.targetType);
  if (params.status) queryParams.append("status", params.status);
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);

  const res = await userServiceApi.get(
    `${ADMIN_PREFIX}/reports?${queryParams.toString()}`
  );
  return res.data.data;
};

// 6. 신고 승인 (관리자용)
export const approveReport = async (reportId) => {
  const res = await userServiceApi.patch(
    `${ADMIN_PREFIX}/reports/${reportId}/approve`
  );
  return res.data.data;
};

// 7. 신고 거절 (관리자용)
export const rejectReport = async (reportId, reason) => {
  const res = await userServiceApi.patch(
    `${ADMIN_PREFIX}/reports/${reportId}/reject`,
    { reason }
  );
  return res.data.data;
};
