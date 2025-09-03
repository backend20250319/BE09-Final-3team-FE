"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/AddScheduleModal.module.css";
import {
  medicationTypeOptions,
  medicationFrequencyOptions,
  notificationTimingOptions,
  careSubTypeOptions,
  careFrequencyOptions,
  vaccinationSubTypeOptions,
  vaccinationFrequencyOptions,
  ICON_MAP,
  frequencyMapping,
  COLOR_MAP,
  SUBTYPE_LABEL_MAP,
} from "../../constants";

export default function EditScheduleModal({
  isOpen,
  onClose,
  onEdit,
  scheduleData,
  type,
}) {
  const [formData, setFormData] = useState({
    name: "",
    subType: "",
    frequency: "",
    date: "", // 시작날짜로 사용 (호환성 유지)
    startDate: "", // 시작날짜
    endDate: "", // 종료날짜
    time: "", // 호환성을 위해 유지
    scheduleTime: "", // 일정 시간
    duration: "", // 투약용
    notificationTiming: "", // 알림 시기 (모든 타입용)
    lastReminderDaysBefore: null, // 마지막 알림 시기
  });

  const [errors, setErrors] = useState({});
  const [isPrescription, setIsPrescription] = useState(false);

  // 복용 빈도에 따른 기본 시간 설정
  const getDefaultTimes = (frequency) => {
    switch (frequency) {
      case "DAILY_ONCE":
        return ["09:00"];
      case "DAILY_TWICE":
        return ["08:00", "20:00"];
      case "DAILY_THREE_TIMES":
        return ["08:00", "12:00", "20:00"];
      default:
        return ["09:00"];
    }
  };

  // 복용 빈도에 따른 시간 입력 칸 개수
  const getTimeInputCount = (frequency) => {
    switch (frequency) {
      case "DAILY_ONCE":
        return 1;
      case "DAILY_TWICE":
        return 2;
      case "DAILY_THREE_TIMES":
        return 3;
      default:
        return 1;
    }
  };

  // 시간 옵션 생성 (30분 간격)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = `${hour < 12 ? "오전" : "오후"} ${
          hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        }:${minute.toString().padStart(2, "0")}`;
        options.push({ value: timeString, label: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // 시간 선택을 위한 커스텀 드롭다운
  const TimePicker = ({ value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const listRef = React.useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (isOpen && !event.target.closest(`.${styles.timePickerContainer}`)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // 드롭다운이 열릴 때 선택된 시간 위치로 스크롤
    React.useEffect(() => {
      if (isOpen && value && listRef.current) {
        const selectedIndex = timeOptions.findIndex((time) => time === value);
        if (selectedIndex !== -1) {
          const itemHeight = 48; // 각 시간 항목의 높이 (padding 포함)
          const containerHeight = 200; // 드롭다운 컨테이너 높이
          const scrollTop = Math.max(
            0,
            selectedIndex * itemHeight - containerHeight / 2
          );
          listRef.current.scrollTop = scrollTop;
        }
      }
    }, [isOpen, value]);

    const handleTimeSelect = (timeString) => {
      onChange(timeString);
      setIsOpen(false);
    };

    const formatTime = (timeString) => {
      if (!timeString) return "";
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour < 12 ? "오전" : "오후";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${ampm} ${displayHour}:${minutes}`;
    };

    // 30분 간격 시간 옵션 생성
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        timeOptions.push(timeString);
      }
    }

    return (
      <div className={styles.timePickerContainer}>
        <div
          className={styles.timePickerInput}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? styles.timeValue : styles.timePlaceholder}>
            {value ? formatTime(value) : placeholder}
          </span>
          <div className={styles.timePickerIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" />
              <polyline
                points="12,6 12,12 16,14"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        {isOpen && (
          <div className={styles.timePickerDropdown}>
            <div className={styles.timePickerList} ref={listRef}>
              {timeOptions.map((time) => (
                <div
                  key={time}
                  className={`${styles.timePickerItem} ${
                    value === time ? styles.timePickerItemSelected : ""
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {formatTime(time)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (scheduleData) {
      console.log("EditScheduleModal - scheduleData:", scheduleData);
      console.log("EditScheduleModal - 알림 관련 필드:", {
        reminderDaysBefore: scheduleData.reminderDaysBefore,
        lastReminderDaysBefore: scheduleData.lastReminderDaysBefore,
        // notificationTiming은 표시용 문자열이므로 사용하지 않음
        note: "notificationTiming은 표시용 문자열이므로 사용하지 않음",
      });
      // frequency 값을 영어 enum 값으로 변환
      // scheduleData.frequency가 한글이면 영어로, 이미 영어면 그대로 사용
      const frequency = (() => {
        // 이미 영어 enum 값인 경우
        if (
          [
            "DAILY_ONCE",
            "DAILY_TWICE",
            "DAILY_THREE_TIMES",
            "WEEKLY_ONCE",
            "MONTHLY_ONCE",
          ].includes(scheduleData.frequency)
        ) {
          return scheduleData.frequency;
        }
        // 한글 값인 경우 영어로 변환
        return (
          frequencyMapping[scheduleData.frequency] ||
          scheduleData.frequency ||
          ""
        );
      })();
      const defaultTimes = getDefaultTimes(frequency);

      setFormData({
        name: scheduleData.name || "",
        subType: scheduleData.subType || scheduleData.type || "",
        frequency: frequency,
        date: scheduleData.date || scheduleData.startDate || "", // 호환성
        startDate: scheduleData.startDate || scheduleData.date || "",
        endDate: scheduleData.endDate || scheduleData.date || "",
        time: scheduleData.time || scheduleData.scheduleTime || "", // 호환성
        scheduleTime:
          scheduleData.scheduleTime ||
          scheduleData.time ||
          defaultTimes.join(", "),
        duration: scheduleData.duration || "",
        notificationTiming:
          scheduleData.reminderDaysBefore !== null
            ? scheduleData.reminderDaysBefore
            : scheduleData.lastReminderDaysBefore !== null
            ? scheduleData.lastReminderDaysBefore
            : 0,
        lastReminderDaysBefore: scheduleData.lastReminderDaysBefore,
      });

      console.log("EditScheduleModal - 알림 시기 디버깅:", {
        reminderDaysBefore: scheduleData.reminderDaysBefore,
        lastReminderDaysBefore: scheduleData.lastReminderDaysBefore,
        finalNotificationTiming:
          scheduleData.reminderDaysBefore !== null
            ? scheduleData.reminderDaysBefore
            : scheduleData.lastReminderDaysBefore !== null
            ? scheduleData.lastReminderDaysBefore
            : 0,
      });

      // 처방전 여부 설정
      setIsPrescription(scheduleData.isPrescription || false);
    }
  }, [scheduleData]);

  const handleInputChange = (field, value) => {
    // 처방전인 경우 알림 시기 변경 제한
    if (field === "notificationTiming" && isPrescription) {
      return; // 처방전 약은 알림 시기 변경 불가
    }

    // 복용 빈도가 변경되면 기본 시간도 함께 설정
    if (field === "frequency") {
      const defaultTimes = getDefaultTimes(value);
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        scheduleTime: defaultTimes.join(", "),
      }));
    } else {
      // 다른 필드는 일반적으로 업데이트
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "일정 이름을 입력해주세요";
    }

    if (!formData.subType) {
      newErrors.subType = "유형을 선택해주세요";
    }

    if (!formData.frequency) {
      newErrors.frequency = "빈도를 선택해주세요";
    }

    // 시작날짜 검증
    if (!formData.startDate && !formData.date) {
      newErrors.startDate = "시작 날짜를 선택해주세요";
    }

    // 종료날짜 검증
    if (!formData.endDate) {
      newErrors.endDate = "종료 날짜를 선택해주세요";
    }

    // 일정 시간 검증
    if (!formData.scheduleTime && !formData.time) {
      newErrors.scheduleTime = "일정 시간을 입력해주세요";
    }

    // 알림 시기 검증 (처방전이 아닌 경우에만)
    if (!isPrescription && !formData.notificationTiming) {
      newErrors.notificationTiming = "알림 시기를 선택해주세요";
    }

    // 투약의 경우 복용 기간도 필수
    if (type === "medication" && !formData.duration) {
      newErrors.duration = "복용 기간을 입력해주세요";
    } else if (
      type === "medication" &&
      (isNaN(formData.duration) || Number(formData.duration) <= 0)
    ) {
      newErrors.duration = "유효한 복용 기간(숫자)을 입력해주세요";
    }

    // 투약의 경우 알림 시간도 필수
    if (type === "medication" && !formData.scheduleTime) {
      newErrors.scheduleTime = "일정 시간을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getIconForSubType = (subType) => {
    return ICON_MAP[subType] || ICON_MAP["기타"];
  };

  const getColorForType = (mainType) => {
    return COLOR_MAP[mainType] || "#F5F5F5";
  };

  const handleSubmit = () => {
    if (validateForm()) {
      let updatedSchedule;

      if (type === "medication") {
        // 투약 수정
        const startDateObj = new Date(formData.date || scheduleData.startDate);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(
          startDateObj.getDate() + Number(formData.duration) - 1
        );
        const endDate = endDateObj.toISOString().split("T")[0];

        updatedSchedule = {
          ...scheduleData,
          name: formData.name,
          type: formData.subType,
          frequency: formData.frequency,
          duration: Number(formData.duration),
          startDate: formData.date || scheduleData.startDate,
          endDate: endDate,
          scheduleTime: formData.scheduleTime,
          notificationTiming: formData.notificationTiming,
          reminderDaysBefore: Number(formData.notificationTiming), // 백엔드로 전송할 숫자 값
          icon: getIconForSubType(formData.subType),
          color: getColorForType(formData.subType),
        };
      } else {
        // 돌봄/접종 일정 수정
        const mainType = type === "care" ? "돌봄" : "접종";

        updatedSchedule = {
          ...scheduleData,
          name: formData.name,
          type: mainType,
          subType: formData.subType,
          frequency: formData.frequency,
          startDate: formData.startDate || formData.date,
          endDate: formData.endDate,
          date: formData.startDate || formData.date, // 호환성 유지
          scheduleTime: formData.scheduleTime || formData.time,
          time: formData.scheduleTime || formData.time, // 호환성 유지

          notificationTiming: formData.notificationTiming,
          reminderDaysBefore: Number(formData.notificationTiming), // 백엔드로 전송할 숫자 값
          icon: getIconForSubType(formData.subType),
          color: getColorForType(mainType),
        };
      }

      console.log("EditScheduleModal - updatedSchedule:", updatedSchedule);
      onEdit(updatedSchedule);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      subType: "",
      frequency: "",
      date: "",
      startDate: "",
      endDate: "",
      time: "",
      scheduleTime: "",
      duration: "",

      notificationTiming: "",
      lastReminderDaysBefore: null,
    });
    setErrors({});
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case "medication":
        return "투약 수정";
      case "care":
        return "돌봄 수정";
      case "vaccination":
        return "접종 수정";
      default:
        return "일정 수정";
    }
  };

  const getIconSrc = () => {
    switch (type) {
      case "medication":
        return "/health/pill.png";
      case "vaccination":
        return "/health/syringe.png";
      case "care":
        return "/health/pets.png";
      default:
        return "/health/pets.png";
    }
  };

  const getSubTitle = () => {
    switch (type) {
      case "medication":
        return "투약 정보를 수정하세요";
      case "care":
        return "돌봄을 수정하세요";
      case "vaccination":
        return "접종 일정을 수정하세요";
      default:
        return "일정을 수정하세요";
    }
  };

  const getSubTypeOptions = () => {
    switch (type) {
      case "medication":
        return medicationTypeOptions;
      case "care":
        return careSubTypeOptions;
      case "vaccination":
        return vaccinationSubTypeOptions;
      default:
        return [];
    }
  };

  const getFrequencyOptions = () => {
    switch (type) {
      case "medication":
        return medicationFrequencyOptions;
      case "care":
        return careFrequencyOptions;
      case "vaccination":
        return vaccinationFrequencyOptions;
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <img
                src={getIconSrc()}
                alt={`${getTitle()} 아이콘`}
                width={20}
                height={20}
              />
            </div>
            <div className={styles.headerText}>
              <h3>{getTitle()}</h3>
              <p>{getSubTitle()}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <div className={styles.form}>
          {/* 일정 이름 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>
                {type === "medication" ? "약 이름" : "일정 이름"}
              </label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                placeholder={
                  type === "medication"
                    ? "약물 이름을 입력하세요"
                    : "일정 이름을 입력하세요"
                }
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          {/* 유형 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>유형</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={formData.subType}
                onChange={(e) => handleInputChange("subType", e.target.value)}
              >
                <option value="">유형을 선택하세요</option>
                {getSubTypeOptions().map((option) => (
                  <option key={option} value={option}>
                    {SUBTYPE_LABEL_MAP[option] || option}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.subType && (
              <span className={styles.error}>{errors.subType}</span>
            )}
          </div>

          {/* 빈도 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>
                {type === "medication" ? "복용" : ""} 빈도
              </label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
              >
                <option value="">빈도를 선택하세요</option>
                {getFrequencyOptions().map((option) => (
                  <option
                    key={option.value || option}
                    value={option.value || option}
                  >
                    {option.label || option}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.frequency && (
              <span className={styles.error}>{errors.frequency}</span>
            )}
          </div>

          {/* 투약의 경우 복용 기간 */}
          {type === "medication" && (
            <div className={styles.formGroup}>
              <div className={styles.labelContainer}>
                <label className={styles.label}>복용 기간(일)</label>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="예: 7"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                />
              </div>
              {errors.duration && (
                <span className={styles.error}>{errors.duration}</span>
              )}
            </div>
          )}

          {/* 투약의 경우 일정 시간 */}
          {type === "medication" && (
            <div className={styles.formGroup}>
              <div className={styles.labelContainer}>
                <label className={styles.label}>일정 시간</label>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.timeInputsContainer}>
                {formData.frequency ? (
                  <div className={styles.timeInputsRow}>
                    {Array.from(
                      { length: getTimeInputCount(formData.frequency) },
                      (_, index) => (
                        <div key={index} className={styles.timeInputGroup}>
                          <label className={styles.timeLabel}>
                            {formData.frequency === "DAILY_TWICE"
                              ? index === 0
                                ? "아침"
                                : "저녁"
                              : formData.frequency === "DAILY_THREE_TIMES"
                              ? index === 0
                                ? "아침"
                                : index === 1
                                ? "점심"
                                : "저녁"
                              : "시간"}
                          </label>
                          <TimePicker
                            value={
                              (formData.scheduleTime &&
                                formData.scheduleTime
                                  .split(",")
                                  [index]?.trim()) ||
                              ""
                            }
                            onChange={(time) => {
                              const times = (formData.scheduleTime || "")
                                .split(",")
                                .map((t) => t.trim());
                              times[index] = time;
                              handleInputChange(
                                "scheduleTime",
                                times.join(", ")
                              );
                            }}
                            placeholder="시간을 선택하세요"
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className={styles.noFrequencyMessage}>
                    복용 빈도를 먼저 선택해주세요
                  </div>
                )}
              </div>
              {errors.scheduleTime && (
                <span className={styles.error}>{errors.scheduleTime}</span>
              )}
            </div>
          )}

          {/* 시작 날짜 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>시작 날짜</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="date"
                className={styles.input}
                value={formData.startDate || formData.date}
                onChange={(e) => {
                  handleInputChange("startDate", e.target.value);
                  handleInputChange("date", e.target.value); // 호환성 유지
                }}
              />
            </div>
            {errors.startDate && (
              <span className={styles.error}>{errors.startDate}</span>
            )}
          </div>

          {/* 종료 날짜 (돌봄/접종 일정에서만 표시) */}
          {type !== "medication" && (
            <div className={styles.formGroup}>
              <div className={styles.labelContainer}>
                <label className={styles.label}>종료 날짜</label>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
              {errors.endDate && (
                <span className={styles.error}>{errors.endDate}</span>
              )}
            </div>
          )}

          {/* 알림 시기 (모든 타입) */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>알림 시기</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={`${styles.select} ${
                  isPrescription ? styles.disabled : ""
                }`}
                value={formData.notificationTiming}
                onChange={(e) =>
                  handleInputChange("notificationTiming", e.target.value)
                }
                disabled={isPrescription}
              >
                <option value="">알림 시기를 선택하세요</option>
                {notificationTimingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {isPrescription && (
              <span className={styles.prescriptionMessage}>
                처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다.
              </span>
            )}
            {!isPrescription &&
              formData.lastReminderDaysBefore !== undefined &&
              formData.notificationTiming === null && (
                <span className={styles.prescriptionMessage}>
                  현재 알림이 비활성화되어 있습니다. (마지막 설정:{" "}
                  {formData.lastReminderDaysBefore}일전)
                </span>
              )}
            {errors.notificationTiming && (
              <span className={styles.error}>{errors.notificationTiming}</span>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={handleClose}>
            취소
          </button>
          <button className={styles.submitButton} onClick={handleSubmit}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1V11M1 6H11"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
