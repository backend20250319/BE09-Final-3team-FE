// ========================================
// 의료 관련 라벨과 텍스트 상수
// ========================================

// 공통 라벨
export const COMMON_LABELS = {
  ADD: "추가",
  EDIT: "수정",
  DELETE: "삭제",
  CANCEL: "취소",
  CONFIRM: "확인",
  SAVE: "저장",
  CLOSE: "닫기",
  ALL: "전체",
  SELECT: "선택",
  REQUIRED: "*",
  OPTIONAL: "(선택)",
};

// 투약 관련 라벨
export const MEDICATION_LABELS = {
  TITLE: "투약",
  ADD_TITLE: "투약 추가",
  EDIT_TITLE: "투약 수정",
  MEDICATION_NAME: "약 이름",
  MEDICATION_TYPE: "유형",
  FREQUENCY: "복용 빈도",
  DURATION: "복용 기간(일)",
  SCHEDULE_TIME: "일정 시간",
  START_DATE: "시작 날짜",
  END_DATE: "종료 날짜",
  NOTIFICATION_TIMING: "알림 시기",
  PRESCRIPTION: "처방전",
  PILL: "복용약",
  SUPPLEMENT: "영양제",
  MORNING: "아침",
  LUNCH: "점심",
  EVENING: "저녁",
  TIME: "시간",
  DAYS: "일",
  PRESCRIPTION_BADGE: "처방전",
  PRESCRIPTION_UPLOAD: "처방전 사진",
  PRESCRIPTION_UPLOAD_DESC: "받으신 처방전 이미지를 업로드 해주세요!",
  FILE_UPLOAD: "파일 업로드",
  NO_MEDICATIONS: "등록된 투약 일정이 없습니다.",
  NO_MEDICATIONS_DESC: "새로운 투약 일정을 추가해보세요!",
  LOADING_MEDICATIONS: "투약 데이터를 불러오는 중...",
};

// 돌봄 관련 라벨
export const CARE_LABELS = {
  TITLE: "돌봄",
  ADD_TITLE: "돌봄 추가",
  EDIT_TITLE: "돌봄 수정",
  SCHEDULE_NAME: "일정 이름",
  SCHEDULE_TYPE: "유형",
  FREQUENCY: "빈도",
  SCHEDULE_TIME: "일정 시간",
  START_DATE: "시작 날짜",
  END_DATE: "종료 날짜 (선택)",
  NOTIFICATION_TIMING: "알림 시기",
  WALK: "산책",
  BIRTHDAY: "생일",
  GROOMING: "미용",
  ETC: "기타",
  NO_SCHEDULES: "등록된 일정이 없습니다.",
  NO_SCHEDULES_DESC: "새로운 돌봄 일정을 추가해보세요!",
};

// 접종 관련 라벨
export const VACCINATION_LABELS = {
  TITLE: "접종",
  ADD_TITLE: "접종 추가",
  EDIT_TITLE: "접종 수정",
  SCHEDULE_NAME: "일정 이름",
  SCHEDULE_TYPE: "유형",
  FREQUENCY: "빈도",
  SCHEDULE_TIME: "일정 시간",
  START_DATE: "시작 날짜",
  END_DATE: "종료 날짜 (선택)",
  NOTIFICATION_TIMING: "알림 시기",
  VACCINE: "예방접종",
  CHECKUP: "건강검진",
  NO_SCHEDULES: "등록된 일정이 없습니다.",
  NO_SCHEDULES_DESC: "새로운 접종 일정을 추가해보세요!",
};

// 공통 메시지
export const COMMON_MESSAGES = {
  SELECT_PET: "반려동물을 선택해주세요",
  SELECT_PET_DESC: "투약 일정을 관리하려면 먼저 반려동물을 선택해주세요!",
  DELETE_CONFIRM: "일정을 삭제하시겠습니까?",
  LOADING: "데이터를 불러오는 중...",
  SUCCESS: "성공적으로 처리되었습니다.",
  ERROR: "오류가 발생했습니다.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  VALIDATION_ERROR: "입력 정보를 확인해주세요.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "권한이 없습니다.",
  NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
};

// 투약 관련 메시지
export const MEDICATION_MESSAGES = {
  ADD_SUCCESS: "이(가) 추가되었습니다.",
  EDIT_SUCCESS: "이(가) 수정되었습니다.",
  DELETE_SUCCESS: "이(가) 삭제되었습니다.",
  ADD_ERROR: "투약 추가에 실패했습니다.",
  EDIT_ERROR: "투약 수정에 실패했습니다.",
  DELETE_ERROR: "투약 삭제에 실패했습니다.",
  LOAD_ERROR: "투약 데이터를 가져오는데 실패했습니다.",
  PRESCRIPTION_EDIT_RESTRICTION: "처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다.",
  PRESCRIPTION_NOTIFICATION_RESTRICTION: "처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다.",
  NOTIFICATION_TOGGLE_SUCCESS: "일정 알림이 활성화 되었습니다.",
  NOTIFICATION_TOGGLE_INACTIVE: "일정 알림이 비활성화 되었습니다.",
  NOTIFICATION_TOGGLE_ERROR: "알림 설정 변경에 실패했습니다.",
  OCR_SUCCESS: "처방전이 성공적으로 처리되었습니다.",
  OCR_ERROR: "처방전 처리에 실패했습니다.",
  OCR_NO_MEDICATION: "처방전에서 약물 정보를 찾을 수 없습니다.",
  OCR_FILE_TOO_LARGE: "파일 크기가 너무 큽니다.",
  OCR_INVALID_FORMAT: "지원하지 않는 파일 형식입니다.",
  OCR_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
};

// 돌봄 관련 메시지
export const CARE_MESSAGES = {
  ADD_SUCCESS: "개의 일정이 추가되었습니다.",
  EDIT_SUCCESS: "일정이 수정되었습니다.",
  DELETE_SUCCESS: "일정이 삭제되었습니다.",
  ADD_ERROR: "일정 생성에 실패했습니다.",
  EDIT_ERROR: "일정 수정에 실패했습니다.",
  DELETE_ERROR: "일정 삭제에 실패했습니다.",
  NOTIFICATION_TOGGLE_SUCCESS: "알림이 활성화 되었습니다.",
  NOTIFICATION_TOGGLE_INACTIVE: "알림이 비활성화 되었습니다.",
  NOTIFICATION_TOGGLE_ERROR: "알림 설정 변경에 실패했습니다.",
};

// 접종 관련 메시지
export const VACCINATION_MESSAGES = {
  ADD_SUCCESS: "개의 일정이 추가되었습니다.",
  EDIT_SUCCESS: "일정이 수정되었습니다.",
  DELETE_SUCCESS: "일정이 삭제되었습니다.",
  ADD_ERROR: "일정 생성에 실패했습니다.",
  EDIT_ERROR: "일정 수정에 실패했습니다.",
  DELETE_ERROR: "일정 삭제에 실패했습니다.",
  NOTIFICATION_TOGGLE_SUCCESS: "알림이 활성화 되었습니다.",
  NOTIFICATION_TOGGLE_INACTIVE: "알림이 비활성화 되었습니다.",
  NOTIFICATION_TOGGLE_ERROR: "알림 설정 변경에 실패했습니다.",
};

// 폼 검증 메시지
export const VALIDATION_MESSAGES = {
  REQUIRED: "을(를) 입력해주세요",
  SELECT_REQUIRED: "을(를) 선택해주세요",
  INVALID_DATE: "유효한 날짜를 선택해주세요",
  INVALID_TIME: "유효한 시간을 선택해주세요",
  INVALID_NUMBER: "유효한 숫자를 입력해주세요",
  INVALID_EMAIL: "유효한 이메일을 입력해주세요",
  INVALID_PHONE: "유효한 전화번호를 입력해주세요",
  MIN_LENGTH: "최소 {min}자 이상 입력해주세요",
  MAX_LENGTH: "최대 {max}자까지 입력 가능합니다",
  MIN_VALUE: "최소 {min} 이상의 값을 입력해주세요",
  MAX_VALUE: "최대 {max} 이하의 값을 입력해주세요",
  START_DATE_PAST: "시작날짜는 당일보다 이전일 수 없습니다.",
  END_DATE_BEFORE_START: "종료날짜는 시작날짜보다 이전일 수 없습니다.",
  DURATION_INVALID: "복용 기간을 설정하면 종료일이 오늘 이전이 됩니다.",
  FREQUENCY_REQUIRED: "복용 빈도를 먼저 선택해주세요",
};

// 빈도별 힌트 메시지
export const FREQUENCY_HINTS = {
  DAILY: "종료일을 입력하지 않으면 시작일과 동일하게 설정됩니다.",
  WEEKLY: "선택해주신 요일 기준으로 매주 반복됩니다. 종료날짜는 해당 요일만 선택할 수 있습니다.",
  MONTHLY: "선택해주신 날짜 기준으로 매월 반복됩니다. 종료날짜는 해당 날짜만 선택할 수 있습니다.",
  SINGLE_DAY: "당일 일정은 시작날짜에 따라 종료일자가 고정됩니다.",
  FIXED_END_DATE: "일정은 시작날짜에 따라 종료일자가 고정됩니다.",
};

// 알림 관련 메시지
export const NOTIFICATION_MESSAGES = {
  CURRENT_DISABLED: "현재 알림이 비활성화되어 있습니다.",
  LAST_SETTING: "마지막 설정: {days}일전",
  TODAY: "당일 알림",
  DAYS_BEFORE: "{days}일 전 알림",
  ALARM_ACTIVE: "알림 활성화",
  ALARM_INACTIVE: "알림 비활성화",
  PRESCRIPTION_RESTRICTION: "처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다.",
};
