/* eslint-env node */
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

console.log("[ENV] BASE_URL =", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (cfg) => {
    // SSR 가드: 브라우저에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
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

// 관리자 로그아웃 API
export const adminLogout = async (refreshToken) => {
  try {
    const response = await api.post("/user-service/admin/users/logout", {
      refreshToken: refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
