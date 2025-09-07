/* eslint-env node */
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ADVERTISER_SERVICE_BASE = `${BASE_URL}/advertiser-service`;

console.log("[ENV] ADVERTISER_SERVICE_BASE =", ADVERTISER_SERVICE_BASE);

// 기본 axios 인스턴스
const api = axios.create({
  baseURL: ADVERTISER_SERVICE_BASE,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (cfg) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("advertiserToken");
      if (token) {
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

// ===== 광고주 인증 관련 API =====

// 광고주 로그인
export const advertiserLogin = async (email, password) => {
  try {
    const response = await api.post("/advertiser/login", {
      userId: email, // 백엔드에서는 userId로 받음
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 회원가입 - 이메일 인증번호 발송
export const sendAdvertiserVerificationCode = async (email) => {
  try {
    const response = await api.post("/advertiser/signup/email/send", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 회원가입 - 이메일 인증번호 확인
export const verifyAdvertiserCode = async (email, code) => {
  try {
    const response = await api.post("/advertiser/signup/email/verify", {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 회원가입
export const advertiserSignup = async (signupData) => {
  try {
    const response = await api.post("/advertiser/signup", signupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 비밀번호 재설정 요청
export const requestAdvertiserPasswordReset = async (email) => {
  try {
    const response = await api.post("/advertiser/password/reset", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 비밀번호 재설정 인증번호 확인
export const verifyAdvertiserPasswordResetCode = async (email, code) => {
  try {
    const response = await api.post("/advertiser/password/reset/verify", {
      email,
      verificationCode: code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 비밀번호 변경
export const changeAdvertiserPassword = async (
  email,
  verificationCode,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await api.post("/advertiser/password/change", {
      email,
      verificationCode,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 토큰 갱신
export const refreshAdvertiserToken = async (refreshToken) => {
  try {
    const response = await api.post("/advertiser/refresh", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 프로필 조회
export const getAdvertiserProfile = async () => {
  try {
    const response = await api.get("/advertiser/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 프로필 수정
export const updateAdvertiserProfile = async (profileData) => {
  try {
    const response = await api.patch("/advertiser/profile", profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 프로필 이미지 업로드
export const uploadAdvertiserProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("advertiserNo", localStorage.getItem("advertiserNo") || "");

    const response = await api.post("/advertiser/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 회원탈퇴
export const withdrawAdvertiser = async (password, reason) => {
  try {
    const response = await api.delete("/advertiser/withdraw", {
      data: {
        password,
        reason,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 광고주 파일 업로드
export const uploadFileByAdvertiserNo = async (file, advertiserNo) => {
  const formData = new FormData();
  formData.append("file", file);

  // image는 선택적이므로 생략
  try {
    const response = await api.post(`/file/advertiser/${advertiserNo}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // 인증 토큰 등 헤더가 있으면 추가
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export default api;
