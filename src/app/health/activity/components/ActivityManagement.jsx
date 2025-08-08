"use client";

import React, { useState, useEffect, useMemo } from "react";
import Select from "./ClientOnlySelect";
import styles from "../styles/ActivityManagement.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import {
  activityOptions,
  validActivityLevels,
  initialFormData,
  initialCalculated,
  formatNumber,
  getTodayKey,
  STORAGE_KEYS,
} from "../../data/mockData";
import SaveCompleteModal from "./SaveCompleteModal";
import SaveConfirmModal from "./SaveConfirmModal";

export default function ActivityManagement() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const { selectedPetName } = useSelectedPet();

  const [formData, setFormData] = useState(initialFormData);

  // 펫 이름별로 저장했는지 상태 관리 (오늘 날짜 key 사용)
  const [submittedPets, setSubmittedPets] = useState({});

  const [calculated, setCalculated] = useState(initialCalculated);

  // 저장 완료 모달 상태
  const [showSaveComplete, setShowSaveComplete] = useState(false);
  // 저장 확인 모달 상태
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 저장 여부 판단용 키
  const todayKey = useMemo(() => getTodayKey(), []);
  const storageKey = useMemo(
    () => STORAGE_KEYS.ACTIVITY_DATA(selectedPetName, todayKey),
    [selectedPetName, todayKey]
  );

  // 현재 선택된 펫이 오늘 저장했는지 여부 (localStorage 기준)
  const isSubmittedToday = !!submittedPets[storageKey];

  // 선택된 펫 혹은 오늘 날짜 바뀌면 저장된 데이터 불러오기
  useEffect(() => {
    if (!selectedPetName) return;

    const savedDataJson = localStorage.getItem(storageKey);
    if (savedDataJson) {
      const savedData = JSON.parse(savedDataJson);
      setFormData({
        walkingDistance: savedData.walkingDistance || "",
        activityLevel: savedData.activityLevel || "",
        totalFoodWeight: savedData.totalFoodWeight || "",
        totalCaloriesInFood: savedData.totalCaloriesInFood || "",
        feedingAmount: savedData.feedingAmount || "",
        weight: savedData.weight || "",
        sleepTime: savedData.sleepTime || "",
        urineCount: savedData.urineCount || "",
        fecesCount: savedData.fecesCount || "",
        memo: savedData.memo || "",
      });
      setSubmittedPets((prev) => ({ ...prev, [storageKey]: true }));
    } else {
      // 저장된 데이터 없으면 초기화
      setFormData({
        walkingDistance: "",
        activityLevel: "",
        totalFoodWeight: "",
        totalCaloriesInFood: "",
        feedingAmount: "",
        weight: "",
        sleepTime: "",
        urineCount: "",
        fecesCount: "",
        memo: "",
      });
      setSubmittedPets((prev) => ({ ...prev, [storageKey]: false }));
    }
  }, [selectedPetName, storageKey]);

  useEffect(() => {
    const weight = parseFloat(formData.weight);
    const walkingDistance = parseFloat(formData.walkingDistance);
    const totalFoodWeight = parseFloat(formData.totalFoodWeight);
    const totalCaloriesInFood = parseFloat(formData.totalCaloriesInFood);
    const feedingAmount = parseFloat(formData.feedingAmount);
    const activityLevel = parseFloat(formData.activityLevel);
    const validWeight = !isNaN(weight) ? weight : 0;

    const caloriePerGram =
      !isNaN(totalCaloriesInFood) &&
      !isNaN(totalFoodWeight) &&
      totalFoodWeight > 0
        ? totalCaloriesInFood / totalFoodWeight
        : 0;

    setCalculated({
      recommendedBurn:
        validWeight && !isNaN(activityLevel)
          ? validWeight * activityLevel * 70
          : 0,
      actualBurn:
        !isNaN(walkingDistance) && !isNaN(activityLevel)
          ? walkingDistance * activityLevel * 5
          : 0,
      recommendedIntake:
        validWeight && !isNaN(activityLevel)
          ? validWeight * activityLevel * 100
          : 0,
      actualIntake:
        !isNaN(feedingAmount) && caloriePerGram > 0
          ? feedingAmount * caloriePerGram
          : 0,
    });
  }, [formData]);

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

  const handleSave = () => {
    const walkingDistanceNum = parseFloat(formData.walkingDistance);
    const activityLevelVal = formData.activityLevel;
    const totalFoodWeightNum = parseFloat(formData.totalFoodWeight);
    const totalCaloriesInFoodNum = parseFloat(formData.totalCaloriesInFood);
    const feedingAmountNum = parseFloat(formData.feedingAmount);
    const weightNum = parseFloat(formData.weight);
    const sleepTimeNum = parseInt(formData.sleepTime, 10);
    const urineCountNum = parseInt(formData.urineCount, 10);
    const fecesCountNum = parseInt(formData.fecesCount, 10);

    if (
      isNaN(walkingDistanceNum) ||
      walkingDistanceNum < 0 ||
      !validActivityLevels.includes(activityLevelVal) ||
      isNaN(totalFoodWeightNum) ||
      totalFoodWeightNum <= 0 ||
      isNaN(totalCaloriesInFoodNum) ||
      totalCaloriesInFoodNum <= 0 ||
      isNaN(feedingAmountNum) ||
      feedingAmountNum < 0 ||
      isNaN(weightNum) ||
      weightNum < 0 ||
      isNaN(sleepTimeNum) ||
      sleepTimeNum < 0 ||
      isNaN(urineCountNum) ||
      urineCountNum < 0 ||
      isNaN(fecesCountNum) ||
      fecesCountNum < 0
    ) {
      alert(
        "모든 숫자 필드는 0 이상의 올바른 값을 입력해주세요.\n활동계수는 1.2, 1.5, 1.7, 1.9 중 선택해야 합니다."
      );
      return;
    }

    if (
      formData.walkingDistance.trim() === "" ||
      formData.activityLevel.trim() === "" ||
      formData.totalFoodWeight.trim() === "" ||
      formData.totalCaloriesInFood.trim() === "" ||
      formData.feedingAmount.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.sleepTime.trim() === "" ||
      formData.urineCount.trim() === "" ||
      formData.fecesCount.trim() === ""
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (isSubmittedToday) {
      alert(`${selectedPetName}은(는) 이미 오늘 기록이 저장되었습니다.`);
      return;
    }

    const walkingCalorie = (
      walkingDistanceNum *
      parseFloat(activityLevelVal) *
      5
    ).toFixed(1);
    const caloriePerGram = totalCaloriesInFoodNum / totalFoodWeightNum;
    const feedingCalorie = (feedingAmountNum * caloriePerGram).toFixed(1);

    // 저장할 데이터에 formData 원본 값도 같이 저장 (불러올 때 사용)
    const dataToSave = {
      petName: selectedPetName,
      walkingDistance: formData.walkingDistance,
      activityLevel: formData.activityLevel,
      totalFoodWeight: formData.totalFoodWeight,
      totalCaloriesInFood: formData.totalCaloriesInFood,
      feedingAmount: formData.feedingAmount,
      weight: formData.weight,
      sleepTime: formData.sleepTime,
      urineCount: formData.urineCount,
      fecesCount: formData.fecesCount,
      memo: formData.memo,
      // 아래는 계산값 (필요 시)
      weightNum,
      walk_calories: parseInt(walkingCalorie, 10),
      eat_calories: parseInt(feedingCalorie, 10),
      sleep_time: sleepTimeNum,
      urine_count: urineCountNum,
      feces_count: fecesCountNum,
      activity_level: parseFloat(activityLevelVal),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      setSubmittedPets((prev) => ({ ...prev, [storageKey]: true }));
      setShowSaveComplete(true);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleCloseSaveComplete = () => {
    setShowSaveComplete(false);
  };

  return (
    <div className={styles.activitySection}>
      {/* 폼 */}
      <div className={styles.activityContent}>
        <div className={styles.activityGrid}>
          {/* 왼쪽 박스 */}
          <div className={styles.leftColumn}>
            {/* 산책 활동 */}
            <div className={`${styles.activityCard} ${styles.walking}`}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img
                    src="/health/footprint.png"
                    alt="발자국 아이콘"
                    className={styles.smallIcon}
                  />
                </div>
                <h3>산책</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="walkingDistance">산책 거리 (km)</label>
                  <input
                    type="number"
                    id="walkingDistance"
                    value={formData.walkingDistance}
                    onChange={handleChange}
                    step={0.1}
                    min={0}
                    disabled={isSubmittedToday}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="activityLevel">활동량</label>
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
                        minHeight: "50px",
                        height: "50px",
                        borderColor: state.isFocused ? "#8bc34a" : "#d1d5db",
                        boxShadow: state.isFocused
                          ? "0 0 0 3px rgba(139,195,74,0.3)"
                          : "none",
                        "&:hover": {
                          borderColor: "#8bc34a",
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
                    <p>권장 소모 칼로리</p>
                    <p className={styles.calorieValue}>
                      {calculated.recommendedBurn > 0
                        ? `${formatNumber(calculated.recommendedBurn)} kcal`
                        : "--"}
                    </p>
                  </div>
                  <div className={styles.calorieItem}>
                    <p>소모 칼로리</p>
                    <p className={styles.calorieValue}>
                      {calculated.actualBurn > 0
                        ? `${formatNumber(calculated.actualBurn)} kcal`
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 식사 활동 */}
            <div className={`${styles.activityCard} ${styles.feeding}`}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/meal.png" alt="식사 아이콘" />
                </div>
                <h3>식사</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.horizontalInputs}>
                  <div className={styles.formGroup}>
                    <label htmlFor="totalFoodWeight">총 그람수 (g)</label>
                    <input
                      type="number"
                      id="totalFoodWeight"
                      value={formData.totalFoodWeight}
                      onChange={handleChange}
                      min={0}
                      disabled={isSubmittedToday}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="totalCaloriesInFood">
                      총 칼로리 (kcal)
                    </label>
                    <input
                      type="number"
                      id="totalCaloriesInFood"
                      value={formData.totalCaloriesInFood}
                      onChange={handleChange}
                      min={0}
                      disabled={isSubmittedToday}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="feedingAmount">섭취량 (g)</label>
                  <input
                    type="number"
                    id="feedingAmount"
                    value={formData.feedingAmount}
                    onChange={handleChange}
                    min={0}
                    disabled={isSubmittedToday}
                  />
                </div>
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
            <div className={`${styles.activityCard} ${styles.weight}`}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/weight.png" alt="무게 아이콘" />
                </div>
                <h3>무게</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="weight">몸무게 (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step={0.1}
                    min={0}
                    disabled={isSubmittedToday}
                  />
                </div>
              </div>
            </div>

            {/* 수면시간 */}
            <div className={`${styles.activityCard} ${styles.sleep}`}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/sleep.png" alt="수면 아이콘" />
                </div>
                <h3>수면</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="sleepTime">수면 시간 (시간)</label>
                  <input
                    type="number"
                    id="sleepTime"
                    value={formData.sleepTime}
                    onChange={handleChange}
                    step={1}
                    min={0}
                    disabled={isSubmittedToday}
                  />
                </div>
              </div>
            </div>

            {/* 배변 활동 */}
            <div className={`${styles.activityCard} ${styles.bathroom}`}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/bathroom.png" alt="배변 활동 아이콘" />
                </div>
                <h3>배변 활동</h3>
              </div>
              <div className={styles.activityForm}>
                <div className={styles.bathroomInputs}>
                  <div className={styles.formGroup}>
                    <label htmlFor="urineCount">소변 횟수</label>
                    <input
                      type="number"
                      id="urineCount"
                      value={formData.urineCount}
                      onChange={handleChange}
                      min={0}
                      step={1}
                      disabled={isSubmittedToday}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="fecesCount">대변 횟수</label>
                    <input
                      type="number"
                      id="fecesCount"
                      value={formData.fecesCount}
                      onChange={handleChange}
                      min={0}
                      step={1}
                      disabled={isSubmittedToday}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div className={`${styles.activityCard} ${styles.notes}`}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}>
                  <img src="/health/pencil.png" alt="메모 아이콘" />
                </div>
                <h3>메모</h3>
              </div>
              <div className={styles.activityForm}>
                <textarea
                  className={`${styles.noResize} ${styles.notesTextarea}`}
                  placeholder="추가 사항을 작성하세요."
                  rows={2}
                  id="memo"
                  value={formData.memo}
                  onChange={handleChange}
                  disabled={isSubmittedToday}
                />
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
        petName={selectedPetName}
        date={todayKey}
      />

      {/* 저장 확인 모달 */}
      <SaveConfirmModal
        isOpen={showSaveConfirm}
        onClose={handleSaveCancel}
        onConfirm={handleSaveConfirm}
        petName={selectedPetName}
        date={todayKey}
      />
    </div>
  );
}
