"use client";

import React, { useState, useEffect } from "react";
import { useSelectedPet } from "../../context/SelectedPetContext";
// activityOptions는 더 이상 사용하지 않음
import { updateActivityData } from "../../../../api/activityApi";
import UpdateResultModal from "./UpdateResultModal";
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
  };

  // 식사 삭제
  const handleRemoveMeal = (index) => {
    setEditMeals((prev) => prev.filter((_, i) => i !== index));
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
    <div className={styles.overlay} suppressHydrationWarning>
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

        <div className={styles.content}>
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
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>활동량</label>
                    <select
                      value={editFormData.activityLevel || ""}
                      onChange={(e) =>
                        handleFormChange("activityLevel", e.target.value)
                      }
                    >
                      {activityLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                    <div key={index} className={styles.mealEditItem}>
                      <div className={styles.mealEditHeader}>
                        <select
                          value={meal.mealType}
                          onChange={(e) =>
                            handleMealChange(index, "mealType", e.target.value)
                          }
                        >
                          <option value="BREAKFAST">아침</option>
                          <option value="LUNCH">점심</option>
                          <option value="DINNER">저녁</option>
                          <option value="SNACK">간식</option>
                        </select>
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
                          />
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
                          />
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
                          />
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
                  <button
                    type="button"
                    onClick={handleAddMeal}
                    className={styles.addMealButton}
                  >
                    + 식사 추가
                  </button>
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
                  />
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
                  />
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
                    />
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
                    />
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
