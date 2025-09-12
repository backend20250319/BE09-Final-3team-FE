/* eslint-env node */
import axios from "axios";
import { createAuthHeaders } from "../utils/jwtUtils";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const PET_SERVICE_BASE = `${BASE_URL}/pet-service`;

// Admin API
const ADMIN_PREFIX = `${PET_SERVICE_BASE}/admin/pet`;

console.log("[ENV] PET_SERVICE_BASE =", PET_SERVICE_BASE);

// 기본 axios 인스턴스
const api = axios.create({
  baseURL: PET_SERVICE_BASE,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (cfg) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userNo = localStorage.getItem("userNo");

      if (token) {
        if (cfg.headers && typeof cfg.headers.set === "function") {
          cfg.headers.set("Authorization", `Bearer ${token}`);
        } else {
          cfg.headers = cfg.headers || {};
          cfg.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      if (userNo) {
        if (cfg.headers && typeof cfg.headers.set === "function") {
          cfg.headers.set("X-User-No", userNo);
        } else {
          cfg.headers = cfg.headers || {};
          cfg.headers["X-User-No"] = userNo;
        }
      }
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

// ===== 반려동물 관련 API =====

// 반려동물 목록 조회
export const getPets = async () => {
  try {
    const headers = createAuthHeaders();
    const response = await api.get("/pets", { headers });
    return response.data;
  } catch (error) {
    console.error("getPets API 에러:", error);
    throw error;
  }
};

// 반려동물 정보 조회
export const getPet = async (petNo) => {
  try {
    const response = await api.get(`/pets/${petNo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 반려동물 등록
export const createPet = async (petData) => {
  try {
    const response = await api.post("/pets", petData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 반려동물 수정
export const updatePet = async (petNo, petData) => {
  try {
    const response = await api.put(`/pets/${petNo}`, petData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 반려동물 삭제
export const deletePet = async (petNo) => {
  try {
    const response = await api.delete(`/pets/${petNo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 반려동물 이미지 업로드
export const uploadPetImage = async (petNo, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/pets/${petNo}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PetStar 신청
export const applyPetStar = async (petNo) => {
  try {
    const response = await api.post(`/pets/${petNo}/petstar/apply`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ===== 포트폴리오 관련 API =====

// 포트폴리오 조회
export const getPortfolio = async (petNo) => {
  try {
    const response = await api.get(`/pets/${petNo}/portfolio`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 포트폴리오 등록/수정
export const savePortfolio = async (petNo, portfolioData) => {
  try {
    const response = await api.post(`/pets/${petNo}/portfolio`, portfolioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ===== 활동이력 관련 API =====

// 활동이력 목록 조회
export const getHistories = async (petNo) => {
  try {
    const response = await api.get(`/pets/${petNo}/histories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 활동이력 등록
export const createHistory = async (petNo, historyData) => {
  try {
    const response = await api.post(`/pets/${petNo}/histories`, historyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 활동이력 수정
export const updateHistory = async (petNo, historyNo, historyData) => {
  try {
    const response = await api.put(
      `/pets/${petNo}/histories/${historyNo}`,
      historyData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 활동이력 삭제
export const deleteHistory = async (petNo, historyNo) => {
  try {
    const response = await api.delete(`/pets/${petNo}/histories/${historyNo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 활동이력 이미지 업로드
export const uploadHistoryImages = async (petNo, historyNo, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post(
      `/pets/${petNo}/histories/${historyNo}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 활동이력 이미지 삭제
export const deleteHistoryImage = async (petNo, historyNo, imageId) => {
  try {
    const response = await api.delete(
      `/pets/${petNo}/histories/${historyNo}/images/${imageId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 활동이력 이미지 목록 조회
export const getHistoryImages = async (petNo, historyNo) => {
  try {
    const response = await api.get(
      `/pets/${petNo}/histories/${historyNo}/images`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 중복 활동이력 정리
export const cleanupDuplicateHistories = async (petNo) => {
  try {
    const response = await api.post(`/pets/${petNo}/histories/cleanup`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 펫스타 신청 목록 조회 (관리자용)
export const getPetStarApplications = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);
  const res = await api.get(
    `${ADMIN_PREFIX}/applications?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 펫스타 승인 (관리자용)
export const approvePetStar = async (petNo) => {
  const res = await api.patch(`${ADMIN_PREFIX}/${petNo}/approve`);
  return res.data?.data ?? res.data;
};

// 펫스타 거절 (관리자용)
export const rejectPetStar = async (petNo, reason) => {
  const res = await api.patch(`${ADMIN_PREFIX}/${petNo}/reject`, reason, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data?.data ?? res.data;
};

export default api;
