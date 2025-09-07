"use client";

import React, { useState, useEffect } from "react";
import { useSelectedPet } from "../../context/SelectedPetContext";
import { updateActivityData } from "../../../../api/activityApi";
import UpdateResultModal from "./UpdateResultModal";
import Select from "./ClientOnlySelect";
import styles from "../styles/ActivityRecordView.module.css";

export default function ActivityRecordView({
  isOpen,
  onClose,
  recordData,
  date,
  selectedPetName,
  onUpdate, // 부모 컴포넌트에 업데이트 알림
}) {
  const { pets } = useSelectedPet();
  const [showMealDetails, setShowMealDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editMeals, setEditMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const ACTIVITY_LEVEL_MAP = {
    LOW: "거의 안 움직여요",
    MEDIUM_LOW: "가끔 산책해요",
    MEDIUM_HIGH: "자주 뛰어놀아요",
    HIGH: "매우 활동적이에요",
  };

  // 활동량 옵션
  const activityLevelOptions = [
    { value: "LOW", label: "거의 안 움직여요" },
    { value: "MEDIUM_LOW", label: "가끔 산책해요" },
    { value: "MEDIUM_HIGH", label: "자주 뛰어놀아요" },
    { value: "HIGH", label: "매우 활동적이에요" },
  ];

  // 식사 타입 옵션
  const mealTypeOptions = [
    { value: "BREAKFAST", label: "아침" },
    { value: "LUNCH", label: "점심" },
    { value: "DINNER", label: "저녁" },
    { value: "SNACK", label: "간식" },
  ];

  // 수정 모드 진입 시 폼 데이터 초기화
  useEffect(() => {
    if (isEditMode && recordData) {
      setEditFormData({
        walkingDistance: recordData.walkingDistanceKm?.toString() || "",
        activityLevel: recordData.activityLevel || "",
        weight: recordData.weightKg?.toString() || "",
        sleepTime: recordData.sleepHours?.toString() || "",
        urineCount: recordData.peeCount?.toString() || "",
        fecesCount: recordData.poopCount?.toString() || "",
        memo: recordData.memo || "",
      });

      // 식사 데이터 초기화
      if (recordData.meals && Array.isArray(recordData.meals)) {
        setEditMeals(
          recordData.meals.map((meal) => ({
            mealNo: meal.mealNo,
            mealType: meal.mealType || "BREAKFAST",
            totalWeightG: meal.totalWeightG?.toString() || "",
            totalCalories: meal.totalCalories?.toString() || "",
            consumedWeightG: meal.consumedWeightG?.toString() || "",
          }))
        );
      } else {
        setEditMeals([]);
      }
    }
  }, [isEditMode, recordData]);

  // 모달이 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 막기
      document.body.style.overflow = "hidden";

      // 오버레이에서만 스크롤 이벤트 방지 (모달 내부는 허용)
      const handleWheel = (e) => {
        // 모달 내부가 아닌 오버레이 영역에서만 스크롤 방지
        if (!e.target.closest("[data-modal-content]")) {
          e.preventDefault();
        }
      };

      const handleTouchMove = (e) => {
        // 모달 내부가 아닌 오버레이 영역에서만 스크롤 방지
        if (!e.target.closest("[data-modal-content]")) {
          e.preventDefault();
        }
      };

      // 오버레이에 이벤트 리스너 추가
      const overlay = document.querySelector("[data-modal-overlay]");
      if (overlay) {
        overlay.addEventListener("wheel", handleWheel, { passive: false });
        overlay.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
      }

      return () => {
        // 이벤트 리스너 제거
        if (overlay) {
          overlay.removeEventListener("wheel", handleWheel);
          overlay.removeEventListener("touchmove", handleTouchMove);
        }
      };
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !recordData) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 선택된 펫의 이미지 가져오기
  const selectedPet = pets.find((pet) => pet.name === selectedPetName);
  const petName = selectedPetName || "";

  // 수정 모드 토글
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // 수정 모드 진입 시 에러 상태 초기화
    if (!isEditMode) {
      setValidationErrors({});
    }
  };

  // 폼 데이터 변경 핸들러
  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 식사 데이터 변경 핸들러
  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...editMeals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value,
    };
    setEditMeals(updatedMeals);
  };

  // 식사 추가
  const handleAddMeal = () => {
    setEditMeals((prev) => [
      ...prev,
      {
        mealType: "BREAKFAST",
        totalWeightG: "",
        totalCalories: "",
        consumedWeightG: "",
      },
    ]);

    // 새로 추가된 식사의 첫 번째 입력 필드에 포커스
    setTimeout(() => {
      const newMealIndex = editMeals.length;
      const firstInput = document.querySelector(
        `[data-meal-index="${newMealIndex}"] input`
      );
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  };

  // 식사 삭제
  const handleRemoveMeal = (index) => {
    setEditMeals((prev) => prev.filter((_, i) => i !== index));
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const errors = {};

    // 산책 거리 검사
    if (
      !editFormData.walkingDistance ||
      editFormData.walkingDistance.trim() === ""
    ) {
      errors.walkingDistance = "산책 거리를 입력해주세요.";
    }

    // 활동량 검사
    if (
      !editFormData.activityLevel ||
      editFormData.activityLevel.trim() === ""
    ) {
      errors.activityLevel = "활동량을 선택해주세요.";
    }

    // 무게 검사
    if (!editFormData.weight || editFormData.weight.trim() === "") {
      errors.weight = "무게를 입력해주세요.";
    }

    // 수면 시간 검사
    if (!editFormData.sleepTime || editFormData.sleepTime.trim() === "") {
      errors.sleepTime = "수면 시간을 입력해주세요.";
    }

    // 소변 횟수 검사
    if (
      editFormData.urineCount === undefined ||
      editFormData.urineCount === ""
    ) {
      errors.urineCount = "소변 횟수를 입력해주세요.";
    }

    // 대변 횟수 검사
    if (
      editFormData.fecesCount === undefined ||
      editFormData.fecesCount === ""
    ) {
      errors.fecesCount = "대변 횟수를 입력해주세요.";
    }

    // 식사 데이터 검사
    editMeals.forEach((meal, index) => {
      if (!meal.mealType || meal.mealType.trim() === "") {
        errors[`mealType_${index}`] = "식사 타입을 선택해주세요.";
      }
      if (!meal.totalWeightG || meal.totalWeightG.trim() === "") {
        errors[`totalWeightG_${index}`] = "총 용량을 입력해주세요.";
      }
      if (!meal.totalCalories || meal.totalCalories.trim() === "") {
        errors[`totalCalories_${index}`] = "총 칼로리를 입력해주세요.";
      }
      if (!meal.consumedWeightG || meal.consumedWeightG.trim() === "") {
        errors[`consumedWeightG_${index}`] = "섭취 용량을 입력해주세요.";
      }
    });

    setValidationErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // 첫 번째 에러 필드로 스크롤하는 함수
  const scrollToFirstError = (errors = validationErrors) => {
    console.log("🔍 scrollToFirstError 호출됨, errors:", errors);
    const errorKeys = Object.keys(errors);
    console.log("🔍 errorKeys:", errorKeys);
    if (errorKeys.length === 0) return;

    // 에러 필드 우선순위 정의 (위에서 아래 순서)
    const fieldOrder = [
      "walkingDistance",
      "activityLevel",
      "weight",
      "sleepTime",
      "urineCount",
      "fecesCount",
    ];

    // 식사 관련 에러들 추가 (식사 타입이 가장 먼저)
    editMeals.forEach((_, index) => {
      fieldOrder.push(
        `mealType_${index}`,
        `totalWeightG_${index}`,
        `totalCalories_${index}`,
        `consumedWeightG_${index}`
      );
    });

    // 첫 번째 에러 필드 찾기
    let firstErrorField = null;
    for (const field of fieldOrder) {
      if (errorKeys.includes(field)) {
        firstErrorField = field;
        break;
      }
    }

    console.log("🔍 firstErrorField:", firstErrorField);
    if (!firstErrorField) return;

    // 해당 필드 찾아서 스크롤
    let targetElement = null;

    if (firstErrorField === "walkingDistance") {
      targetElement = document.querySelector(
        'input[type="number"][step="0.1"][min="0"]'
      );
    } else if (firstErrorField === "activityLevel") {
      targetElement = document.querySelector(".react-select__control");
    } else if (firstErrorField === "weight") {
      targetElement = document.querySelector(
        'input[type="number"][step="0.1"][min="0.1"]'
      );
    } else if (firstErrorField === "sleepTime") {
      targetElement = document.querySelector(
        'input[type="number"][step="0.5"][min="0"][max="24"]'
      );
    } else if (firstErrorField === "urineCount") {
      const inputs = document.querySelectorAll('input[type="number"][min="0"]');
      targetElement = inputs[0]; // 첫 번째 소변 횟수 입력
    } else if (firstErrorField === "fecesCount") {
      const inputs = document.querySelectorAll('input[type="number"][min="0"]');
      targetElement = inputs[1]; // 두 번째 대변 횟수 입력
    } else if (firstErrorField.startsWith("mealType_")) {
      const index = firstErrorField.split("_")[1];
      const mealElement = document.querySelector(
        `[data-meal-index="${index}"]`
      );
      if (mealElement) {
        targetElement = mealElement.querySelector(".react-select__control");
      }
    } else if (
      firstErrorField.startsWith("totalWeightG_") ||
      firstErrorField.startsWith("totalCalories_") ||
      firstErrorField.startsWith("consumedWeightG_")
    ) {
      const index = firstErrorField.split("_")[1];
      const mealElement = document.querySelector(
        `[data-meal-index="${index}"]`
      );
      if (mealElement) {
        const fieldType = firstErrorField.split("_")[0];
        console.log("🔍 mealElement 찾음:", mealElement);
        console.log("🔍 fieldType:", fieldType);

        if (fieldType === "totalWeightG") {
          targetElement = mealElement.querySelector(
            'input[step="0.1"][min="0.1"]'
          );
          console.log("🔍 totalWeightG input 찾음:", targetElement);
        } else if (fieldType === "totalCalories") {
          targetElement = mealElement.querySelector(
            'input[type="number"][min="0"]'
          );
          console.log("🔍 totalCalories input 찾음:", targetElement);
        } else if (fieldType === "consumedWeightG") {
          const inputs = mealElement.querySelectorAll(
            'input[step="0.1"][min="0.1"]'
          );
          targetElement = inputs[1]; // 두 번째 섭취 용량 입력
          console.log("🔍 consumedWeightG input 찾음:", targetElement);
        }
      } else {
        console.log("🔍 mealElement를 찾을 수 없음, index:", index);
      }
    }

    console.log("🔍 targetElement:", targetElement);
    if (targetElement) {
      console.log("🔍 스크롤 실행 중...");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // 포커스도 주기
      setTimeout(() => {
        console.log("🔍 포커스 실행 중...");
        if (targetElement.tagName === "INPUT") {
          targetElement.focus();
        } else if (targetElement.classList.contains("react-select__control")) {
          targetElement.click();
        }
      }, 300);
    } else {
      console.log("🔍 targetElement를 찾을 수 없음");
    }
  };

  // 산책 칼로리 계산 함수
  const calculateCalories = (walkingDistance, activityLevel, weight) => {
    if (!walkingDistance || !activityLevel || !weight) {
      return { walkingCalorie: 0, recommendedCalorie: 0 };
    }

    const distance = parseFloat(walkingDistance);
    const weightNum = parseFloat(weight);

    // 활동량별 계수 (ActivityManagement와 동일하게)
    const activityCoefficients = {
      LOW: 1.2,
      MEDIUM_LOW: 1.5,
      MEDIUM_HIGH: 2.0,
      HIGH: 2.5,
    };

    const coefficient = activityCoefficients[activityLevel] || 1.5;

    // 산책 소모 칼로리 계산 (거리 × 활동량 계수 × 5)
    const walkingCalorie = Math.round(distance * coefficient * 5);

    // 권장 소모 칼로리 계산 (몸무게 × 활동계수 × 70)
    const recommendedCalorie = Math.round(weightNum * coefficient * 70);

    return { walkingCalorie, recommendedCalorie };
  };

  // 식사 칼로리 계산 함수
  const calculateMealCalories = (
    totalWeight,
    totalCalories,
    consumedWeight,
    weight,
    activityLevel
  ) => {
    if (
      !totalWeight ||
      !totalCalories ||
      !consumedWeight ||
      !weight ||
      !activityLevel
    ) {
      return { consumedCalories: 0, recommendedIntake: 0 };
    }

    const totalW = parseFloat(totalWeight);
    const totalC = parseFloat(totalCalories);
    const consumedW = parseFloat(consumedWeight);
    const weightNum = parseFloat(weight);

    if (totalW <= 0 || totalC <= 0 || consumedW <= 0 || weightNum <= 0) {
      return { consumedCalories: 0, recommendedIntake: 0 };
    }

    // 섭취 칼로리 계산 (섭취 무게 / 총 무게 × 총 칼로리)
    const consumedCalories = Math.round((consumedW / totalW) * totalC);

    // 활동량별 계수
    const activityCoefficients = {
      LOW: 1.2,
      MEDIUM_LOW: 1.5,
      MEDIUM_HIGH: 2.0,
      HIGH: 2.5,
    };

    const coefficient = activityCoefficients[activityLevel] || 1.5;

    // 권장 섭취 칼로리 (몸무게 × 활동계수 × 100)
    const recommendedIntake = Math.round(weightNum * coefficient * 100);

    return { consumedCalories, recommendedIntake };
  };

  // 수정 저장
  const handleSave = async () => {
    if (!recordData.activityNo) {
      setResultMessage("활동 데이터 번호가 없습니다.");
      setIsSuccess(false);
      setShowResultModal(true);
      return;
    }

    // 유효성 검사
    const validation = validateForm();
    if (!validation.isValid) {
      setResultMessage("입력하지 않은 필드가 있습니다. 확인해주세요.");
      setIsSuccess(false);
      setShowResultModal(true);

      // 첫 번째 에러가 있는 필드로 스크롤
      setTimeout(() => {
        scrollToFirstError(validation.errors);
      }, 100);
      return;
    }

    setIsLoading(true);
    try {
      // 칼로리 계산
      const { walkingCalorie, recommendedCalorie } = calculateCalories(
        editFormData.walkingDistance,
        editFormData.activityLevel,
        editFormData.weight
      );

      // 수정할 데이터 준비
      const updateData = {
        walkingDistanceKm: parseFloat(editFormData.walkingDistance) || null,
        activityLevel: editFormData.activityLevel || null,
        weightKg: parseFloat(editFormData.weight) || null,
        sleepHours: parseFloat(editFormData.sleepTime) || null,
        peeCount: parseInt(editFormData.urineCount) || null,
        poopCount: parseInt(editFormData.fecesCount) || null,
        memo: editFormData.memo || null,
        meals: editMeals.map((meal) => {
          const calculatedCalories = calculateMealCalories(
            meal.totalWeightG,
            meal.totalCalories,
            meal.consumedWeightG,
            editFormData.weight,
            editFormData.activityLevel
          );

          return {
            mealNo: meal.mealNo || null,
            mealType: meal.mealType,
            totalWeightG: parseFloat(meal.totalWeightG) || null,
            totalCalories: parseInt(meal.totalCalories) || null,
            consumedWeightG: parseFloat(meal.consumedWeightG) || null,
            consumedCalories: calculatedCalories.consumedCalories,
          };
        }),
      };

      // API 호출
      const response = await updateActivityData(
        recordData.activityNo,
        updateData
      );

      console.log("API 응답:", response);

      // 성공 시 수정 모드 종료
      setIsEditMode(false);

      // 부모 컴포넌트에 업데이트 알림
      if (onUpdate) {
        onUpdate();
      }

      // 성공 모달 표시
      setResultMessage("활동 데이터가 성공적으로 수정되었습니다!");
      setIsSuccess(true);
      setShowResultModal(true);
    } catch (error) {
      console.error("활동 데이터 수정 실패:", error);

      // 실패 모달 표시
      setResultMessage("활동 데이터 수정에 실패했습니다. 다시 시도해주세요.");
      setIsSuccess(false);
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditMode(false);
    // 원본 데이터로 복원
    setEditFormData({});
    setEditMeals([]);
  };

  // 모달 닫기 시 수정 모드 초기화
  const handleClose = () => {
    setIsEditMode(false);
    setEditFormData({});
    setEditMeals([]);
    onClose();
  };

  // 결과 모달 닫기
  const handleResultModalClose = () => {
    setShowResultModal(false);
    setResultMessage("");
    setIsSuccess(false);
  };

  return (
    <div className={styles.overlay} data-modal-overlay suppressHydrationWarning>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {selectedPet?.imageUrl ? (
              <img
                src={selectedPet.imageUrl}
                alt={`${petName} 프로필`}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.petAvatarPlaceholder}>
                <span>?</span>
              </div>
            )}
            <h2 className={styles.title}>{formatDate(date)} 활동 기록</h2>
          </div>
          <div className={styles.headerRight}>
            {isEditMode ? (
              <>
                <button
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isLoading}
                  aria-label="저장"
                >
                  {isLoading ? "저장 중..." : "저장"}
                </button>
                <button
                  className={styles.closeButton}
                  onClick={handleCancel}
                  aria-label="취소"
                >
                  <img
                    src="/health/close.png"
                    alt="취소"
                    width={20}
                    height={20}
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.editButton}
                  onClick={toggleEditMode}
                  aria-label="수정"
                >
                  수정
                </button>
                <button
                  className={styles.closeButton}
                  onClick={handleClose}
                  aria-label="닫기"
                >
                  <img
                    src="/health/close.png"
                    alt="닫기"
                    width={20}
                    height={20}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.content} data-modal-content>
          {/* 산책 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/footprint.png"
                alt="산책 아이콘"
                className={styles.sectionIcon}
              />
              <h3>산책 활동</h3>
            </div>
            {isEditMode ? (
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>산책 거리 (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={editFormData.walkingDistance || ""}
                      onChange={(e) =>
                        handleFormChange("walkingDistance", e.target.value)
                      }
                      className={
                        validationErrors.walkingDistance
                          ? styles.errorInput
                          : ""
                      }
                    />
                    {validationErrors.walkingDistance && (
                      <div className={styles.errorMessage}>
                        {validationErrors.walkingDistance}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>활동량</label>
                    <Select
                      options={activityLevelOptions}
                      value={activityLevelOptions.find(
                        (option) => option.value === editFormData.activityLevel
                      )}
                      onChange={(selectedOption) => {
                        handleFormChange(
                          "activityLevel",
                          selectedOption?.value || ""
                        );
                      }}
                      placeholder="선택하세요"
                      classNamePrefix="react-select"
                      className={
                        validationErrors.activityLevel ? styles.errorSelect : ""
                      }
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#e6f4ea"
                            : state.isFocused
                            ? "#f0fdf4"
                            : "white",
                          color: state.isSelected ? "#4caf50" : "#374151",
                          cursor: "pointer",
                          ":active": {
                            backgroundColor: "#c8e6c9",
                            color: "#388e3c",
                          },
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "42px",
                          height: "38px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          borderColor: state.isFocused ? "#8bc34a" : "#d1d5db",
                          boxShadow: state.isFocused
                            ? "0 0 0 3px rgba(139,195,74,0.1)"
                            : "none",
                          "&:hover": {
                            borderColor: "#8bc34a",
                          },
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          height: "38px",
                          padding: "0 12px",
                          alignItems: "center",
                        }),
                        input: (provided) => ({
                          ...provided,
                          margin: 0,
                          padding: 0,
                        }),
                        indicatorsContainer: (provided) => ({
                          ...provided,
                          height: "38px",
                          alignItems: "center",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: "#adaebc",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#374151",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          borderRadius: 8,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          zIndex: 10,
                          marginTop: 0,
                        }),
                      }}
                    />
                    {validationErrors.activityLevel && (
                      <div className={styles.errorMessage}>
                        {validationErrors.activityLevel}
                      </div>
                    )}
                  </div>
                </div>

                {/* 실시간 칼로리 계산 결과 - 항상 표시 */}
                <div className={styles.calorieCalculation}>
                  <div className={styles.calorieItem}>
                    <span className={styles.calorieLabel}>
                      계산된 소모 칼로리:
                    </span>
                    <span className={styles.calorieValue}>
                      {
                        calculateCalories(
                          editFormData.walkingDistance,
                          editFormData.activityLevel,
                          editFormData.weight
                        ).walkingCalorie
                      }{" "}
                      kcal
                    </span>
                  </div>
                  <div className={styles.calorieItem}>
                    <span className={styles.calorieLabel}>
                      권장 소모 칼로리:
                    </span>
                    <span className={styles.calorieValue}>
                      {
                        calculateCalories(
                          editFormData.walkingDistance,
                          editFormData.activityLevel,
                          editFormData.weight
                        ).recommendedCalorie
                      }{" "}
                      kcal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.dataGrid}>
                <div className={styles.dataItem}>
                  <span className={styles.label}>산책 거리</span>
                  <span className={styles.value}>
                    {recordData.walkingDistanceKm ||
                      recordData.walkingDistance ||
                      0}{" "}
                    km
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.label}>활동량</span>
                  <span className={styles.value}>
                    {recordData.activityLevel
                      ? ACTIVITY_LEVEL_MAP[recordData.activityLevel] ||
                        `${recordData.activityLevel} (알 수 없는 활동 수준)`
                      : "설정되지 않음"}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.label}>소모 칼로리</span>
                  <span className={styles.value}>
                    {recordData.caloriesBurned || 0} kcal
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 식사 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/meal.png"
                alt="식사 아이콘"
                className={styles.sectionIcon}
              />
              <h3>식사 활동</h3>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddMeal}
                  className={styles.addMealButton}
                >
                  + 식사 추가
                </button>
              )}
              {!isEditMode && (
                <button
                  className={styles.mealCountButton}
                  onClick={() => setShowMealDetails(!showMealDetails)}
                  title="개별 식사 상세 보기/숨기기"
                >
                  <span className={styles.mealCountText}>
                    {recordData.meals?.length || 0}개
                  </span>
                  <span className={styles.mealCountIcon}>
                    {showMealDetails ? "⌄" : "⌃"}
                  </span>
                </button>
              )}
            </div>

            {isEditMode ? (
              <div className={styles.editForm}>
                <div className={styles.mealsEditSection}>
                  {editMeals.map((meal, index) => (
                    <div
                      key={index}
                      className={styles.mealEditItem}
                      data-meal-index={index}
                    >
                      <div className={styles.mealEditHeader}>
                        <Select
                          options={mealTypeOptions}
                          value={mealTypeOptions.find(
                            (option) => option.value === meal.mealType
                          )}
                          onChange={(selectedOption) => {
                            handleMealChange(
                              index,
                              "mealType",
                              selectedOption?.value || ""
                            );
                          }}
                          placeholder="선택"
                          classNamePrefix="react-select"
                          className={
                            validationErrors[`mealType_${index}`]
                              ? styles.errorSelect
                              : ""
                          }
                          styles={{
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected
                                ? "#fff3e0"
                                : state.isFocused
                                ? "#fff8f0"
                                : "white",
                              color: state.isSelected ? "#f57c00" : "#374151",
                              cursor: "pointer",
                              ":active": {
                                backgroundColor: "#ffe0b2",
                                color: "#e65100",
                              },
                            }),
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "43px",
                              height: "38px",
                              border: "1px solid #d1d5db",
                              borderRadius: "8px",
                              borderColor: state.isFocused
                                ? "#ff9800"
                                : "#d1d5db",
                              boxShadow: state.isFocused
                                ? "0 0 0 3px rgba(255,152,0,0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#ff9800",
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height: "38px",
                              padding: "0 12px",
                              alignItems: "center",
                            }),
                            input: (provided) => ({
                              ...provided,
                              margin: 0,
                              padding: 0,
                            }),
                            indicatorsContainer: (provided) => ({
                              ...provided,
                              height: "38px",
                              alignItems: "center",
                            }),
                            dropdownIndicator: (provided) => ({
                              ...provided,
                              paddingTop: 0,
                              paddingBottom: 0,
                            }),
                            clearIndicator: (provided) => ({
                              ...provided,
                              paddingTop: 0,
                              paddingBottom: 0,
                            }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#adaebc",
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color: "#374151",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              borderRadius: 8,
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              zIndex: 10,
                              marginTop: 0,
                            }),
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMeal(index)}
                          className={styles.removeMealButton}
                        >
                          삭제
                        </button>
                      </div>
                      <div className={styles.mealEditForm}>
                        <div className={styles.formGroup}>
                          <label>총 용량 (g)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={meal.totalWeightG}
                            onChange={(e) =>
                              handleMealChange(
                                index,
                                "totalWeightG",
                                e.target.value
                              )
                            }
                            className={
                              validationErrors[`totalWeightG_${index}`]
                                ? styles.errorInput
                                : ""
                            }
                          />
                          {validationErrors[`totalWeightG_${index}`] && (
                            <div className={styles.errorMessage}>
                              {validationErrors[`totalWeightG_${index}`]}
                            </div>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <label>총 칼로리 (kcal)</label>
                          <input
                            type="number"
                            min="0"
                            value={meal.totalCalories}
                            onChange={(e) =>
                              handleMealChange(
                                index,
                                "totalCalories",
                                e.target.value
                              )
                            }
                            className={
                              validationErrors[`totalCalories_${index}`]
                                ? styles.errorInput
                                : ""
                            }
                          />
                          {validationErrors[`totalCalories_${index}`] && (
                            <div className={styles.errorMessage}>
                              {validationErrors[`totalCalories_${index}`]}
                            </div>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <label>섭취 용량 (g)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={meal.consumedWeightG}
                            onChange={(e) =>
                              handleMealChange(
                                index,
                                "consumedWeightG",
                                e.target.value
                              )
                            }
                            className={
                              validationErrors[`consumedWeightG_${index}`]
                                ? styles.errorInput
                                : ""
                            }
                          />
                          {validationErrors[`consumedWeightG_${index}`] && (
                            <div className={styles.errorMessage}>
                              {validationErrors[`consumedWeightG_${index}`]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 식사 칼로리 자동 계산 결과 */}
                      {meal.totalWeightG &&
                        meal.totalCalories &&
                        meal.consumedWeightG &&
                        editFormData.weight &&
                        editFormData.activityLevel && (
                          <div className={styles.mealCalorieCalculation}>
                            <div className={styles.calorieItem}>
                              <span className={styles.calorieLabel}>
                                계산된 섭취 칼로리:
                              </span>
                              <span className={styles.calorieValue}>
                                {
                                  calculateMealCalories(
                                    meal.totalWeightG,
                                    meal.totalCalories,
                                    meal.consumedWeightG,
                                    editFormData.weight,
                                    editFormData.activityLevel
                                  ).consumedCalories
                                }{" "}
                                kcal
                              </span>
                            </div>
                            <div className={styles.calorieItem}>
                              <span className={styles.calorieLabel}>
                                권장 섭취 칼로리:
                              </span>
                              <span className={styles.calorieValue}>
                                {
                                  calculateMealCalories(
                                    meal.totalWeightG,
                                    meal.totalCalories,
                                    meal.consumedWeightG,
                                    editFormData.weight,
                                    editFormData.activityLevel
                                  ).recommendedIntake
                                }{" "}
                                kcal
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* 식사 요약 정보 */}
                <div className={styles.dataGrid}>
                  <div className={styles.dataItem}>
                    <span className={styles.label}>총 그람수</span>
                    <span className={styles.value}>
                      {recordData.meals?.reduce(
                        (sum, meal) => sum + (meal.totalWeightG || 0),
                        0
                      )}{" "}
                      g
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <span className={styles.label}>총 칼로리</span>
                    <span className={styles.value}>
                      {recordData.meals?.reduce(
                        (sum, meal) => sum + (meal.totalCalories || 0),
                        0
                      )}{" "}
                      kcal
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <span className={styles.label}>섭취량</span>
                    <span className={styles.value}>
                      {recordData.meals?.reduce(
                        (sum, meal) => sum + (meal.consumedWeightG || 0),
                        0
                      )}{" "}
                      g
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <span className={styles.label}>섭취 칼로리</span>
                    <span className={styles.value}>
                      {recordData.meals?.reduce(
                        (sum, meal) => sum + (meal.consumedCalories || 0),
                        0
                      )}{" "}
                      kcal
                    </span>
                  </div>
                </div>

                {/* 개별 식사 상세 정보 */}
                {recordData.meals && recordData.meals.length > 0 && (
                  <div className={styles.mealDetails}>
                    {showMealDetails && (
                      <div className={styles.mealList}>
                        {recordData.meals.map((meal, index) => (
                          <div
                            key={meal.mealNo || index}
                            className={styles.mealItem}
                          >
                            <div className={styles.mealItemHeader}>
                              <span className={styles.mealType}>
                                {meal.mealType === "BREAKFAST" && "아침"}
                                {meal.mealType === "LUNCH" && "점심"}
                                {meal.mealType === "DINNER" && "저녁"}
                                {meal.mealType === "SNACK" && "간식"}
                                {!meal.mealType && "아침"}
                              </span>
                              <span className={styles.mealNumber}>
                                {index + 1}번째
                              </span>
                            </div>
                            <div className={styles.mealItemData}>
                              <div className={styles.mealDataRow}>
                                <span>총 무게:</span>
                                <span>{meal.totalWeightG || 0} g</span>
                              </div>
                              <div className={styles.mealDataRow}>
                                <span>총 칼로리:</span>
                                <span>{meal.totalCalories || 0} kcal</span>
                              </div>
                              <div className={styles.mealDataRow}>
                                <span>섭취 무게:</span>
                                <span>{meal.consumedWeightG || 0} g</span>
                              </div>
                              <div className={styles.mealDataRow}>
                                <span>섭취 칼로리:</span>
                                <span>{meal.consumedCalories || 0} kcal</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* 무게 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/weight.png"
                alt="무게 아이콘"
                className={styles.sectionIcon}
              />
              <h3>무게</h3>
            </div>
            {isEditMode ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>무게 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={editFormData.weight || ""}
                    onChange={(e) => handleFormChange("weight", e.target.value)}
                    className={validationErrors.weight ? styles.errorInput : ""}
                  />
                  {validationErrors.weight && (
                    <div className={styles.errorMessage}>
                      {validationErrors.weight}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.dataGrid}>
                <div className={styles.dataItem}>
                  <span className={styles.label}>무게</span>
                  <span className={styles.value}>
                    {recordData.weightKg || 0} kg
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 수면 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/sleep.png"
                alt="수면 아이콘"
                className={styles.sectionIcon}
              />
              <h3>수면</h3>
            </div>
            {isEditMode ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>수면 시간 (시간)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={editFormData.sleepTime || ""}
                    onChange={(e) =>
                      handleFormChange("sleepTime", e.target.value)
                    }
                    className={
                      validationErrors.sleepTime ? styles.errorInput : ""
                    }
                  />
                  {validationErrors.sleepTime && (
                    <div className={styles.errorMessage}>
                      {validationErrors.sleepTime}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.dataGrid}>
                <div className={styles.dataItem}>
                  <span className={styles.label}>수면 시간</span>
                  <span className={styles.value}>
                    {recordData.sleepHours || 0} 시간
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 배변 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/bathroom.png"
                alt="배변 아이콘"
                className={styles.sectionIcon}
              />
              <h3>배변 활동</h3>
            </div>
            {isEditMode ? (
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>소변 횟수</label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.urineCount || ""}
                      onChange={(e) =>
                        handleFormChange("urineCount", e.target.value)
                      }
                      className={
                        validationErrors.urineCount ? styles.errorInput : ""
                      }
                    />
                    {validationErrors.urineCount && (
                      <div className={styles.errorMessage}>
                        {validationErrors.urineCount}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>대변 횟수</label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.fecesCount || ""}
                      onChange={(e) =>
                        handleFormChange("fecesCount", e.target.value)
                      }
                      className={
                        validationErrors.fecesCount ? styles.errorInput : ""
                      }
                    />
                    {validationErrors.fecesCount && (
                      <div className={styles.errorMessage}>
                        {validationErrors.fecesCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.dataGrid}>
                <div className={styles.dataItem}>
                  <span className={styles.label}>소변 횟수</span>
                  <span className={styles.value}>
                    {recordData.peeCount || 0}회
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.label}>대변 횟수</span>
                  <span className={styles.value}>
                    {recordData.poopCount || 0}회
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 메모 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/note.png"
                alt="메모 아이콘"
                className={styles.sectionIcon}
              />
              <h3>메모</h3>
            </div>
            {isEditMode ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>메모</label>
                  <textarea
                    value={editFormData.memo || ""}
                    onChange={(e) => handleFormChange("memo", e.target.value)}
                    placeholder="추가 사항을 작성하세요."
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.memoContent}>
                {recordData.memo || "메모가 없습니다."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 결과 모달 */}
      <UpdateResultModal
        isOpen={showResultModal}
        onClose={handleResultModalClose}
        isSuccess={isSuccess}
        message={resultMessage}
      />
    </div>
  );
}
