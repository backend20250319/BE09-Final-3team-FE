import api from "./api";

const USER_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USER_PREFIX) ||
  "/user-service";

// ===== 마이페이지 관련 API =====

// 프로필 조회
export const getProfile = async () => {
  const res = await api.get(`${USER_PREFIX}/auth/profile`);
  return res.data?.data ?? res.data;
};

// 프로필 수정
export const updateProfile = async (profileData) => {
  const res = await api.patch(`${USER_PREFIX}/auth/profile`, profileData);
  return res.data?.data ?? res.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userNo", localStorage.getItem("userNo") || "");

  const res = await api.post(`${USER_PREFIX}/auth/profile/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data?.data ?? res.data;
};

// 회원탈퇴
export const withdraw = async (password, reason) => {
  const res = await api.delete(`${USER_PREFIX}/auth/withdraw`, {
    data: {
      password,
      reason,
    },
  });
  return res.data?.data ?? res.data;
};

// 신고 API
export const reportUser = async (payload) => {
  const res = await api.post(`${USER_PREFIX}/auth/reports`, payload);
  return res.data?.data ?? res.data;
};

// ===== 관리자용 광고주 관리 API =====

// 광고주 신청 목록 조회 (관리자용)
export const getAdvertiserApplications = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await api.get(
    `/advertiser-service/admin/advertiser/all?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 광고주 승인 (관리자용)
export const approveAdvertiser = async (advertiserId) => {
  const res = await api.patch(
    `/advertiser-service/admin/advertiser/${advertiserId}/approve`
  );
  return res.data?.data ?? res.data;
};

// 광고주 거절 (관리자용)
export const rejectAdvertiser = async (advertiserId, reason) => {
  const res = await api.patch(
    `/advertiser-service/admin/advertiser/${advertiserId}/reject`,
    reason,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data?.data ?? res.data;
};

// 광고주 제한 (관리자용)
export const restrictAdvertiser = async (advertiserId) => {
  const res = await api.post(
    `/advertiser-service/admin/advertiser/${advertiserId}/restrict`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 목록 조회 (관리자용)
export const getAllCampaigns = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await api.get(
    `/advertiser-service/admin/ad/trial?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 대기 중인 캠페인 목록 조회 (관리자용)
export const getPendingCampaigns = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await api.get(
    `/advertiser-service/admin/ad/pending?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 승인 (관리자용)
export const approveCampaign = async (adId) => {
  const res = await api.patch(`/advertiser-service/admin/ad/${adId}/approve`);
  return res.data?.data ?? res.data;
};

// 캠페인 거절 (관리자용)
export const rejectCampaign = async (adId, reason) => {
  const res = await api.patch(
    `/advertiser-service/admin/ad/${adId}/reject?reason=${encodeURIComponent(
      reason
    )}`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 삭제 (관리자용)
export const deleteCampaign = async (adId) => {
  const res = await api.patch(`/advertiser-service/admin/ad/${adId}/delete`);
  return res.data?.data ?? res.data;
};

// 신고 사유 목록 조회 (필요시)
export const getReportReasons = async () => {
  const res = await api.get(`${USER_PREFIX}/reports/reasons`);
  return res.data?.data ?? res.data;
};

// Admin API
const ADMIN_PREFIX = `${USER_PREFIX}/admin/users`;

// 신고 목록 조회 (관리자용)
export const getReportList = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.targetType) queryParams.append("targetType", params.targetType);
  if (params.status) queryParams.append("status", params.status);
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);

  const res = await api.get(
    `${ADMIN_PREFIX}/restrict/all?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 신고 승인 (사용자 제한)
export const approveReport = async (reportId) => {
  const res = await api.patch(`${ADMIN_PREFIX}/restrict/${reportId}`);
  return res.data?.data ?? res.data;
};

// 신고 거절
export const rejectReport = async (reportId, reason) => {
  const res = await api.patch(`${ADMIN_PREFIX}/restrict/${reportId}/reject`, {
    reason: reason,
  });
  return res.data?.data ?? res.data;
};
