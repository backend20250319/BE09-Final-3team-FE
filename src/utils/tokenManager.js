/**
 * 토큰 관리 유틸리티 - 사용자 타입별 토큰 구분 관리
 */

// 토큰 키 상수 정의
export const TOKEN_KEYS = {
  USER: {
    ACCESS: 'token',
    REFRESH: 'refreshToken',
    ACCESS_EXPIRES: 'accessTokenExpiresAt',
    REFRESH_EXPIRES: 'refreshTokenExpiresAt',
    EMAIL: 'userEmail',
    NICKNAME: 'userNickname',
    USER_NO: 'userNo',
    USER_TYPE: 'userType'
  },
  ADVERTISER: {
    ACCESS: 'advertiserToken',
    REFRESH: 'advertiserRefreshToken',
    ACCESS_EXPIRES: 'advertiserAccessTokenExpiresAt',
    REFRESH_EXPIRES: 'advertiserRefreshTokenExpiresAt',
    EMAIL: 'advertiserEmail',
    USER_NO: 'advertiserNo',
    USER_TYPE: 'advertiserType'
  }
};

// 사용자 타입 상수
export const USER_TYPES = {
  USER: 'USER',
  ADVERTISER: 'ADVERTISER',
  ADMIN: 'ADMIN'
};

/**
 * 현재 로그인된 사용자 타입 확인
 * @returns {string|null} 'USER', 'ADVERTISER', 'ADMIN' 또는 null
 */
export const getCurrentUserType = () => {
  // 광고주 토큰 확인
  const advertiserToken = localStorage.getItem(TOKEN_KEYS.ADVERTISER.ACCESS);
  if (advertiserToken) {
    return USER_TYPES.ADVERTISER;
  }

  // 일반 사용자 토큰 확인
  const userToken = localStorage.getItem(TOKEN_KEYS.USER.ACCESS);
  if (userToken) {
    const userType = localStorage.getItem(TOKEN_KEYS.USER.USER_TYPE);
    return userType === 'Admin' || userType === 'ADMIN' ? USER_TYPES.ADMIN : USER_TYPES.USER;
  }

  return null;
};

/**
 * 사용자 타입에 따른 토큰 키 반환
 * @param {string} userType - 'USER', 'ADVERTISER'
 * @returns {object} 토큰 키 객체
 */
export const getTokenKeys = (userType = null) => {
  const currentUserType = userType || getCurrentUserType();
  
  switch (currentUserType) {
    case USER_TYPES.ADVERTISER:
      return TOKEN_KEYS.ADVERTISER;
    case USER_TYPES.USER:
    case USER_TYPES.ADMIN:
    default:
      return TOKEN_KEYS.USER;
  }
};

/**
 * 현재 사용자의 액세스 토큰 가져오기
 * @returns {string|null} 액세스 토큰 또는 null
 */
export const getCurrentAccessToken = () => {
  const userType = getCurrentUserType();
  const tokenKeys = getTokenKeys(userType);
  return localStorage.getItem(tokenKeys.ACCESS);
};

/**
 * 현재 사용자의 리프레시 토큰 가져오기
 * @returns {string|null} 리프레시 토큰 또는 null
 */
export const getCurrentRefreshToken = () => {
  const userType = getCurrentUserType();
  const tokenKeys = getTokenKeys(userType);
  return localStorage.getItem(tokenKeys.REFRESH);
};

/**
 * 토큰 저장 (사용자 타입별)
 * @param {string} userType - 'USER', 'ADVERTISER'
 * @param {object} tokenData - 토큰 데이터
 */
export const saveTokens = (userType, tokenData) => {
  const tokenKeys = getTokenKeys(userType);
  
  if (tokenData.accessToken) {
    localStorage.setItem(tokenKeys.ACCESS, tokenData.accessToken);
  }
  
  if (tokenData.refreshToken) {
    localStorage.setItem(tokenKeys.REFRESH, tokenData.refreshToken);
  }
  
  if (tokenData.accessExpiresAt) {
    localStorage.setItem(tokenKeys.ACCESS_EXPIRES, tokenData.accessExpiresAt);
  }
  
  if (tokenData.refreshExpiresAt) {
    localStorage.setItem(tokenKeys.REFRESH_EXPIRES, tokenData.refreshExpiresAt);
  }
  
  if (tokenData.email) {
    localStorage.setItem(tokenKeys.EMAIL, tokenData.email);
  }
  
  if (tokenData.userNo) {
    localStorage.setItem(tokenKeys.USER_NO, tokenData.userNo);
  }
  
  if (tokenData.userType) {
    localStorage.setItem(tokenKeys.USER_TYPE, tokenData.userType);
  }
  
  if (tokenData.nickname && userType === USER_TYPES.USER) {
    localStorage.setItem(tokenKeys.NICKNAME, tokenData.nickname);
  }
};

/**
 * 토큰 만료 확인 (사용자 타입별)
 * @param {string} tokenType - 'access' 또는 'refresh'
 * @param {string} userType - 'USER', 'ADVERTISER'
 * @returns {boolean} 만료되었으면 true
 */
export const isTokenExpired = (tokenType = 'access', userType = null) => {
  const currentUserType = userType || getCurrentUserType();
  const tokenKeys = getTokenKeys(currentUserType);
  
  const expiresAtKey = tokenType === 'access' ? tokenKeys.ACCESS_EXPIRES : tokenKeys.REFRESH_EXPIRES;
  const expiresAt = localStorage.getItem(expiresAtKey);

  if (!expiresAt) {
    return true; // 만료 시간이 없으면 만료된 것으로 간주
  }

  try {
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();

    // 5분 전에 미리 만료된 것으로 처리 (여유 시간 확보)
    const bufferTime = 5 * 60 * 1000; // 5분

    return currentTime >= expiryTime - bufferTime;
  } catch (error) {
    console.error(`[${currentUserType}] 토큰 만료 시간 파싱 오류:`, error);
    return true;
  }
};

/**
 * 토큰 갱신 필요 여부 확인
 * @param {string} userType - 'USER', 'ADVERTISER'
 * @returns {boolean} 갱신이 필요하면 true
 */
export const needsTokenRefresh = (userType = null) => {
  const currentUserType = userType || getCurrentUserType();
  const tokenKeys = getTokenKeys(currentUserType);
  
  const accessToken = localStorage.getItem(tokenKeys.ACCESS);
  const refreshToken = localStorage.getItem(tokenKeys.REFRESH);

  if (!accessToken || !refreshToken) {
    return false; // 토큰이 없으면 갱신할 수 없음
  }

  // Access Token이 만료되었고 Refresh Token이 유효하면 갱신 필요
  return isTokenExpired('access', currentUserType) && !isTokenExpired('refresh', currentUserType);
};

/**
 * 현재 사용자의 모든 토큰 정보 삭제
 * @param {string} userType - 'USER', 'ADVERTISER' (선택사항)
 */
export const clearTokens = (userType = null) => {
  const currentUserType = userType || getCurrentUserType();
  
  if (currentUserType === USER_TYPES.ADVERTISER || userType === USER_TYPES.ADVERTISER) {
    const advertiserKeys = Object.values(TOKEN_KEYS.ADVERTISER);
    advertiserKeys.forEach(key => localStorage.removeItem(key));
  }
  
  if (currentUserType === USER_TYPES.USER || currentUserType === USER_TYPES.ADMIN || userType === USER_TYPES.USER) {
    const userKeys = Object.values(TOKEN_KEYS.USER);
    userKeys.forEach(key => localStorage.removeItem(key));
  }
  
  // 모든 타입의 토큰을 삭제하는 경우
  if (!userType) {
    const allKeys = [...Object.values(TOKEN_KEYS.USER), ...Object.values(TOKEN_KEYS.ADVERTISER)];
    allKeys.forEach(key => localStorage.removeItem(key));
  }
};

/**
 * 현재 사용자의 Authorization 헤더 생성
 * @returns {object} Authorization 헤더 객체
 */
export const createAuthHeaders = () => {
  const token = getCurrentAccessToken();
  const userType = getCurrentUserType();
  const tokenKeys = getTokenKeys(userType);
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 추가 헤더 정보
  const userNo = localStorage.getItem(tokenKeys.USER_NO);
  const userTypeValue = localStorage.getItem(tokenKeys.USER_TYPE);

  if (userNo) {
    headers['X-User-No'] = userNo;
    headers['User-No'] = userNo; // 백엔드 호환성을 위해 두 가지 형태 모두 제공
  }

  if (userTypeValue) {
    headers['X-User-Type'] = userTypeValue;
    headers['User-Type'] = userTypeValue;
  }

  return headers;
};

/**
 * 토큰 상태 디버그 정보
 * @returns {object} 토큰 상태 정보
 */
export const getTokenStatus = () => {
  const userType = getCurrentUserType();
  
  if (!userType) {
    return {
      userType: null,
      isLoggedIn: false,
      hasValidToken: false
    };
  }

  const tokenKeys = getTokenKeys(userType);
  const accessToken = localStorage.getItem(tokenKeys.ACCESS);
  const refreshToken = localStorage.getItem(tokenKeys.REFRESH);
  
  return {
    userType,
    isLoggedIn: !!(accessToken || refreshToken),
    hasValidToken: !!accessToken && !isTokenExpired('access', userType),
    needsRefresh: needsTokenRefresh(userType),
    accessTokenExpired: isTokenExpired('access', userType),
    refreshTokenExpired: isTokenExpired('refresh', userType)
  };
};
