"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/AddScheduleModal.module.css";
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
    dosage: "", // 용량
    instructions: "", // 복용법
    frequency: "",
    type: "",
    duration: "", // 복용 기간 (일수)
    startDate: "", // 시작 날짜
    scheduleTime: "", // 일정 시간 (실제 복용 시간)
    notificationTiming: "", // 알림 시기 (당일, 1일전, 2일전, 3일전)
  });

  // 복용 빈도에 따른 기본 시간 설정
  const getDefaultTimes = (frequency) => {
    switch (frequency) {
      case "하루에 한 번":
        return ["09:00"];
      case "하루에 두 번":
        return ["08:00", "20:00"];
      case "하루에 세 번":
        return ["08:00", "12:00", "20:00"];
      default:
        return ["09:00"];
    }
  };

  // 복용 빈도에 따른 시간 입력 칸 개수
  const getTimeInputCount = (frequency) => {
    switch (frequency) {
      case "하루에 한 번":
        return 1;
      case "하루에 두 번":
        return 2;
      case "하루에 세 번":
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
  const [errors, setErrors] = useState({});
  const [showFrequencyInfo, setShowFrequencyInfo] = useState(false);

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

  const frequencyOptions = medicationFrequencyOptions;
  const typeOptions = medicationTypeOptions;
  const timingOptions = notificationTimingOptions;

  const handleInputChange = (field, value) => {
    // 복용 빈도가 변경되면 기본 시간도 함께 설정
    if (field === "frequency") {
      const defaultTimes = getDefaultTimes(value);
      console.log("복용 빈도 변경:", value, "기본 시간:", defaultTimes);
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

    if (!formData.dosage.trim()) {
      newErrors.dosage = "용량을 입력해주세요";
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "복용법을 입력해주세요";
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

    if (!formData.scheduleTime) {
      newErrors.scheduleTime = "일정 시간을 입력해주세요";
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
        dosage: formData.dosage,
        instructions: formData.instructions,
        type: formData.type,
        frequency: formData.frequency,
        duration: Number(formData.duration),
        startDate: formData.startDate,
        endDate: endDate,
        scheduleTime: formData.scheduleTime, // 실제 복용 시간
        notificationTiming: formData.notificationTiming,
        petName: selectedPetName, // 선택된 펫 이름 추가
        icon: "💊",
        color: formData.type === "복용약" ? "#E3F2FD" : "#FFF3E0",
        isNotified: true,
      };

      onAdd(newMedication);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      dosage: "",
      instructions: "",
      frequency: "",
      type: "",
      duration: "",
      startDate: "",
      scheduleTime: "",
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

          {/* 용량 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>용량</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                placeholder="예: 500mg, 1정"
                value={formData.dosage}
                onChange={(e) => handleInputChange("dosage", e.target.value)}
              />
            </div>
            {errors.dosage && (
              <span className={styles.error}>{errors.dosage}</span>
            )}
          </div>

          {/* 복용법 */}
          <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>복용법</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                placeholder="예: 식후 30분, 공복에"
                value={formData.instructions}
                onChange={(e) =>
                  handleInputChange("instructions", e.target.value)
                }
              />
            </div>
            {errors.instructions && (
              <span className={styles.error}>{errors.instructions}</span>
            )}
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
              <button
                className={styles.infoButton}
                onClick={() => setShowFrequencyInfo(!showFrequencyInfo)}
                title="빈도 정보 보기"
              >
                i
              </button>
              {showFrequencyInfo && (
                <div className={styles.infoDropdown}>
                  <div className={styles.infoContent}>
                    <strong>선택된 빈도:</strong>{" "}
                    {formData.frequency || "선택되지 않음"}
                    <br />
                    <strong>시간 입력 칸:</strong>{" "}
                    {formData.frequency
                      ? getTimeInputCount(formData.frequency)
                      : 0}
                    개
                    <br />
                    <small>
                      • 하루에 한 번: 1개 시간 입력
                      <br />
                      • 하루에 두 번: 아침, 저녁 2개 시간 입력
                      <br />• 하루에 세 번: 아침, 점심, 저녁 3개 시간 입력
                    </small>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.timeInputsContainer}>
              {formData.frequency ? (
                <div className={styles.timeInputsRow}>
                  {Array.from(
                    { length: getTimeInputCount(formData.frequency) },
                    (_, index) => (
                      <div key={index} className={styles.timeInputGroup}>
                        <label className={styles.timeLabel}>
                          {formData.frequency === "하루에 두 번"
                            ? index === 0
                              ? "아침"
                              : "저녁"
                            : formData.frequency === "하루에 세 번"
                            ? index === 0
                              ? "아침"
                              : index === 1
                              ? "점심"
                              : "저녁"
                            : "시간"}
                        </label>
                        <TimePicker
                          value={
                            formData.scheduleTime.split(",")[index]?.trim() ||
                            ""
                          }
                          onChange={(time) => {
                            const times = formData.scheduleTime
                              .split(",")
                              .map((t) => t.trim());
                            times[index] = time;
                            handleInputChange("scheduleTime", times.join(", "));
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
