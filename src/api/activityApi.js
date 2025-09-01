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

// 활동 리포트 데이터 조회 (차트용)
export const getActivityReport = async (petNo, periodType = "WEEK") => {
  // periodType이 이미 백엔드 형식("DAY", "WEEK", "MONTH", "YEAR")으로 전달됨
  const backendPeriodType = periodType;

  // 기간 계산
  const endDate = new Date().toISOString().split("T")[0];
  let startDate;

  switch (backendPeriodType) {
    case "DAY":
      startDate = endDate;
      break;
    case "WEEK":
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "MONTH":
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    case "YEAR":
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      break;
    default:
      startDate = endDate;
  }

  const params = { petNo, periodType: backendPeriodType, startDate, endDate };

  console.log("getActivityReport API 호출:", {
    url: `${ACTIVITY_PREFIX}/chart`,
    params,
    periodType: backendPeriodType,
  });

  const res = await api.get(`${ACTIVITY_PREFIX}/chart`, { params });
  return res.data?.data ?? res.data;
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
    // 임시로 더미 데이터 반환 (테스트용)
    return [];
  }
};

// 활동량 옵션 목록 조회
export const getActivityLevels = async () => {
  try {
    const res = await api.get(`${ACTIVITY_PREFIX}/activity-levels`);
    return res.data?.data ?? res.data;
  } catch (error) {
    console.error("getActivityLevels 오류:", error);
    // 임시로 기본 활동량 옵션 반환 (테스트용)
    return [
      { value: "LOW", label: "거의 안 움직여요", numericValue: 1.0 },
      { value: "MEDIUM_LOW", label: "가끔 산책해요", numericValue: 1.5 },
      { value: "MEDIUM_HIGH", label: "자주 뛰어놀아요", numericValue: 2.0 },
      { value: "HIGH", label: "매우 활동적이에요", numericValue: 2.5 },
    ];
  }
};
