/**
 * JWT 토큰 관련 유틸리티 함수들
 */

import { getCurrentAccessToken, getCurrentUserType } from "./tokenManager";

/**
 * JWT 토큰을 디코딩하여 페이로드 정보를 추출합니다.
 * @param {string} token - JWT 토큰
 * @returns {object|null} 디코딩된 페이로드 또는 null
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // JWT 토큰은 header.payload.signature 형태
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // payload 부분을 디코딩
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("JWT 디코딩 실패:", error);
    return null;
  }
};

/**
 * 현재 사용자의 토큰에서 사용자 정보를 추출합니다.
 * @returns {object|null} 사용자 정보 (userNo, userType 등) 또는 null
 */
export const getUserInfoFromToken = () => {
  try {
    const token = getCurrentAccessToken();
    if (!token) return null;

    const payload = decodeJWT(token);
    if (!payload) return null;

    const userType = getCurrentUserType();

    return {
      userNo: payload.userNo || payload.sub || payload.user_id,
      userType: userType || payload.userType || payload.type || "USER",
      email: payload.email,
      name: payload.name,
      nickname: payload.nickname,
    };
  } catch (error) {
    console.error("토큰에서 사용자 정보 추출 실패:", error);
    return null;
  }
};

/**
 * API 요청에 필요한 헤더를 생성합니다.
 * @param {object} additionalHeaders - 추가 헤더 (선택사항)
 * @returns {object} 헤더 객체
 */
export const createAuthHeaders = (additionalHeaders = {}) => {
  const token = getCurrentAccessToken();
  const userInfo = getUserInfoFromToken();

  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (userInfo) {
    if (userInfo.userNo) {
      headers["X-User-No"] = userInfo.userNo.toString();
    }
    if (userInfo.userType) {
      headers["X-User-Type"] = userInfo.userType;
    }
  }

  return headers;
};

/**
 * 토큰이 유효한지 확인합니다.
 * @returns {boolean} 토큰 유효성
 */
export const isTokenValid = () => {
  try {
    const token = getCurrentAccessToken();
    if (!token) return false;

    const payload = decodeJWT(token);
    if (!payload) return false;

    // 만료 시간 확인
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    }

    return true;
  } catch (error) {
    console.error("토큰 유효성 확인 실패:", error);
    return false;
  }
};
