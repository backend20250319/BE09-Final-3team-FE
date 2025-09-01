import api from "./api";

const MEDICATION_PREFIX = "/health-service/medical/medication";

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

// 복용약/영양제 일정 수정
export const updateMedication = async (calNo, updateData) => {
  try {
    const response = await api.patch(
      `${MEDICATION_PREFIX}/update`,
      updateData,
      {
        params: { calNo },
      }
    );
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("투약 일정 수정 실패:", error);
    throw error;
  }
};

// 알림 on/off 토글
export const toggleAlarm = async (calNo) => {
  try {
    const response = await api.patch(`${MEDICATION_PREFIX}/alarm`, null, {
      params: { calNo },
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("알림 토글 실패:", error);
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
