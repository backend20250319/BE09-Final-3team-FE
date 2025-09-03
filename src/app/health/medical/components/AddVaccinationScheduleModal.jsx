"use client";

import React, { useState } from "react";
import styles from "../styles/AddScheduleModal.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import {
  vaccinationSubTypeOptions,
  vaccinationFrequencyOptions,
  notificationTimingOptions,
  ICON_MAP,
  COLOR_MAP,
  SUBTYPE_LABEL_MAP,
} from "../../constants";

export default function AddVaccinationScheduleModal({
  isOpen,
  onClose,
  onAdd,
}) {
  const { selectedPetName } = useSelectedPet();

  const [formData, setFormData] = useState({
    name: "",
    subType: "",
    frequency: "",
    startDate: "",
    endDate: "",
    date: "", // 호환성 유지
    scheduleTime: "",
    time: "", // 호환성 유지
    notificationTiming: "",
  });

  const [errors, setErrors] = useState({});

  // 접종 일정 고정
  const mainType = "접종";

  const subTypeOptions = vaccinationSubTypeOptions;
  const frequencyOptions = vaccinationFrequencyOptions;

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

    if (!formData.name.trim()) newErrors.name = "일정 이름을 입력해주세요";
    if (!formData.subType) newErrors.subType = "유형을 선택해주세요";
    if (!formData.frequency) newErrors.frequency = "빈도를 선택해주세요";
    if (!formData.startDate) newErrors.startDate = "시작 날짜를 선택해주세요";
    if (!formData.endDate) newErrors.endDate = "종료 날짜를 선택해주세요";
    if (!formData.scheduleTime)
      newErrors.scheduleTime = "일정 시간을 입력해주세요";
    if (!formData.notificationTiming)
      newErrors.notificationTiming = "알림 시기를 선택해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getIconForSubType = (subType) => {
    return ICON_MAP[subType] || ICON_MAP["기타"];
  };

  const getColorForType = (type) => {
    return COLOR_MAP[type] || "#F5F5F5";
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newSchedule = {
        id: Date.now(),
        name: formData.name,
        type: mainType,
        subType: formData.subType,
        frequency: formData.frequency,
        startDate: formData.startDate,
        endDate: formData.endDate,
        date: formData.startDate, // 호환성 유지
        scheduleTime: formData.scheduleTime,
        time: formData.scheduleTime, // 호환성 유지
        notificationTiming: formData.notificationTiming,
        petName: selectedPetName, // 선택된 펫 이름 추가
        icon: getIconForSubType(formData.subType),
        color: getColorForType(mainType),
        isNotified: true,
      };

      onAdd(newSchedule);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      subType: "",
      frequency: "",
      startDate: "",
      endDate: "",
      date: "",
      scheduleTime: "",
      time: "",
      notificationTiming: "",
    });
    setErrors({});
    onClose();
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
                src="/health/syringe.png"
                alt="접종 일정 추가 아이콘"
                width={20}
                height={20}
              />
            </div>
            <div className={styles.headerText}>
              <h3>접종 추가</h3>
              <p>새로운 접종 일정을 추가하세요</p>
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
              <label className={styles.label}>일정 이름</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                placeholder="일정 이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          {/* 유형 (서브타입) */}
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
                {subTypeOptions.map((option) => (
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
              <label className={styles.label}>빈도</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
              >
                <option value="">빈도를 선택하세요</option>
                {frequencyOptions.map((option) => (
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
                value={formData.startDate}
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
                value={formData.scheduleTime}
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

          {/* 알림 시기 */}
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
            일정 추가
          </button>
        </div>
      </div>
    </div>
  );
}
