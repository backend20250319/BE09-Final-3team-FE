import api from "./api";

const PET_PREFIX =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_PET_PREFIX) ||
  "/pet-service";

// Admin API
const ADMIN_PREFIX = `${PET_PREFIX}/admin/pet`;

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
export const rejectPetStar = async (petNo) => {
  const res = await api.patch(`${ADMIN_PREFIX}/${petNo}/reject`);
  return res.data?.data ?? res.data;
};
