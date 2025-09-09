/* eslint-env node */
import axios from "axios";
import { createAuthHeaders } from "../utils/jwtUtils";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const USER_SERVICE_BASE = `${BASE_URL}/user-service`;

console.log("[ENV] USER_SERVICE_BASE =", USER_SERVICE_BASE);

// 기본 axios 인스턴스
const api = axios.create({
  baseURL: USER_SERVICE_BASE,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (cfg) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
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

// ===== 인증 관련 API =====

// 로그인
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원가입 - 이메일 인증번호 발송
export const sendVerificationCode = async (email) => {
  try {
    const response = await api.post("/auth/email/send", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원가입 - 이메일 인증번호 확인
export const verifyCode = async (email, code) => {
  try {
    const response = await api.post("/auth/email/verify", {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원가입
export const signup = async (signupData) => {
  try {
    const response = await api.post("/auth/signup", signupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비밀번호 재설정 요청
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/auth/password/reset", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비밀번호 재설정 인증번호 확인
export const verifyPasswordResetCode = async (email, code) => {
  try {
    const response = await api.post("/auth/password/verify", {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비밀번호 변경
export const changePassword = async (
  email,
  verificationCode,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await api.post("/auth/password/change", {
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

// 토큰 갱신
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 프로필 조회
export const getProfile = async () => {
  try {
    const headers = createAuthHeaders();
    const response = await api.get("/auth/profile", { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 프로필 수정
export const updateProfile = async (profileData) => {
  try {
    const headers = createAuthHeaders();
    const response = await api.patch("/auth/profile", profileData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userNo", localStorage.getItem("userNo") || "");

    const headers = createAuthHeaders({
      "Content-Type": "multipart/form-data",
    });
    const response = await api.post("/auth/profile/image", formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원탈퇴
export const withdraw = async (password, reason) => {
  try {
    const headers = createAuthHeaders();
    const response = await api.delete("/auth/withdraw", {
      data: {
        password,
        reason,
      },
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
