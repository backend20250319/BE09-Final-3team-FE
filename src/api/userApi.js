import api from "./api";

const USER_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USER_PREFIX) ||
  "/user-service";

// 신고 API
export const reportUser = async (payload) => {
  const res = await api.post(`${USER_PREFIX}/auth/reports`, payload);
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
