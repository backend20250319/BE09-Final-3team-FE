"use client";

import React, { useState, useEffect } from "react";
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
  COLOR_MAP,
} from "../../data/mockData";

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
    notificationTime: "", // 알림 시간 (모든 타입용)
    notificationTiming: "", // 알림 시기 (모든 타입용)
  });

  const [errors, setErrors] = useState({});

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (scheduleData) {
      setFormData({
        name: scheduleData.name || "",
        subType: scheduleData.subType || scheduleData.type || "",
        frequency: scheduleData.frequency || "",
        date: scheduleData.date || scheduleData.startDate || "", // 호환성
        startDate: scheduleData.startDate || scheduleData.date || "",
        endDate: scheduleData.endDate || scheduleData.date || "",
        time: scheduleData.time || scheduleData.scheduleTime || "", // 호환성
        scheduleTime: scheduleData.scheduleTime || scheduleData.time || "",
        duration: scheduleData.duration || "",
        notificationTime:
          scheduleData.notificationTime || scheduleData.scheduleTime || "",
        notificationTiming: scheduleData.notificationTiming || "",
      });
    }
  }, [scheduleData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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

    // 알림 시기 검증 (모든 타입)
    if (!formData.notificationTiming) {
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
    if (type === "medication" && !formData.notificationTime) {
      newErrors.notificationTime = "일정 시간을 입력해주세요";
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
          notificationTime: formData.notificationTime,
          notificationTiming: formData.notificationTiming,
          scheduleTime: formData.notificationTime,
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
          notificationTime: formData.scheduleTime || formData.time,
          notificationTiming: formData.notificationTiming,
          icon: getIconForSubType(formData.subType),
          color: getColorForType(mainType),
        };
      }

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
      notificationTime: "",
      notificationTiming: "",
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
                    {option}
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
                  <option key={option} value={option}>
                    {option}
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
              <div className={styles.inputContainer}>
                <input
                  type="time"
                  className={styles.input}
                  value={formData.notificationTime}
                  onChange={(e) =>
                    handleInputChange("notificationTime", e.target.value)
                  }
                />
              </div>
              {errors.notificationTime && (
                <span className={styles.error}>{errors.notificationTime}</span>
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

          {/* 종료 날짜 */}
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

          {/* 일정 시간 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>일정 시간</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="time"
                className={styles.input}
                value={formData.scheduleTime || formData.time}
                onChange={(e) => {
                  handleInputChange("scheduleTime", e.target.value);
                  handleInputChange("time", e.target.value); // 호환성 유지
                }}
              />
            </div>
            {errors.scheduleTime && (
              <span className={styles.error}>{errors.scheduleTime}</span>
            )}
          </div>

          {/* 알림 시기 (모든 타입) */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>알림 시기</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={formData.notificationTiming}
                onChange={(e) =>
                  handleInputChange("notificationTiming", e.target.value)
                }
              >
                <option value="">알림 시기를 선택하세요</option>
                {notificationTimingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
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
