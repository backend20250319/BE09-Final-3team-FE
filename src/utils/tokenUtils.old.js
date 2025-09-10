// 토큰 유틸리티 함수들 - 레거시 호환성을 위한 래퍼 함수들
// 새로운 tokenManager.js를 사용하되 기존 코드와의 호환성 유지

import { 
  isTokenExpired as newIsTokenExpired,
  needsTokenRefresh as newNeedsTokenRefresh,
  clearTokens,
  getTokenStatus as newGetTokenStatus,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  getCurrentUserType,
  getTokenKeys
} from './tokenManager';

/**
 * 토큰이 만료되었는지 확인 (레거시 호환성)
 * @param {string} tokenType - 'access' 또는 'refresh'
 * @returns {boolean} 만료되었으면 true, 아니면 false
 */
export const isTokenExpired = (tokenType = "access") => {
  return newIsTokenExpired(tokenType);
};

/**
 * 토큰 만료까지 남은 시간 (밀리초)
 * @param {string} tokenType - 'access' 또는 'refresh'
 * @returns {number} 남은 시간 (밀리초), 만료되었으면 0
 */
export const getTokenTimeRemaining = (tokenType = "access") => {
  const userType = getCurrentUserType();
  const tokenKeys = getTokenKeys(userType);
  
  const expiresAtKey = tokenType === 'access' ? tokenKeys.ACCESS_EXPIRES : tokenKeys.REFRESH_EXPIRES;
  const expiresAt = localStorage.getItem(expiresAtKey);

  if (!expiresAt) {
    return 0;
  }

  try {
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    const remaining = expiryTime - currentTime;

    return Math.max(0, remaining);
  } catch (error) {
    console.error("토큰 만료 시간 파싱 오류:", error);
    return 0;
  }
};

/**
 * 현재 사용 가능한 토큰이 있는지 확인 (레거시 호환성)
 * @returns {boolean} 유효한 토큰이 있으면 true
 */
export const hasValidToken = () => {
  const accessToken = getCurrentAccessToken();
  const refreshToken = getCurrentRefreshToken();

  if (!accessToken || !refreshToken) {
    return false;
  }

  // Access Token이 아직 유효하면 true
  if (!isTokenExpired("access")) {
    return true;
  }

  // Access Token이 만료되었지만 Refresh Token이 유효하면 true
  if (!isTokenExpired("refresh")) {
    return true;
  }

  return false;
};

/**
 * 토큰 갱신이 필요한지 확인 (레거시 호환성)
 * @returns {boolean} 갱신이 필요하면 true
 */
export const needsTokenRefresh = () => {
  return newNeedsTokenRefresh();
};

/**
 * 모든 토큰 관련 정보 삭제 (레거시 호환성)
 */
export const clearAllTokens = () => {
  clearTokens(); // 새로운 토큰 매니저 사용
};

/**
 * 토큰 상태 정보 반환 (레거시 호환성)
 * @returns {object} 토큰 상태 정보
 */
export const getTokenStatus = () => {
  const status = newGetTokenStatus();
  const accessTimeRemaining = getTokenTimeRemaining("access");
  const refreshTimeRemaining = getTokenTimeRemaining("refresh");
  
  return {
    ...status,
    accessToken: {
      exists: !!getCurrentAccessToken(),
      timeRemaining: accessTimeRemaining > 0 ? Math.floor(accessTimeRemaining / 1000 / 60) + "분" : "만료됨",
      expired: isTokenExpired("access")
    },
    refreshToken: {
      exists: !!getCurrentRefreshToken(),
      timeRemaining: refreshTimeRemaining > 0 ? Math.floor(refreshTimeRemaining / 1000 / 60) + "분" : "만료됨",
      expired: isTokenExpired("refresh")
    },
    timeRemaining: accessTimeRemaining > 0 ? Math.floor(accessTimeRemaining / 1000 / 60) + "분" : "만료됨",
    refreshTimeRemaining: refreshTimeRemaining > 0 ? Math.floor(refreshTimeRemaining / 1000 / 60) + "분" : "만료됨",
    needsRefresh: needsTokenRefresh(),
    isValid: hasValidToken(),
  };
};

/**
 * 현재 사용 가능한 토큰이 있는지 확인
 * @returns {boolean} 유효한 토큰이 있으면 true
 */
export const hasValidToken = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token || !refreshToken) {
    return false;
  }

  // Access Token이 아직 유효하면 true
  if (!isTokenExpired("access")) {
    return true;
  }

  // Access Token이 만료되었지만 Refresh Token이 유효하면 true
  if (!isTokenExpired("refresh")) {
    return true;
  }

  return false;
};

/**
 * 토큰 갱신이 필요한지 확인
 * @returns {boolean} 갱신이 필요하면 true
 */
export const needsTokenRefresh = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token || !refreshToken) {
    return false; // 토큰이 없으면 갱신할 수 없음
  }

  // Access Token이 만료되었고 Refresh Token이 유효하면 갱신 필요
  return isTokenExpired("access") && !isTokenExpired("refresh");
};

/**
 * 모든 토큰 관련 정보 삭제
 */
export const clearAllTokens = () => {
  const tokenKeys = [
    "token",
    "accessToken",
    "refreshToken",
    "userEmail",
    "userNickname",
    "userNo",
    "userType",
    "accessTokenExpiresAt",
    "refreshTokenExpiresAt",
  ];

  tokenKeys.forEach((key) => localStorage.removeItem(key));
};

/**
 * 토큰 만료 정보를 포맷된 문자열로 반환 (디버깅용)
 * @returns {object} 토큰 상태 정보
 */
export const getTokenStatus = () => {
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const accessExpiresAt = localStorage.getItem("accessTokenExpiresAt");
  const refreshExpiresAt = localStorage.getItem("refreshTokenExpiresAt");

  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenExpired: isTokenExpired("access"),
    refreshTokenExpired: isTokenExpired("refresh"),
    accessExpiresAt: accessExpiresAt
      ? new Date(accessExpiresAt).toLocaleString()
      : "N/A",
    refreshExpiresAt: refreshExpiresAt
      ? new Date(refreshExpiresAt).toLocaleString()
      : "N/A",
    accessTimeRemaining:
      Math.floor(getTokenTimeRemaining("access") / 1000 / 60) + "분",
    refreshTimeRemaining:
      Math.floor(getTokenTimeRemaining("refresh") / 1000 / 60) + "분",
    needsRefresh: needsTokenRefresh(),
    isValid: hasValidToken(),
  };
};
