import api from "./api";

const ADVERTISER_PREFIX =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ADVERTISER_PREFIX) ||
  "/advertiser-service";

// Admin API
const ADMIN_PREFIX = `${ADVERTISER_PREFIX}/admin`;

// 광고주 신청 목록 조회 (관리자용)
export const getAdvertiserApplications = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.size) queryParams.append("size", params.size);
  if (params.sort) queryParams.append("sort", params.sort);

  const res = await api.get(
    `${ADMIN_PREFIX}/advertiser/all?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 광고주 승인 (관리자용)
export const approveAdvertiser = async (advertiserId) => {
  const res = await api.patch(
    `${ADMIN_PREFIX}/advertiser/${advertiserId}/approve`
  );
  return res.data?.data ?? res.data;
};

// 광고주 거절 (관리자용)
export const rejectAdvertiser = async (advertiserId, reason) => {
  const res = await api.patch(
    `${ADMIN_PREFIX}/advertiser/${advertiserId}/reject`,
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
    `${ADMIN_PREFIX}/advertiser/${advertiserId}/restrict`
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
    `${ADMIN_PREFIX}/ad/trial?${queryParams.toString()}`
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
    `${ADMIN_PREFIX}/ad/pending?${queryParams.toString()}`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 승인 (관리자용)
export const approveCampaign = async (adId) => {
  const res = await api.patch(`${ADMIN_PREFIX}/ad/${adId}/approve`);
  return res.data?.data ?? res.data;
};

// 캠페인 거절 (관리자용)
export const rejectCampaign = async (adId, reason) => {
  const res = await api.patch(
    `${ADMIN_PREFIX}/ad/${adId}/reject?reason=${encodeURIComponent(reason)}`
  );
  return res.data?.data ?? res.data;
};

// 캠페인 삭제 (관리자용)
export const deleteCampaign = async (adId) => {
  const res = await api.patch(`${ADMIN_PREFIX}/ad/${adId}/delete`);
  return res.data?.data ?? res.data;
};
