"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Select from "./ClientOnlySelect";
import styles from "../styles/ActivityManagement.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import {
  initialFormData,
  initialCalculated,
  formatNumber,
} from "../../constants";
import {
  saveActivityData,
  getActivityData,
  getActivityLevels,
} from "../../../../api/activityApi";
import SaveCompleteModal from "./SaveCompleteModal";
import SaveConfirmModal from "./SaveConfirmModal";

export default function ActivityManagement() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const { selectedPetName, selectedPetNo } = useSelectedPet();

  const [formData, setFormData] = useState({
    ...initialFormData,
    mealType: "", // 기본값을 빈 문자열로 변경
  });

  // 다중 식사 관리
  const [meals, setMeals] = useState([]);
  const [showMealInfo, setShowMealInfo] = useState(false);

  // 식사 타입 옵션 (드롭다운용 - 선택 옵션 제외)
  const mealTypeOptions = [
    { value: "BREAKFAST", label: "아침" },
    { value: "LUNCH", label: "점심" },
    { value: "DINNER", label: "저녁" },
    { value: "SNACK", label: "간식" },
  ];

  // 활동량 옵션
  const [activityOptions, setActivityOptions] = useState([]);
  const [validActivityLevels, setValidActivityLevels] = useState([]);

  // 산책 정보 안내
  const [showWalkInfo, setShowWalkInfo] = useState(false);

  const [calculated, setCalculated] = useState(initialCalculated);

  // 칼로리 계산 결과 상태 추가
  const [calorieCalculations, setCalorieCalculations] = useState({
    walkingCalorie: 0,
    recommendedCalorie: 0,
  });

  // 저장 완료 모달 상태
  const [showSaveComplete, setShowSaveComplete] = useState(false);
  // 저장 확인 모달 상태
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 유효성 검사 오류 상태
  const [validationErrors, setValidationErrors] = useState({});

  // 현재 선택된 펫이 오늘 저장했는지 여부 (백엔드 데이터 존재 여부로 판단)
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);

  // 활동량 옵션을 백엔드에서 가져오기
  useEffect(() => {
    const fetchActivityLevels = async () => {
      try {
        const levels = await getActivityLevels();
        console.log("활동량 옵션 API 응답:", levels);

        // levels가 배열인지 확인
        if (Array.isArray(levels)) {
          setActivityOptions(levels);
          setValidActivityLevels(levels.map((level) => level.value));
        } else {
          console.warn("활동량 옵션이 배열이 아닙니다:", levels);
          // 기본값 설정
          const defaultLevels = [
            { value: "LOW", label: "거의 안 움직여요" },
            { value: "MEDIUM_LOW", label: "가끔 산책해요" },
            { value: "MEDIUM_HIGH", label: "자주 뛰어놀아요" },
            { value: "HIGH", label: "매우 활동적이에요" },
          ];
          setActivityOptions(defaultLevels);
          setValidActivityLevels(defaultLevels.map((level) => level.value));
        }
      } catch (error) {
        console.error("활동량 옵션 로딩 실패:", error);
        // 에러 시 기본값 설정
        const defaultLevels = [
          { value: "LOW", label: "거의 안 움직여요" },
          { value: "MEDIUM_LOW", label: "가끔 산책해요" },
          { value: "MEDIUM_HIGH", label: "자주 뛰어놀아요" },
          { value: "HIGH", label: "매우 활동적이에요" },
        ];
        setActivityOptions(defaultLevels);
        setValidActivityLevels(defaultLevels.map((level) => level.value));
      }
    };

    fetchActivityLevels();
  }, []);

  // 선택된 펫 혹은 오늘 날짜 바뀌면 저장된 데이터 불러오기
  useEffect(() => {
    if (!selectedPetName || !selectedPetNo) return;

    const fetchActivityData = async () => {
      try {
        // 한국 시간대 기준으로 오늘 날짜 계산
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayString = `${year}-${month}-${day}`;

        if (!selectedPetNo) return;
        const savedData = await getActivityData(todayString, selectedPetNo);

        if (savedData && savedData.activityNo) {
          console.log("🔍 저장된 데이터 로드:", savedData);
          console.log("🔍 저장된 식사 데이터:", savedData.meals);

          setFormData({
            walkingDistance: savedData.walkingDistanceKm?.toString() || "",
            activityLevel: savedData.activityLevel?.toString() || "",
            totalFoodWeight: "", // 백엔드에서 별도로 관리
            totalCaloriesInFood: "", // 백엔드에서 별도로 관리
            feedingAmount: "", // 백엔드에서 별도로 관리
            weight: savedData.weightKg?.toString() || "",
            sleepTime: savedData.sleepHours?.toString() || "",
            urineCount: savedData.peeCount?.toString() || "",
            fecesCount: savedData.poopCount?.toString() || "",
            memo: savedData.memo || "",
          });
          // 저장된 식사 목록 보정 (백엔드에서 meals 배열로 제공)
          const loadedMeals = Array.isArray(savedData.meals)
            ? savedData.meals
            : [];
          console.log("🔍 로드된 식사 배열:", loadedMeals);

          const normalizedMeals = loadedMeals.map((m) => {
            return {
              mealType: m.mealType || "BREAKFAST",
              totalFoodWeight: m.totalWeightG || "",
              totalCaloriesInFood: m.totalCalories || "",
              feedingAmount: m.consumedWeightG || "",
              intakeKcal: m.consumedCalories || 0,
            };
          });
          console.log("🔍 정규화된 식사 배열:", normalizedMeals);

          setMeals(normalizedMeals);
          setIsSubmittedToday(true);
        } else {
          // 저장된 데이터 없으면 초기화
          setFormData({
            walkingDistance: "",
            activityLevel: "",
            mealType: "",
            totalFoodWeight: "",
            totalCaloriesInFood: "",
            feedingAmount: "",
            weight: "",
            sleepTime: "",
            urineCount: "",
            fecesCount: "",
            memo: "",
          });
          setMeals([]);
          setIsSubmittedToday(false);
        }
      } catch (error) {
        console.error("활동 데이터 조회 실패:", error);
        // 에러 발생 시 초기화
        setFormData({
          walkingDistance: "",
          activityLevel: "",
          mealType: "",
          totalFoodWeight: "",
          totalCaloriesInFood: "",
          feedingAmount: "",
          weight: "",
          sleepTime: "",
          urineCount: "",
          fecesCount: "",
          memo: "",
        });
        setMeals([]);
        setIsSubmittedToday(false);
      }
    };

    fetchActivityData();
  }, [selectedPetName, selectedPetNo]);

  // 칼로리 계산 함수 (useEffect보다 먼저 정의)
  const calculateCalories = useCallback(() => {
    if (
      !formData.walkingDistance ||
      !formData.activityLevel ||
      !formData.weight
    ) {
      setCalorieCalculations({ walkingCalorie: 0, recommendedCalorie: 0 });
      return;
    }

    const walkingDistance = parseFloat(formData.walkingDistance);
    const weight = parseFloat(formData.weight);

    // 백엔드에서 가져온 활동량 옵션에서 numericValue 사용
    const selectedActivityLevel = activityOptions.find(
      (opt) => opt.value === formData.activityLevel
    );
    const activityLevelNum = selectedActivityLevel?.numericValue || 1.5;

    // 산책 소모 칼로리 계산
    const walkingCalorie = (walkingDistance * activityLevelNum * 5).toFixed(1);

    // 권장 소모 칼로리 계산 (몸무게 기반)
    const recommendedCalorie = Math.round(weight * 30);

    setCalorieCalculations({
      walkingCalorie: parseFloat(walkingCalorie),
      recommendedCalorie,
    });
  }, [
    formData.walkingDistance,
    formData.activityLevel,
    formData.weight,
    activityOptions,
  ]);

  // 식사 칼로리 계산 함수
  const calculateMealCalories = useCallback(() => {
    if (!formData.weight || !formData.activityLevel) {
      return { actualIntake: 0, recommendedIntake: 0 };
    }

    const weight = parseFloat(formData.weight);

    // 백엔드에서 가져온 활동량 옵션에서 numericValue 사용
    const selectedActivityLevel = activityOptions.find(
      (opt) => opt.value === formData.activityLevel
    );
    const activityLevelNum = selectedActivityLevel?.numericValue || 1.5;

    // 저장된 식사들의 총 섭취 칼로리 합산
    const mealsIntake = meals.reduce((sum, m) => {
      const intake = typeof m.intakeKcal === "number" ? m.intakeKcal : 0;
      return sum + intake;
    }, 0);

    // 권장 섭취 칼로리 계산 (몸무게 × 활동계수 × 100)
    const recommendedIntake = Math.round(weight * activityLevelNum * 100);

    return {
      actualIntake: mealsIntake,
      recommendedIntake,
    };
  }, [formData.weight, formData.activityLevel, meals, activityOptions]);

  // 폼 데이터 변경 시 칼로리 계산
  useEffect(() => {
    calculateCalories();
  }, [calculateCalories]);

  useEffect(() => {
    const weight = parseFloat(formData.weight);
    const walkingDistance = parseFloat(formData.walkingDistance);
    const validWeight = !isNaN(weight) ? weight : 0;

    // 활동량 옵션에서 numericValue 가져오기
    const selectedActivityLevel = activityOptions.find(
      (opt) => opt.value === formData.activityLevel
    );
    const activityLevelNum = selectedActivityLevel?.numericValue || 1.5;

    // 저장된 식사들의 총 섭취 칼로리 합산
    const mealsIntake = meals.reduce((sum, m) => {
      const intake = typeof m.intakeKcal === "number" ? m.intakeKcal : 0;
      return sum + intake;
    }, 0);

    // 현재 입력 중인 식사의 칼로리 미리보기
    const totalFoodWeight = parseFloat(formData.totalFoodWeight);
    const totalCaloriesInFood = parseFloat(formData.totalCaloriesInFood);
    const feedingAmount = parseFloat(formData.feedingAmount);

    const currentMealIntake =
      !isNaN(totalFoodWeight) &&
      totalFoodWeight > 0 &&
      !isNaN(totalCaloriesInFood) &&
      !isNaN(feedingAmount)
        ? feedingAmount * (totalCaloriesInFood / totalFoodWeight)
        : 0;

    setCalculated({
      recommendedBurn:
        validWeight && activityLevelNum
          ? validWeight * activityLevelNum * 70
          : 0,
      actualBurn:
        !isNaN(walkingDistance) && activityLevelNum
          ? walkingDistance * activityLevelNum * 5
          : 0,
      recommendedIntake:
        validWeight && activityLevelNum
          ? validWeight * activityLevelNum * 100
          : 0,
      actualIntake: mealsIntake + currentMealIntake,
    });
  }, [
    formData.weight,
    formData.walkingDistance,
    formData.activityLevel,
    formData.totalFoodWeight,
    formData.totalCaloriesInFood,
    formData.feedingAmount,
    meals,
    activityOptions,
  ]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveClick = () => {
    setShowSaveConfirm(true);
  };

  const handleSaveConfirm = () => {
    setShowSaveConfirm(false);
    handleSave();
  };

  const handleSaveCancel = () => {
    setShowSaveConfirm(false);
  };

  const handleSave = async () => {
    const walkingDistanceNum = parseFloat(formData.walkingDistance);
    const activityLevelVal = formData.activityLevel;
    const weightNum = parseFloat(formData.weight);
    const sleepTimeNum = parseInt(formData.sleepTime, 10);
    const urineCountNum = parseInt(formData.urineCount, 10);
    const fecesCountNum = parseInt(formData.fecesCount, 10);

    // 유효성 검사 오류 초기화
    const errors = {};

    // 필수 입력 검사
    if (formData.walkingDistance.trim() === "") {
      errors.walkingDistance = "산책 거리를 입력해주세요.";
    } else if (isNaN(walkingDistanceNum) || walkingDistanceNum < 0) {
      errors.walkingDistance = "0 이상의 올바른 값을 입력해주세요.";
    }

    if (formData.activityLevel.trim() === "") {
      errors.activityLevel = "활동량을 선택해주세요.";
    } else if (!validActivityLevels.includes(activityLevelVal)) {
      errors.activityLevel = "올바른 활동량을 선택해주세요.";
    }

    // 식사 유효성: 저장 시에는 1개 이상 추가되어 있어야 함
    const currentTotalFoodWeightNum = parseFloat(formData.totalFoodWeight);
    const currentTotalCaloriesInFoodNum = parseFloat(
      formData.totalCaloriesInFood
    );
    const currentFeedingAmountNum = parseFloat(formData.feedingAmount);

    // 식사 타입 유효성 검사 (현재 입력 중인 식사가 있을 때만)
    if (
      formData.totalFoodWeight.trim() !== "" ||
      formData.totalCaloriesInFood.trim() !== "" ||
      formData.feedingAmount.trim() !== ""
    ) {
      if (formData.mealType.trim() === "") {
        errors.mealType = "식사 타입을 선택해주세요.";
      }
    }

    if (formData.weight.trim() === "") {
      errors.weight = "몸무게를 입력해주세요.";
    } else if (isNaN(weightNum) || weightNum < 0) {
      errors.weight = "0 이상의 올바른 값을 입력해주세요.";
    }

    if (formData.sleepTime.trim() === "") {
      errors.sleepTime = "수면 시간을 입력해주세요.";
    } else if (isNaN(sleepTimeNum) || sleepTimeNum < 0) {
      errors.sleepTime = "0 이상의 올바른 값을 입력해주세요.";
    }

    if (formData.urineCount.trim() === "") {
      errors.urineCount = "소변 횟수를 입력해주세요.";
    } else if (isNaN(urineCountNum) || urineCountNum < 0) {
      errors.urineCount = "0 이상의 올바른 값을 입력해주세요.";
    }

    if (formData.fecesCount.trim() === "") {
      errors.fecesCount = "대변 횟수를 입력해주세요.";
    } else if (isNaN(fecesCountNum) || fecesCountNum < 0) {
      errors.fecesCount = "0 이상의 올바른 값을 입력해주세요.";
    }

    // 오류가 있으면 validationErrors 설정하고 함수 종료
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // 오류가 없으면 validationErrors 초기화
    setValidationErrors({});

    if (isSubmittedToday) {
      alert(`${selectedPetName}은(는) 이미 오늘 기록이 저장되었습니다.`);
      return;
    }

    // 백엔드에서 가져온 활동량 옵션에서 numericValue 사용
    const selectedActivityLevel = activityOptions.find(
      (opt) => opt.value === activityLevelVal
    );
    const activityLevelNum = selectedActivityLevel?.numericValue || 1.5;
    const walkingCalorie = (walkingDistanceNum * activityLevelNum * 5).toFixed(
      1
    );

    // 저장용 식사 목록 구성: 추가된 식사들이 우선, 없고 현재 입력이 유효하면 현재 입력 1건 포함
    let mealsToSave = meals;
    if (
      meals.length === 0 &&
      !isNaN(currentTotalFoodWeightNum) &&
      currentTotalFoodWeightNum > 0 &&
      !isNaN(currentTotalCaloriesInFoodNum) &&
      currentTotalCaloriesInFoodNum > 0 &&
      !isNaN(currentFeedingAmountNum) &&
      currentFeedingAmountNum >= 0
    ) {
      const intake =
        currentFeedingAmountNum *
        (currentTotalCaloriesInFoodNum / currentTotalFoodWeightNum);
      mealsToSave = [
        {
          mealType: formData.mealType || "BREAKFAST", // 현재 선택된 값 또는 기본값
          totalFoodWeight: currentTotalFoodWeightNum,
          totalCaloriesInFood: currentTotalCaloriesInFoodNum,
          feedingAmount: currentFeedingAmountNum,
          intakeKcal: intake,
        },
      ];
    }

    if (mealsToSave.length === 0) {
      alert("식사 정보를 최소 1개 이상 추가해주세요.");
      return;
    }

    const feedingCalorieTotal = mealsToSave.reduce((sum, m) => {
      const intake =
        typeof m.intakeKcal === "number"
          ? m.intakeKcal
          : (() => {
              const w = parseFloat(m.totalFoodWeight);
              const c = parseFloat(m.totalCaloriesInFood);
              const a = parseFloat(m.feedingAmount);
              return !isNaN(w) && w > 0 && !isNaN(c) && !isNaN(a)
                ? a * (c / w)
                : 0;
            })();
      return sum + intake;
    }, 0);

    // 백엔드 API 형식에 맞게 데이터 변환 (한국 시간대 기준)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    const dataToSave = {
      petNo: selectedPetNo,
      activityDate: todayString,
      walkingDistanceKm: parseFloat(formData.walkingDistance),
      activityLevel: formData.activityLevel, // enum 문자열 그대로 전송 (LOW, MEDIUM_LOW, MEDIUM_HIGH, HIGH)
      weightKg: parseFloat(formData.weight),
      sleepHours: parseInt(formData.sleepTime),
      poopCount: parseInt(formData.fecesCount),
      peeCount: parseInt(formData.urineCount),
      memo: formData.memo,
      meals: mealsToSave.map((meal) => ({
        mealType: meal.mealType,
        totalWeightG: parseFloat(meal.totalFoodWeight), // 백엔드 필드명에 맞춤
        totalCalories: parseFloat(meal.totalCaloriesInFood),
        consumedWeightG: parseFloat(meal.feedingAmount), // 백엔드 필드명에 맞춤
        consumedCalories: parseFloat(meal.intakeKcal),
      })),
    };

    try {
      // 백엔드 API로 저장
      await saveActivityData(dataToSave);
      setIsSubmittedToday(true);
      setShowSaveComplete(true);

      // 저장 완료 후 데이터 다시 불러오기 (한국 시간대 기준)
      const savedData = await getActivityData(todayString, selectedPetNo);

      if (savedData && savedData.activityNo) {
        console.log("🔍 저장 후 데이터 다시 로드:", savedData);
        console.log("🔍 저장 후 식사 데이터:", savedData.meals);

        // 식사 데이터 업데이트
        const loadedMeals = Array.isArray(savedData.meals)
          ? savedData.meals
          : [];
        const normalizedMeals = loadedMeals.map((m) => {
          return {
            mealType: m.mealType || "BREAKFAST",
            totalFoodWeight: m.totalWeightG || "",
            totalCaloriesInFood: m.totalCalories || "",
            feedingAmount: m.consumedWeightG || "",
            intakeKcal: m.consumedCalories || 0,
          };
        });
        console.log("🔍 저장 후 정규화된 식사 배열:", normalizedMeals);
        setMeals(normalizedMeals);
      }

      // 저장 완료 후 자동 새로고침 제거 - 사용자가 확인 버튼을 눌러야 함
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleCloseSaveComplete = () => {
    setShowSaveComplete(false);
  };

  // 식사 추가/삭제
  const handleAddMeal = () => {
    if (isSubmittedToday) return;
    const w = parseFloat(formData.totalFoodWeight);
    const c = parseFloat(formData.totalCaloriesInFood);
    const a = parseFloat(formData.feedingAmount);

    const errs = { ...validationErrors };
    let hasError = false;
    if (!formData.mealType || formData.mealType.trim() === "") {
      errs.mealType = "식사 타입을 선택해주세요.";
      hasError = true;
    } else {
      delete errs.mealType;
    }

    if (formData.totalFoodWeight.trim() === "" || isNaN(w) || w <= 0) {
      errs.totalFoodWeight = "0보다 큰 값을 입력해주세요.";
      hasError = true;
    } else {
      delete errs.totalFoodWeight;
    }
    if (formData.totalCaloriesInFood.trim() === "" || isNaN(c) || c <= 0) {
      errs.totalCaloriesInFood = "0보다 큰 값을 입력해주세요.";
      hasError = true;
    } else {
      delete errs.totalCaloriesInFood;
    }
    if (formData.feedingAmount.trim() === "" || isNaN(a) || a < 0) {
      errs.feedingAmount = "0 이상의 올바른 값을 입력해주세요.";
      hasError = true;
    } else {
      delete errs.feedingAmount;
    }

    if (hasError) {
      setValidationErrors(errs);
      return;
    }

    setValidationErrors(errs);
    const intake = a * (c / w);
    setMeals((prev) => [
      ...prev,
      {
        mealType: formData.mealType || "BREAKFAST",
        totalFoodWeight: w,
        totalCaloriesInFood: c,
        feedingAmount: a,
        intakeKcal: intake,
      },
    ]);
    // 다음 입력을 위해 초기화
    setFormData((prev) => ({
      ...prev,
      totalFoodWeight: "",
      totalCaloriesInFood: "",
      feedingAmount: "",
      mealType: "", // 기본값을 빈 문자열로 리셋
    }));
  };

  const handleRemoveMeal = (index) => {
    if (isSubmittedToday) return;
    setMeals((prev) => prev.filter((_, i) => i !== index));
  };

  // 펫이 선택되지 않았을 때 메시지 표시
  if (!selectedPetName || !selectedPetNo) {
    return (
      <div className={styles.container}>
        <div className={styles.noPetSection}>
          <div className={styles.noPetArea}>
            <div className={styles.noPetIcon}>🐕</div>
            <div className={styles.noPetText}>
              <h3>반려동물을 선택해주세요</h3>
              <p>활동 기록을 관리하려면 먼저 반려동물을 선택해주세요!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.activitySection} ${
        isSubmittedToday ? styles.saved : ""
      }`}
      suppressHydrationWarning
    >
      {/* 폼 */}
      <div className={styles.activityContent}>
        {/* 전체 페이지 저장 상태 헤더 */}
        {isSubmittedToday && (
          <div className={styles.pageSavedHeader}>
            <div className={styles.savedHeaderContent}>
              <span className={styles.savedHeaderIcon}>✓</span>
              <span className={styles.savedHeaderText}>
                오늘의 활동 기록이 저장되었습니다
              </span>
            </div>
          </div>
        )}

        <div className={styles.activityGrid}>
          {/* 왼쪽 박스 */}
          <div className={styles.leftColumn}>
            {/* 산책 활동 */}
            <div
              className={`${styles.activityCard} ${styles.walking} ${
                isSubmittedToday ? styles.saved : ""
              }`}
            >
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img
                    src="/health/footprint.png"
                    alt="발자국 아이콘"
                    className={styles.smallIcon}
                  />
                </div>
                <h3>산책</h3>
                <button
                  type="button"
                  className={styles.infoButton}
                  onClick={() => setShowWalkInfo((v) => !v)}
                  aria-label="산책 정보 안내"
                >
                  i
                </button>
                {showWalkInfo && (
                  <div className={styles.infoDropdown}>
                    권장 소모 칼로리는 활동량을 선택해야 표시됩니다.
                  </div>
                )}
              </div>
              <div className={styles.activityForm}>
                <div
                  className={`${styles.formGroup} ${
                    isSubmittedToday ? styles.saved : ""
                  }`}
                >
                  <label
                    htmlFor="walkingDistance"
                    className={
                      validationErrors.walkingDistance ? styles.errorLabel : ""
                    }
                  >
                    산책 거리 (km)
                  </label>
                  <input
                    type="number"
                    id="walkingDistance"
                    value={formData.walkingDistance}
                    onChange={handleChange}
                    step={0.1}
                    min={0}
                    disabled={isSubmittedToday}
                    className={
                      validationErrors.walkingDistance ? styles.errorInput : ""
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label
                    htmlFor="activityLevel"
                    className={
                      validationErrors.activityLevel ? styles.errorLabel : ""
                    }
                  >
                    활동량
                  </label>
                  <Select
                    id="activityLevel"
                    options={activityOptions}
                    value={activityOptions.find(
                      (option) => option.value === formData.activityLevel
                    )}
                    onChange={(selectedOption) => {
                      setFormData((prev) => ({
                        ...prev,
                        activityLevel: selectedOption?.value || "",
                      }));
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
                        minHeight: "50px",
                        height: "50px",
                        borderColor: state.isFocused ? "#ff9800" : "#d1d5db",
                        boxShadow: state.isFocused
                          ? "0 0 0 3px rgba(255,152,0,0.3)"
                          : "none",
                        "&:hover": {
                          borderColor: "#ff9800",
                        },
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        height: "50px",
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
                        height: "50px",
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
                      }),
                    }}
                    isDisabled={isSubmittedToday}
                  />
                </div>
                <div className={styles.calorieInfo}>
                  <div className={styles.calorieItem}>
                    <p>소모 칼로리</p>
                    <p className={styles.calorieValue}>
                      {calorieCalculations.walkingCalorie > 0
                        ? `${formatNumber(
                            calorieCalculations.walkingCalorie
                          )} kcal`
                        : "--"}
                    </p>
                  </div>
                  <div className={styles.calorieItem}>
                    <p>권장 소모 칼로리</p>
                    <p className={styles.calorieValue}>
                      {calorieCalculations.recommendedCalorie > 0
                        ? `${formatNumber(
                            calorieCalculations.recommendedCalorie
                          )} kcal`
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 식사 활동 */}
            <div
              className={`${styles.activityCard} ${styles.feeding} ${
                isSubmittedToday ? styles.saved : ""
              }`}
            >
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/meal.png" alt="식사 아이콘" />
                </div>
                <h3>식사</h3>
                <button
                  type="button"
                  className={styles.infoButton}
                  onClick={() => setShowMealInfo((v) => !v)}
                  aria-label="식사 정보 안내"
                >
                  i
                </button>
                {showMealInfo && (
                  <div className={styles.infoDropdown}>
                    하나의 음식의 총 칼로리와 총 무게를 적어주세요
                    <br />
                    권장 섭취 칼로리는 활동량을 선택해야 표시됩니다.
                  </div>
                )}
                {!isSubmittedToday && (
                  <div className={styles.headerRight}>
                    <button
                      type="button"
                      className={styles.addMealButton}
                      onClick={handleAddMeal}
                    >
                      식사 추가
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.activityForm}>
                {/* 식사 입력 폼 - 저장된 데이터가 아닐 때만 표시 */}
                {!isSubmittedToday && (
                  <>
                    <div className={styles.horizontalInputs}>
                      <div className={styles.formGroup}>
                        <label
                          htmlFor="mealType"
                          className={
                            validationErrors.mealType ? styles.errorLabel : ""
                          }
                        >
                          식사 타입
                        </label>
                        <Select
                          id="mealType"
                          options={mealTypeOptions}
                          value={mealTypeOptions.find(
                            (option) => option.value === formData.mealType
                          )}
                          onChange={(selectedOption) => {
                            setFormData((prev) => ({
                              ...prev,
                              mealType: selectedOption?.value || "",
                            }));
                          }}
                          placeholder="선택"
                          classNamePrefix="react-select"
                          className={
                            validationErrors.mealType ? styles.errorSelect : ""
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
                              minHeight: "50px",
                              height: "50px",
                              borderColor: state.isFocused
                                ? "#ff9800"
                                : "#d1d5db",
                              boxShadow: state.isFocused
                                ? "0 0 0 3px rgba(255,152,0,0.3)"
                                : "none",
                              "&:hover": {
                                borderColor: "#ff9800",
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height: "50px",
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
                              height: "50px",
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
                              whiteSpace: "nowrap",
                              minWidth: "40px",
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
                            }),
                          }}
                          isDisabled={isSubmittedToday}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label
                          htmlFor="totalFoodWeight"
                          className={
                            validationErrors.totalFoodWeight
                              ? styles.errorLabel
                              : ""
                          }
                        >
                          총 용량 (g)
                        </label>
                        <input
                          type="number"
                          id="totalFoodWeight"
                          value={formData.totalFoodWeight}
                          onChange={handleChange}
                          min={0}
                          disabled={isSubmittedToday}
                          className={
                            validationErrors.totalFoodWeight
                              ? styles.errorInput
                              : ""
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label
                          htmlFor="totalCaloriesInFood"
                          className={
                            validationErrors.totalCaloriesInFood
                              ? styles.errorLabel
                              : ""
                          }
                        >
                          총 칼로리 (kcal)
                        </label>
                        <input
                          type="number"
                          id="totalCaloriesInFood"
                          value={formData.totalCaloriesInFood}
                          onChange={handleChange}
                          min={0}
                          disabled={isSubmittedToday}
                          className={
                            validationErrors.totalCaloriesInFood
                              ? styles.errorInput
                              : ""
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="feedingAmount"
                        className={
                          validationErrors.feedingAmount
                            ? styles.errorLabel
                            : ""
                        }
                      >
                        섭취량 (g)
                      </label>
                      <input
                        type="number"
                        id="feedingAmount"
                        value={formData.feedingAmount}
                        onChange={handleChange}
                        min={0}
                        disabled={isSubmittedToday}
                        className={
                          validationErrors.feedingAmount
                            ? styles.errorInput
                            : ""
                        }
                      />
                    </div>
                  </>
                )}

                {/* 식사 리스트 - 저장된 데이터가 있을 때 항상 표시 */}
                {console.log(
                  "🔍 식사 리스트 렌더링 - meals:",
                  meals,
                  "isSubmittedToday:",
                  isSubmittedToday
                )}
                {meals.length > 0 && (
                  <ul className={styles.mealList}>
                    {meals.map((m, idx) => {
                      const intake =
                        typeof m.intakeKcal === "number" ? m.intakeKcal : 0;
                      return (
                        <li key={idx} className={styles.mealItem}>
                          <div className={styles.mealSummary}>
                            <span className={styles.mealType}>
                              {mealTypeOptions.find(
                                (opt) => opt.value === m.mealType
                              )?.label || "아침"}
                            </span>
                            <span>
                              총 {m.totalFoodWeight}g / {m.totalCaloriesInFood}
                              kcal
                            </span>
                            <span>섭취 {m.feedingAmount}g</span>
                            <span>칼로리 {formatNumber(intake)} kcal</span>
                          </div>
                          {!isSubmittedToday && (
                            <button
                              type="button"
                              className={styles.removeMealButton}
                              onClick={() => handleRemoveMeal(idx)}
                            >
                              삭제
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* 저장된 데이터가 없을 때 안내 메시지 */}
                {isSubmittedToday && meals.length === 0 && (
                  <div className={styles.noMealsMessage}>
                    저장된 식사 기록이 없습니다.
                  </div>
                )}
                <div className={styles.calorieInfo}>
                  <div className={styles.calorieItem}>
                    <p>섭취 칼로리</p>
                    <p className={styles.calorieValue}>
                      {calculated.actualIntake > 0
                        ? `${formatNumber(calculated.actualIntake)} kcal`
                        : "--"}
                    </p>
                  </div>
                  <div className={styles.calorieItem}>
                    <p>권장 섭취 칼로리</p>
                    <p className={styles.calorieValue}>
                      {calculated.recommendedIntake > 0
                        ? `${formatNumber(calculated.recommendedIntake)} kcal`
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 박스 */}
          <div className={styles.rightColumn}>
            {/* 무게 */}
            <div
              className={`${styles.activityCard} ${styles.weight} ${
                isSubmittedToday ? styles.saved : ""
              }`}
            >
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/weight.png" alt="무게 아이콘" />
                </div>
                <h3>무게</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.formGroup}>
                  <label
                    htmlFor="weight"
                    className={validationErrors.weight ? styles.errorLabel : ""}
                  >
                    몸무게 (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step={0.1}
                    min={0}
                    disabled={isSubmittedToday}
                    className={validationErrors.weight ? styles.errorInput : ""}
                  />
                </div>
              </div>
            </div>

            {/* 수면시간 */}
            <div
              className={`${styles.activityCard} ${styles.sleep} ${
                isSubmittedToday ? styles.saved : ""
              }`}
            >
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/sleep.png" alt="수면 아이콘" />
                </div>
                <h3>수면</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.formGroup}>
                  <label
                    htmlFor="sleepTime"
                    className={
                      validationErrors.sleepTime ? styles.errorLabel : ""
                    }
                  >
                    수면 시간 (시간)
                  </label>
                  <input
                    type="number"
                    id="sleepTime"
                    value={formData.sleepTime}
                    onChange={handleChange}
                    step={1}
                    min={0}
                    disabled={isSubmittedToday}
                    className={
                      validationErrors.sleepTime ? styles.errorInput : ""
                    }
                  />
                </div>
              </div>
            </div>

            {/* 배변 활동 */}
            <div
              className={`${styles.activityCard} ${styles.bathroom} ${
                isSubmittedToday ? styles.saved : ""
              }`}
            >
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/bathroom.png" alt="배변 활동 아이콘" />
                </div>
                <h3>배변 활동</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.bathroomInputs}>
                  <div className={styles.formGroup}>
                    <label
                      htmlFor="urineCount"
                      className={
                        validationErrors.urineCount ? styles.errorLabel : ""
                      }
                    >
                      소변 횟수
                    </label>
                    <input
                      type="number"
                      id="urineCount"
                      value={formData.urineCount}
                      onChange={handleChange}
                      min={0}
                      step={1}
                      disabled={isSubmittedToday}
                      className={
                        validationErrors.urineCount ? styles.errorInput : ""
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label
                      htmlFor="fecesCount"
                      className={
                        validationErrors.fecesCount ? styles.errorLabel : ""
                      }
                    >
                      대변 횟수
                    </label>
                    <input
                      type="number"
                      id="fecesCount"
                      value={formData.fecesCount}
                      onChange={handleChange}
                      min={0}
                      step={1}
                      disabled={isSubmittedToday}
                      className={
                        validationErrors.fecesCount ? styles.errorInput : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div
              className={`${styles.activityCard} ${styles.notes} ${
                isSubmittedToday ? styles.saved : ""
              }`}
            >
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/pencil.png" alt="메모 아이콘" />
                </div>
                <h3>메모</h3>
              </div>
              <div className={styles.activityForm}>
                {isSubmittedToday &&
                (!formData.memo || formData.memo.trim() === "") ? (
                  <div className={styles.noMemoMessage}>
                    오늘은 기재한 메모가 없습니다.
                  </div>
                ) : (
                  <div className={styles.formGroup}>
                    <textarea
                      className={`${styles.noResize} ${styles.notesTextarea}`}
                      placeholder="추가 사항을 작성하세요."
                      rows={1}
                      id="memo"
                      value={formData.memo}
                      onChange={handleChange}
                      disabled={isSubmittedToday}
                      maxLength={50}
                    />
                    <div className={styles.characterCount}>
                      {formData.memo.length}/50
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 저장버튼 */}
        {!isSubmittedToday && (
          <div className={styles.saveSection}>
            <button className={styles.saveButton} onClick={handleSaveClick}>
              <img src="/health/save.png" alt="저장 아이콘" />
              저장
            </button>
          </div>
        )}
      </div>

      {/* 저장 완료 모달 */}
      <SaveCompleteModal
        isOpen={showSaveComplete}
        onClose={handleCloseSaveComplete}
        onConfirm={() => {
          // 저장 완료 후 캘린더 상태 업데이트를 위한 콜백
          handleCloseSaveComplete();
          // 부모 컴포넌트에 저장 완료 알림
          if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({ type: "ACTIVITY_SAVED" }, "*");
          }
        }}
        petName={selectedPetName}
        date={(() => {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })()}
      />

      {/* 저장 확인 모달 */}
      <SaveConfirmModal
        isOpen={showSaveConfirm}
        onClose={handleSaveCancel}
        onConfirm={handleSaveConfirm}
        petName={selectedPetName}
        date={(() => {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })()}
      />
    </div>
  );
}
