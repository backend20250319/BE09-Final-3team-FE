import api from "./api";

const MEDICATION_PREFIX = "/health-service/medical/medication";
const CARE_PREFIX = "/health-service/medical/care";

// 복용약/영양제 일정 생성
export const createMedication = async (medicationData) => {
  try {
    // 일부 백엔드 구현에서 petNo를 RequestParam으로 바인딩할 수 있어
    // 안전하게 쿼리 파라미터로도 함께 전달한다.
    const response = await api.post(
      `${MEDICATION_PREFIX}/create`,
      medicationData,
      {
        params: medicationData?.petNo
          ? { petNo: medicationData.petNo }
          : undefined,
      }
    );
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 일정 생성 실패:", error);
    throw error;
  }
};

// 복용약/영양제 일정 목록 조회
export const listMedications = async (params) => {
  try {
    const response = await api.get(`${MEDICATION_PREFIX}/read`, { params });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 일정 목록 조회 실패:", error);
    if (error.response?.status === 404) {
      console.log("투약 데이터가 없습니다. 빈 배열을 반환합니다.");
      return [];
    }
    throw error;
  }
};

// 복용약/영양제 일정 상세 조회
export const getMedicationDetail = async (calNo) => {
  try {
    const response = await api.get(`${MEDICATION_PREFIX}/${calNo}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 일정 상세 조회 실패:", error);
    throw error;
  }
};

// 복용약/영양제 일정 수정 (백엔드에서 알림 시기 변경 시 자동으로 마지막 알림 시기 저장)
export const updateMedication = async (calNo, updateData) => {
  try {
    console.log("투약 일정 수정 API 호출:", {
      calNo,
      updateData,
      url: `${MEDICATION_PREFIX}/update`,
    });

    const response = await api.patch(
      `${MEDICATION_PREFIX}/update`,
      updateData,
      {
        params: { calNo },
      }
    );

    console.log("투약 일정 수정 API 응답:", response.data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 일정 수정 실패:", error);
    console.error("에러 상세:", error.response?.data);
    throw error;
  }
};

// 알림 on/off 토글 (백엔드에서 마지막 알림 시기 자동 복원)
export const toggleAlarm = async (calNo) => {
  try {
    console.log("알림 토글 API 호출:", {
      calNo,
      calNoType: typeof calNo,
      url: `${MEDICATION_PREFIX}/alarm`,
    });

    // calNo가 숫자인지 확인
    if (typeof calNo !== "number" && typeof calNo !== "string") {
      console.error("calNo가 올바른 타입이 아닙니다:", calNo, typeof calNo);
      throw new Error(`Invalid calNo type: ${typeof calNo}, value: ${calNo}`);
    }

    const response = await api.patch(`${MEDICATION_PREFIX}/alarm`, null, {
      params: { calNo: Number(calNo) }, // 명시적으로 숫자로 변환
    });
    console.log("알림 토글 API 응답:", response.data);

    // 백엔드에서 boolean 값 반환 (true/false)
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("알림 토글 실패:", error);
    console.error("에러 상세:", error.response?.data);
    console.error("요청 URL:", error.config?.url);
    console.error("요청 파라미터:", error.config?.params);
    console.error("요청 헤더:", error.config?.headers);
    throw error;
  }
};

// 복용약/영양제 일정 삭제
export const deleteMedication = async (calNo) => {
  try {
    const response = await api.delete(`${MEDICATION_PREFIX}/delete`, {
      params: { calNo },
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 일정 삭제 실패:", error);
    throw error;
  }
};

// 투약 관련 메타 정보 조회 (드롭다운용)
export const getMedicationMeta = async () => {
  try {
    const response = await api.get(`${MEDICATION_PREFIX}/meta`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 메타 정보 조회 실패:", error);
    throw error;
  }
};

// 처방전 OCR 처리 및 일정 자동 등록
export const processPrescription = async (file, petNo) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("petNo", petNo);

    const response = await api.post(`${MEDICATION_PREFIX}/ocr`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("처방전 OCR 처리 실패:", error);
    throw error;
  }
};

// 돌봄 일정 생성
export const createCare = async (careData) => {
  try {
    const response = await api.post(`${CARE_PREFIX}/create`, careData, {
      params: careData?.petNo ? { petNo: careData.petNo } : undefined,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("돌봄 일정 생성 실패:", error);
    throw error;
  }
};

// 접종 일정 생성 (돌봄 API 사용, subType으로 구분) - createCare와 동일한 기능
export const createVaccination = async (vaccinationData) => {
  try {
    const response = await api.post(`${CARE_PREFIX}/create`, vaccinationData, {
      params: vaccinationData?.petNo
        ? { petNo: vaccinationData.petNo }
        : undefined,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("접종 일정 생성 실패:", error);
    throw error;
  }
};

// 돌봄/접종 일정 조회
export const listCareSchedules = async (params) => {
  try {
    const response = await api.get(`${CARE_PREFIX}/read`, {
      params,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("돌봄/접종 일정 조회 실패:", error);
    if (error.response?.status === 404) {
      console.log("돌봄/접종 데이터가 없습니다. 빈 배열을 반환합니다.");
      return [];
    }
    throw error;
  }
};

// 돌봄/접종 일정 수정
export const updateCareSchedule = async (calNo, updateData) => {
  try {
    console.log("돌봄/접종 일정 수정 API 호출:", {
      calNo,
      updateData,
      url: `${CARE_PREFIX}/update`,
    });

    const response = await api.patch(`${CARE_PREFIX}/update`, updateData, {
      params: { calNo },
    });

    console.log("돌봄/접종 일정 수정 API 응답:", response.data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("돌봄/접종 일정 수정 실패:", error);
    console.error("에러 상세:", error.response?.data);
    throw error;
  }
};

// 돌봄/접종 일정 삭제
export const deleteCareSchedule = async (calNo) => {
  try {
    const response = await api.delete(`${CARE_PREFIX}/delete`, {
      params: { calNo },
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("돌봄/접종 일정 삭제 실패:", error);
    throw error;
  }
};

// 돌봄/접종 일정 알림 토글
export const toggleCareAlarm = async (calNo) => {
  try {
    console.log("돌봄/접종 알림 토글 API 호출:", {
      calNo,
      calNoType: typeof calNo,
      url: `${CARE_PREFIX}/alarm`,
    });

    // calNo가 숫자인지 확인
    if (typeof calNo !== "number" && typeof calNo !== "string") {
      console.error("calNo가 올바른 타입이 아닙니다:", calNo, typeof calNo);
      throw new Error(`Invalid calNo type: ${typeof calNo}, value: ${calNo}`);
    }

    const response = await api.patch(`${CARE_PREFIX}/alarm`, null, {
      params: { calNo: Number(calNo) }, // 명시적으로 숫자로 변환
    });
    console.log("돌봄/접종 알림 토글 API 응답:", response.data);

    // 백엔드에서 boolean 값 반환 (true/false)
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("돌봄/접종 알림 토글 실패:", error);
    console.error("에러 상세:", error.response?.data);
    console.error("요청 URL:", error.config?.url);
    console.error("요청 파라미터:", error.config?.params);
    console.error("요청 헤더:", error.config?.headers);
    throw error;
  }
};
