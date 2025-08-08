"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/AddScheduleModal.module.css";

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
    date: "",
    time: "",
    duration: "", // 투약용
  });

  const [errors, setErrors] = useState({});

  // 투약용 옵션들
  const medicationTypeOptions = ["복용약", "영양제"];
  const medicationFrequencyOptions = [
    "하루에 한 번",
    "하루에 두 번",
    "하루에 세 번",
    "주에 한 번",
    "월에 한 번",
  ];

  // 돌봄 일정용 옵션들
  const careSubTypeOptions = ["산책", "미용", "생일"];
  const careFrequencyOptions = [
    "매일",
    "매주",
    "매월",
    "연 1회",
    "반년 1회",
    "월 1회",
    "주 1회",
    "기타",
  ];

  // 접종 일정용 옵션들
  const vaccinationSubTypeOptions = ["종합백신", "광견병백신", "건강검진"];
  const vaccinationFrequencyOptions = [
    "연 1회",
    "반년 1회",
    "월 1회",
    "주 1회",
    "기타",
  ];

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (scheduleData) {
      setFormData({
        name: scheduleData.name || "",
        subType: scheduleData.subType || scheduleData.type || "",
        frequency: scheduleData.frequency || "",
        date: scheduleData.date || scheduleData.startDate || "",
        time: scheduleData.time || "",
        duration: scheduleData.duration || "",
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

    if (!formData.date) {
      newErrors.date = "날짜를 선택해주세요";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getIconForSubType = (subType) => {
    const iconMap = {
      // 돌봄
      산책: "🐕",
      미용: "✂️",
      생일: "🎂",
      // 접종
      종합백신: "💉",
      광견병백신: "💉",
      건강검진: "🏥",
      // 투약
      복용약: "💊",
      영양제: "💊",
      기타: "📅",
    };
    return iconMap[subType] || iconMap["기타"];
  };

  const getColorForType = (mainType) => {
    const colorMap = {
      돌봄: "#E8F5E8",
      접종: "#E3F2FD",
      복용약: "#E3F2FD",
      영양제: "#FFF3E0",
    };
    return colorMap[mainType] || "#F5F5F5";
  };

  const handleSubmit = () => {
    if (validateForm()) {
      let updatedSchedule;

      if (type === "medication") {
        // 투약 수정
        const today = new Date();
        const startDate = today.toISOString().split("T")[0];
        const endDateObj = new Date(today);
        endDateObj.setDate(today.getDate() + Number(formData.duration) - 1);
        const endDate = endDateObj.toISOString().split("T")[0];

        updatedSchedule = {
          ...scheduleData,
          name: formData.name,
          type: formData.subType,
          frequency: formData.frequency,
          duration: Number(formData.duration),
          startDate: startDate,
          endDate: endDate,
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
          date: formData.date,
          time: formData.time,
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
      time: "",
      duration: "",
    });
    setErrors({});
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case "medication":
        return "투약 수정";
      case "care":
        return "돌봄 일정 수정";
      case "vaccination":
        return "접종 일정 수정";
      default:
        return "일정 수정";
    }
  };

  const getSubTitle = () => {
    switch (type) {
      case "medication":
        return "투약 정보를 수정하세요";
      case "care":
        return "돌봄 일정을 수정하세요";
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
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 1V17M1 9H17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
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

          {/* 날짜 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>날짜</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          {/* 시간 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>시간</label>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="time"
                className={styles.input}
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
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
