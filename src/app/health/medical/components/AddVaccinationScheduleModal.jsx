"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/AddScheduleModal.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import {
  notificationTimingOptions,
  ICON_MAP,
  COLOR_MAP,
  SUBTYPE_LABEL_MAP,
} from "../../constants";
import { getCareMeta } from "../../../../api/medicationApi";
import CustomCalendar from "./CustomCalendar";

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

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const startCalendarButtonRef = React.useRef(null);
  const endCalendarButtonRef = React.useRef(null);
  const [errors, setErrors] = useState({});

  // 종료날짜 검증 함수
  const validateEndDate = (startDate, endDate, frequency) => {
    if (!endDate) return { valid: true }; // 종료날짜가 없으면 검증 통과

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 기본 검증: 종료일이 시작일보다 이전이면 안됨
    if (end < start) {
      return {
        valid: false,
        message: "종료일은 시작일보다 이전일 수 없습니다.",
      };
    }

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    switch (frequency) {
      case "매일":
        if (daysDiff === 0) {
          return {
            valid: false,
            message: "시작일과 종료일이 같을 수 없습니다.",
          };
        }
        return { valid: true };
      case "매주":
        if (daysDiff < 7) {
          const minDate = new Date(start);
          minDate.setDate(minDate.getDate() + 7);
          return {
            valid: false,
            message: `매주 일정의 종료일은 시작일로부터 최소 7일 이후여야 합니다. 최소 종료일: ${
              minDate.toISOString().split("T")[0]
            }`,
          };
        }
        break;
      case "매월":
        if (daysDiff < 30) {
          const minDate = new Date(start);
          minDate.setDate(minDate.getDate() + 30);
          return {
            valid: false,
            message: `매월 일정의 종료일은 시작일로부터 최소 30일 이후여야 합니다. 최소 종료일: ${
              minDate.toISOString().split("T")[0]
            }`,
          };
        }
        break;
      case "당일":
        // 당일: 종료일은 자동으로 시작일과 동일하게 설정
        return { valid: true };
    }

    return { valid: true };
  };

  // 최소 종료날짜 계산 함수
  const getMinEndDate = (startDate, frequency) => {
    if (!startDate) return null;

    const start = new Date(startDate);

    switch (frequency) {
      case "매일":
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
      case "매주":
        const weekly = new Date(start);
        weekly.setDate(weekly.getDate() + 7);
        return weekly;
      case "매월":
        const monthly = new Date(start);
        monthly.setDate(monthly.getDate() + 30);
        return monthly;
      case "당일":
        // 당일: 종료일은 시작일과 동일
        return start;
      default:
        return start;
    }
  };

  // 빈도별 힌트 메시지
  const getEndDateHint = (frequency) => {
    switch (frequency) {
      case "매일":
        return "종료일을 입력하지 않으면 시작일과 동일하게 설정됩니다.";
      case "매주":
        if (formData.startDate) {
          const startDate = new Date(formData.startDate);
          const dayOfWeek = startDate.getDay();
          const weekdays = [
            "일요일",
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
          ];
          return `선택해주신 ${weekdays[dayOfWeek]} 기준으로 매주 반복됩니다. 종료날짜는 ${weekdays[dayOfWeek]}만 선택할 수 있습니다.`;
        }
        return "종료일을 입력하지 않으면 1주일 후로 설정됩니다. (최소 7일 이후)";
      case "매월":
        if (formData.startDate) {
          const startDate = new Date(formData.startDate);
          const day = startDate.getDate();
          return `선택해주신 ${day}일 기준으로 매월 반복됩니다. 종료날짜는 ${day}일만 선택할 수 있습니다.`;
        }
        return "종료일을 입력하지 않으면 1개월 후로 설정됩니다. (최소 30일 이후)";
      case "당일":
        return "종료일은 자동으로 시작일과 동일하게 설정됩니다.";
      default:
        return "종료날짜가 선택사항으로 되어있는데 선택을 안하면 자동 계산되어 종료일자가 설정됩니다.";
    }
  };

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
          className={`${styles.timePickerInput} ${isOpen ? styles.active : ""}`}
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

  // 커스텀 드롭다운 컴포넌트 (일정시간 스타일 적용)
  const CustomDropdown = ({
    value,
    onChange,
    placeholder,
    options,
    className,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const listRef = React.useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          isOpen &&
          !event.target.closest(`.${styles.customDropdownContainer}`)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // 드롭다운이 열릴 때 선택된 옵션 위치로 스크롤
    React.useEffect(() => {
      if (isOpen && value && listRef.current) {
        const selectedIndex = options.findIndex(
          (option) => option.value === value
        );
        if (selectedIndex !== -1) {
          const itemHeight = 48; // 각 옵션 항목의 높이 (padding 포함)
          const containerHeight = 200; // 드롭다운 컨테이너 높이
          const scrollTop = Math.max(
            0,
            selectedIndex * itemHeight - containerHeight / 2
          );
          listRef.current.scrollTop = scrollTop;
        }
      }
    }, [isOpen, value, options]);

    const handleOptionSelect = (optionValue) => {
      onChange(optionValue);
      setIsOpen(false);
    };

    const selectedOption = options.find((option) => option.value === value);

    return (
      <div className={`${styles.customDropdownContainer} ${className || ""}`}>
        <div
          className={`${styles.customDropdownInput} ${
            isOpen ? styles.active : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={
              value
                ? styles.customDropdownValue
                : styles.customDropdownPlaceholder
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className={styles.customDropdownIcon}>
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
        {isOpen && (
          <div className={styles.customDropdownDropdown}>
            <div className={styles.customDropdownList} ref={listRef}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.customDropdownItem} ${
                    value === option.value
                      ? styles.customDropdownItemSelected
                      : ""
                  }`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 날짜 포맷팅 함수
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 달력에서 날짜 선택 핸들러
  const handleStartDateSelect = (dateString) => {
    setFormData((prev) => ({
      ...prev,
      startDate: dateString,
      date: dateString, // 호환성 유지
    }));
  };

  // 외부 클릭 시 달력 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 시작날짜 달력이 열려있고, 종료날짜 입력칸을 클릭한 경우
      if (
        showStartCalendar &&
        event.target.closest(`.${styles.dateInputWrapper}`)
      ) {
        const clickedInput = event.target.closest(
          `.${styles.dateInputWrapper}`
        );
        const allDateInputs = document.querySelectorAll(
          `.${styles.dateInputWrapper}`
        );
        const clickedIndex = Array.from(allDateInputs).indexOf(clickedInput);

        // 종료날짜 입력칸(두 번째)을 클릭한 경우 시작날짜 달력 닫기
        if (clickedIndex === 1) {
          setShowStartCalendar(false);
        }
      }

      // 일반적인 외부 클릭 감지
      if (
        showStartCalendar &&
        !event.target.closest(`.${styles.dateInputWrapper}`) &&
        !event.target.closest(`.${styles.calendar}`)
      ) {
        setShowStartCalendar(false);
      }
      if (
        showEndCalendar &&
        !event.target.closest(`.${styles.dateInputWrapper}`) &&
        !event.target.closest(`.${styles.calendar}`)
      ) {
        setShowEndCalendar(false);
      }
    };

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartCalendar, showEndCalendar]);

  // 접종 일정 고정

  // 메타 API에서 가져온 옵션들
  const [subTypeOptions, setSubTypeOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 메타 데이터 로드
  useEffect(() => {
    const loadMetaData = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const metaData = await getCareMeta();
        console.log("🔍 접종 메타 데이터 로드:", metaData);

        if (metaData) {
          // 서브타입 옵션 설정 (접종 관련만 필터링)
          if (metaData.subTypes && Array.isArray(metaData.subTypes)) {
            const vaccinationSubTypes = metaData.subTypes.filter((type) =>
              ["VACCINE", "CHECKUP"].includes(type)
            );
            const subTypeOpts = vaccinationSubTypes.map((type) => ({
              value: type,
              label: SUBTYPE_LABEL_MAP[type] || type,
            }));
            setSubTypeOptions(subTypeOpts);
          } else {
            // 백엔드에서 서브타입 옵션이 없으면 기본값 사용
            setSubTypeOptions([
              { value: "VACCINE", label: "예방접종" },
              { value: "CHECKUP", label: "건강검진" },
            ]);
          }

          // 빈도 옵션 설정 (한글 label 사용)
          if (metaData.frequencies && Array.isArray(metaData.frequencies)) {
            const frequencyOpts = metaData.frequencies.map((freq) => ({
              value: freq,
              label: freq,
            }));
            setFrequencyOptions(frequencyOpts);
          } else {
            // 백엔드에서 빈도 옵션이 없으면 기본값 사용
            setFrequencyOptions([
              { value: "매일", label: "매일" },
              { value: "매주", label: "매주" },
              { value: "매월", label: "매월" },
              { value: "당일", label: "당일" },
            ]);
          }
        }
      } catch (error) {
        console.error("접종 메타 데이터 로드 실패:", error);
        // 에러 시 기본값 사용
        setSubTypeOptions([
          { value: "VACCINE", label: "예방접종" },
          { value: "CHECKUP", label: "건강검진" },
        ]);
        setFrequencyOptions([
          { value: "매일", label: "매일" },
          { value: "매주", label: "매주" },
          { value: "매월", label: "매월" },
          { value: "당일", label: "당일" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMetaData();
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // 빈도가 변경되면 종료날짜 처리
      if (field === "frequency") {
        if (value === "당일") {
          // 당일인 경우 종료일을 시작일과 동일하게 설정
          if (prev.startDate) {
            newData.endDate = prev.startDate;
          }
        } else if (value === "매주" || value === "매월") {
          // 매주, 매월인 경우 종료날짜를 자동 계산
          if (prev.startDate) {
            newData.endDate = getMinEndDate(prev.startDate, value);
          }
        }
      }

      // 시작날짜가 변경되면 종료날짜 처리
      if (field === "startDate") {
        if (prev.frequency === "당일") {
          // 당일인 경우 종료일을 시작일과 동일하게 설정
          newData.endDate = value;
        } else if (prev.frequency === "매주" || prev.frequency === "매월") {
          // 매주, 매월인 경우 종료날짜를 자동 계산
          newData.endDate = getMinEndDate(value, prev.frequency);
        }
      }

      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // 종료날짜 선택 핸들러
  const handleEndDateSelect = (dateString) => {
    // 종료날짜가 시작날짜보다 이전인지 검증
    if (formData.startDate && dateString < formData.startDate) {
      setErrors((prev) => ({
        ...prev,
        endDate: "종료날짜는 시작날짜보다 이전일 수 없습니다.",
      }));
      return;
    }

    // 종료날짜 검증
    const validation = validateEndDate(
      formData.startDate,
      dateString,
      formData.frequency
    );

    if (!validation.valid) {
      setErrors((prev) => ({
        ...prev,
        endDate: validation.message,
      }));
      return;
    }

    // 검증 통과 시 종료날짜 설정
    setFormData((prev) => ({
      ...prev,
      endDate: dateString,
    }));

    // 에러 메시지 제거
    setErrors((prev) => ({
      ...prev,
      endDate: "",
    }));

    setShowEndCalendar(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "일정 이름을 입력해주세요";
    if (!formData.subType) newErrors.subType = "유형을 선택해주세요";
    if (!formData.frequency) newErrors.frequency = "빈도를 선택해주세요";
    if (!formData.startDate) newErrors.startDate = "시작 날짜를 선택해주세요";

    // 종료날짜가 선택사항이지만, 입력된 경우 검증
    if (formData.endDate) {
      // 종료날짜가 시작날짜보다 이전인지 검증
      if (formData.startDate && formData.endDate < formData.startDate) {
        newErrors.endDate = "종료날짜는 시작날짜보다 이전일 수 없습니다.";
      } else {
        const validation = validateEndDate(
          formData.startDate,
          formData.endDate,
          formData.frequency
        );
        if (!validation.valid) {
          newErrors.endDate = validation.message;
        }
      }
    }

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
        type: "접종",
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
        color: getColorForType("접종"),
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
    setShowStartCalendar(false); // 달력도 닫기
    setShowEndCalendar(false); // 달력도 닫기
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
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <>
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
                {errors.name && (
                  <span className={styles.error}>{errors.name}</span>
                )}
              </div>

              {/* 유형 (서브타입) */}
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label className={styles.label}>유형</label>
                  <span className={styles.required}>*</span>
                </div>
                <div className={styles.inputContainer}>
                  <CustomDropdown
                    value={formData.subType}
                    onChange={(value) => handleInputChange("subType", value)}
                    placeholder="유형을 선택하세요"
                    options={subTypeOptions}
                  />
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
                <div className={styles.inputContainer}>
                  <CustomDropdown
                    value={formData.frequency}
                    onChange={(value) => handleInputChange("frequency", value)}
                    placeholder="빈도를 선택하세요"
                    options={frequencyOptions}
                  />
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
                  <div className={styles.dateInputWrapper}>
                    <input
                      type="text"
                      value={formatDateForDisplay(formData.startDate)}
                      placeholder="시작 날짜를 선택하세요"
                      className={styles.dateInput}
                      readOnly
                      onClick={() => setShowStartCalendar(true)}
                    />
                    <button
                      ref={startCalendarButtonRef}
                      type="button"
                      className={styles.calendarButton}
                      onClick={() => setShowStartCalendar(!showStartCalendar)}
                    >
                      <img
                        src="/health/calendar.png"
                        alt="달력"
                        width="16"
                        height="16"
                      />
                    </button>
                  </div>
                </div>
                {errors.startDate && (
                  <span className={styles.error}>{errors.startDate}</span>
                )}
              </div>

              {/* 종료 날짜 */}
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label className={styles.label}>종료 날짜 (선택)</label>
                </div>
                <div className={styles.inputContainer}>
                  <div className={styles.dateInputWrapper}>
                    <input
                      type="text"
                      value={formatDateForDisplay(formData.endDate)}
                      placeholder="종료 날짜를 선택하세요 (선택사항)"
                      className={`${styles.dateInput} ${
                        formData.frequency === "당일" ? styles.disabled : ""
                      }`}
                      readOnly
                      disabled={formData.frequency === "당일"}
                      onClick={() => {
                        if (formData.frequency !== "당일") {
                          setShowEndCalendar(true);
                        }
                      }}
                    />
                    <button
                      ref={endCalendarButtonRef}
                      type="button"
                      className={`${styles.calendarButton} ${
                        formData.frequency === "당일" ? styles.disabled : ""
                      }`}
                      disabled={formData.frequency === "당일"}
                      onClick={() => {
                        if (formData.frequency !== "당일") {
                          setShowEndCalendar(!showEndCalendar);
                        }
                      }}
                    >
                      <img
                        src="/health/calendar.png"
                        alt="달력"
                        width="16"
                        height="16"
                      />
                    </button>
                  </div>
                </div>
                {errors.endDate && (
                  <span className={styles.error}>{errors.endDate}</span>
                )}
                {!errors.endDate && formData.frequency && (
                  <span className={styles.hint}>
                    {getEndDateHint(formData.frequency)}
                  </span>
                )}
              </div>

              {/* 일정 시간 */}
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label className={styles.label}>일정 시간</label>
                  <span className={styles.required}>*</span>
                </div>
                <div className={styles.inputContainer}>
                  <TimePicker
                    value={formData.scheduleTime}
                    onChange={(timeString) => {
                      handleInputChange("scheduleTime", timeString);
                      handleInputChange("time", timeString); // 호환성 유지
                    }}
                    placeholder="시간을 선택하세요"
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
                <div className={styles.inputContainer}>
                  <CustomDropdown
                    value={formData.notificationTiming}
                    onChange={(value) =>
                      handleInputChange("notificationTiming", value)
                    }
                    placeholder="알림 시기를 선택하세요"
                    options={notificationTimingOptions}
                  />
                </div>
                {errors.notificationTiming && (
                  <span className={styles.error}>
                    {errors.notificationTiming}
                  </span>
                )}
              </div>
            </>
          )}
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

      {/* 커스텀 달력 */}
      <CustomCalendar
        isOpen={showStartCalendar}
        onClose={() => setShowStartCalendar(false)}
        onDateSelect={handleStartDateSelect}
        selectedDate={formData.startDate}
        buttonRef={startCalendarButtonRef}
      />
      <CustomCalendar
        isOpen={showEndCalendar}
        onClose={() => setShowEndCalendar(false)}
        onDateSelect={handleEndDateSelect}
        selectedDate={formData.endDate}
        minDate={getMinEndDate(formData.startDate, formData.frequency)}
        buttonRef={endCalendarButtonRef}
        monthlyMode={formData.frequency === "매월"}
        monthlyDay={
          formData.frequency === "매월" && formData.startDate
            ? new Date(formData.startDate).getDate()
            : null
        }
        weeklyMode={formData.frequency === "매주"}
        weeklyDayOfWeek={
          formData.frequency === "매주" && formData.startDate
            ? new Date(formData.startDate).getDay()
            : null
        }
        showToday={false}
      />
    </div>
  );
}
