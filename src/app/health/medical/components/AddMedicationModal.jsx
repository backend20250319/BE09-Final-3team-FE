"use client";

import React, { useState } from "react";
import styles from "../styles/AddMedicationModal.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import {
  medicationTypeOptions,
  medicationFrequencyOptions,
  notificationTimingOptions,
} from "../../data/mockData";

export default function AddMedicationModal({ isOpen, onClose, onAdd }) {
  const { selectedPetName } = useSelectedPet();

  const [formData, setFormData] = useState({
    name: "",
    frequency: "",
    type: "",
    duration: "", // 복용 기간 (일수)
    startDate: "", // 시작 날짜
    notificationTime: "", // 알림 시간
    notificationTiming: "", // 알림 시기 (당일, 1일전, 2일전, 3일전)
  });

  const [errors, setErrors] = useState({});

  const frequencyOptions = medicationFrequencyOptions;
  const typeOptions = medicationTypeOptions;
  const timingOptions = notificationTimingOptions;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 메시지 제거
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
      newErrors.name = "약 이름을 입력해주세요";
    }

    if (!formData.frequency) {
      newErrors.frequency = "복용 빈도를 선택해주세요";
    }

    if (!formData.type) {
      newErrors.type = "유형을 선택해주세요";
    }

    if (!formData.duration) {
      newErrors.duration = "복용 기간을 입력해주세요";
    } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = "유효한 복용 기간(숫자)을 입력해주세요";
    }

    if (!formData.startDate) {
      newErrors.startDate = "시작 날짜를 선택해주세요";
    }

    if (!formData.notificationTime) {
      newErrors.notificationTime = "일정 시간을 입력해주세요";
    }

    if (!formData.notificationTiming) {
      newErrors.notificationTiming = "알림 시기를 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // 종료일 계산 (startDate + duration - 1일 후)
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(
        startDateObj.getDate() + Number(formData.duration) - 1
      );
      const endDate = endDateObj.toISOString().split("T")[0];

      const newMedication = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        frequency: formData.frequency,
        duration: Number(formData.duration),
        startDate: formData.startDate,
        endDate: endDate,
        notificationTime: formData.notificationTime,
        notificationTiming: formData.notificationTiming,
        scheduleTime: formData.notificationTime, // 복용 시간으로 사용
        petName: selectedPetName, // 선택된 펫 이름 추가
        icon: "💊",
        color: formData.type === "복용약" ? "#E3F2FD" : "#FFF3E0",
        isNotified: false,
      };

      onAdd(newMedication);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      frequency: "",
      type: "",
      duration: "",
      startDate: "",
      notificationTime: "",
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
                src="/health/pill.png"
                alt="알약 아이콘"
                className={styles.iconImage}
              />
            </div>
            <div className={styles.headerText}>
              <h3>투약 추가</h3>
              <p>새로운 약 정보를 추가하세요</p>
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
          {/* 약 이름 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>약 이름</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                placeholder="약물 이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          {/* 복용 빈도 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>복용</label>
              <label className={styles.label}>빈도</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
              >
                <option value="">복용 빈도를 선택하세요</option>
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

          {/* 유형 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>유형</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="">유형을 선택하세요</option>
                {typeOptions.map((option) => (
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
            {errors.type && <span className={styles.error}>{errors.type}</span>}
          </div>

          {/* 복용 기간 */}
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
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            {errors.duration && (
              <span className={styles.error}>{errors.duration}</span>
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
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            {errors.startDate && (
              <span className={styles.error}>{errors.startDate}</span>
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
                {timingOptions.map((option) => (
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
            일정 추가
          </button>
        </div>
      </div>
    </div>
  );
}
