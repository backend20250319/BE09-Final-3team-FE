import api from "./api";

const ACTIVITY_PREFIX = "/health-service/activity";

// 활동 데이터 저장
export const saveActivityData = async (payload) => {
  const res = await api.post(`${ACTIVITY_PREFIX}/create`, payload);
  return res.data?.data ?? res.data;
};

// 활동 데이터 조회 (특정 날짜)
export const getActivityData = async (date, petNo) => {
  const params = { petNo, activityDate: date };
  console.log("getActivityData API 호출:", {
    url: `${ACTIVITY_PREFIX}/read`,
    params,
  });
  const res = await api.get(`${ACTIVITY_PREFIX}/read`, { params });
  console.log("getActivityData API 응답:", res.data);
  return res.data?.data ?? res.data;
};

// 활동 데이터 조회 (기간별) - 스케줄용
export const getActivityDataByPeriod = async (startDate, endDate, petNo) => {
  // startDate에서 year, month 추출
  const startDateObj = new Date(startDate);
  const year = startDateObj.getFullYear();
  const month = startDateObj.getMonth() + 1; // 0부터 시작하므로 +1

  console.log("API에서 계산된 month:", {
    startDate,
    startDateObj: startDateObj.toISOString(),
    startDateObjDate: startDateObj.toDateString(),
    year,
    month,
    monthName: `${month}월`,
  });

  const params = { petNo, year, month };
  console.log("백엔드 요청 파라미터:", {
    url: `${ACTIVITY_PREFIX}/schedule`,
    params,
    startDate,
    endDate,
  });

  const res = await api.get(`${ACTIVITY_PREFIX}/schedule`, { params });
  console.log("백엔드 응답:", res.data);
  return res.data?.data ?? res.data;
};

// 활동 리포트 데이터 조회 (차트용) - 단순화된 API
export const getActivityReport = async (
  petNo,
  startDate = null,
  endDate = null
) => {
  // 파라미터 없이 호출하면 당일 데이터 자동 조회 (한국 시간대 기준)
  if (!startDate || !endDate) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;
    startDate = todayString;
    endDate = todayString;
  }

  // 날짜 범위 검증
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const daysDiff =
    Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

  // 7일 제한 체크 (서버에서도 체크하지만 클라이언트에서도 미리 체크)
  if (daysDiff > 7) {
    throw new Error("최대 7일까지 조회 가능합니다.");
  }

  // 시작일이 종료일보다 늦으면 오류
  if (startDateObj > endDateObj) {
    throw new Error("시작일은 종료일보다 이전이어야 합니다.");
  }

  const params = { petNo, startDate, endDate };
  const res = await api.get(`${ACTIVITY_PREFIX}/chart`, { params });

  // 에러 응답 처리
  if (res.data?.success === false) {
    const errorCode = res.data?.code;
    const errorMessage = res.data?.message;

    if (errorCode === "1004") {
      throw new Error(errorMessage || "잘못된 날짜 범위입니다.");
    } else if (errorCode === "9000") {
      throw new Error("서버 내부 오류가 발생했습니다.");
    } else {
      throw new Error(errorMessage || "알 수 없는 오류가 발생했습니다.");
    }
  }

  // 성공 응답에서 데이터 추출
  return res.data?.data;
};

// 활동 데이터 수정
export const updateActivityData = async (activityNo, payload) => {
  try {
    const res = await api.patch(
      `${ACTIVITY_PREFIX}/update/${activityNo}`,
      payload
    );
    console.log("updateActivityData 응답:", res);

    // 응답 구조 확인
    if (res.data && res.data.success !== false) {
      return res.data;
    } else {
      throw new Error(res.data?.message || "활동 데이터 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error("updateActivityData 에러:", error);
    throw error;
  }
};

// 활동 데이터 삭제
export const deleteActivityData = async (id) => {
  const res = await api.delete(`${ACTIVITY_PREFIX}/${id}`);
  return res.data;
};

// 펫별 활동 통계 조회
export const getPetActivityStats = async (petNo) => {
  try {
    const res = await api.get(`${ACTIVITY_PREFIX}/pets`);
    return res.data?.data ?? res.data;
  } catch (error) {
    console.error("getPetActivityStats 오류:", error);
    throw error;
  }
};

// 활동량 옵션 목록 조회
export const getActivityLevels = async () => {
  try {
    const res = await api.get(`${ACTIVITY_PREFIX}/activity-levels`);
    return res.data?.data ?? res.data;
  } catch (error) {
    console.error("getActivityLevels 오류:", error);
    throw error;
  }
};
