"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/Activity.module.css";
import PetProfileSelector from "../components/PetProfileSelector";

export default function ActivityManagementPage() {
  const [selectedPet, setSelectedPet] = useState("몽글이");
  const pets = [
    { name: "몽글이", msg: "안녕하세요", src: "/images/buddy-profile.png" },
    { name: "초코", msg: "반갑습니다", src: "/images/luna-profile.png" },
    { name: "차차", msg: "환영해요", src: "/images/max-profile.png" },
  ];

  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const [formData, setFormData] = useState({
    walkingDistance: "",
    activityLevel: "1.2", // 기본값
    totalFoodWeight: "", // 총 음식량 (g)
    totalCaloriesInFood: "", // 총 칼로리 (kcal)
    feedingAmount: "",
    weight: "",
    sleepTime: "",
    urineCount: "",
    fecesCount: "",
    memo: "",
  });

  const validActivityLevels = ["1.2", "1.5", "1.7", "1.9"];

  // 숫자 포맷 함수: 정수면 정수로, 아니면 소수점 1자리까지
  function formatNumber(num) {
    if (Number.isInteger(num)) {
      return num.toString();
    } else {
      return num.toFixed(1);
    }
  }

  // 실시간 계산 결과 상태
  const [calculated, setCalculated] = useState({
    recommendedBurn: 0,
    actualBurn: 0,
    recommendedIntake: 0,
    actualIntake: 0,
  });

  // formData가 바뀔 때마다 계산
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

    const walkingCalorie = (
      walkingDistanceNum *
      parseFloat(activityLevelVal) *
      5
    ).toFixed(1);
    const caloriePerGram = totalCaloriesInFoodNum / totalFoodWeightNum;
    const feedingCalorie = (feedingAmountNum * caloriePerGram).toFixed(1);

    const dataToSave = {
      weight: weightNum,
      walk_calories: parseInt(walkingCalorie, 10),
      eat_calories: parseInt(feedingCalorie, 10),
      sleep_time: sleepTimeNum,
      urine_count: urineCountNum,
      feces_count: fecesCountNum,
      activity_level: parseFloat(activityLevelVal),
      memo: formData.memo,
    };

    console.log("저장할 데이터:", dataToSave);
    setIsSubmittedToday(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.content}>
            {/* 헤더 */}
            <div className={styles.header}>
              <h1 className={styles.title}>건강 관리</h1>
              <p className={styles.subtitle}>
                반려동물의 건강 활동과 의료 기록을 추적하고 관리하세요.
              </p>
            </div>

            {/* 펫 프로필 컴포넌트 */}
            <PetProfileSelector
              pets={pets}
              selectedPetName={selectedPet}
              onSelectPet={setSelectedPet}
            />

            {/* 활동 관리 섹션 */}
            <div className={styles.activitySection}>
              <div className={styles.navTabs}>
                <button className={`${styles.navTab} ${styles.active}`}>
                  활동 관리
                </button>
                <button className={styles.navTab}>리포트</button>
                <div className={styles.navIcon}>
                  <img
                    src="/health/calendar.png"
                    alt="캘린더 아이콘"
                    width={37}
                    height={40}
                    style={{ marginTop: "5px" }}
                  />
                </div>
              </div>

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
                          <label htmlFor="walkingDistance">
                            산책 거리 (km)
                          </label>
                          <input
                            type="number"
                            id="walkingDistance"
                            value={formData.walkingDistance}
                            onChange={handleChange}
                            step={0.1}
                            min={0}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="activityLevel">활동 계수</label>
                          <select
                            id="activityLevel"
                            value={formData.activityLevel}
                            onChange={handleChange}
                            className={styles.customSelect}
                          >
                            <option value="" disabled hidden>
                              선택하세요
                            </option>
                            <option value="1.2">1.2</option>
                            <option value="1.5">1.5</option>
                            <option value="1.7">1.7</option>
                            <option value="1.9">1.9</option>
                          </select>
                        </div>
                        <div className={styles.calorieInfo}>
                          <div className={styles.calorieItem}>
                            <p>권장 소모 칼로리</p>
                            <p className={styles.calorieValue}>
                              {calculated.recommendedBurn > 0
                                ? `${formatNumber(
                                    calculated.recommendedBurn
                                  )} kcal`
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
                            <label htmlFor="totalFoodWeight">
                              총 그람수 (g)
                            </label>
                            <input
                              type="number"
                              id="totalFoodWeight"
                              value={formData.totalFoodWeight}
                              onChange={handleChange}
                              min={0}
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
                          />
                        </div>
                        <div className={styles.calorieInfo}>
                          <div className={styles.calorieItem}>
                            <p>섭취 칼로리</p>
                            <p className={styles.calorieValue}>
                              {calculated.actualIntake > 0
                                ? `${formatNumber(
                                    calculated.actualIntake
                                  )} kcal`
                                : "--"}
                            </p>
                          </div>
                          <div className={styles.calorieItem}>
                            <p>권장 섭취 칼로리</p>
                            <p className={styles.calorieValue}>
                              {calculated.recommendedIntake > 0
                                ? `${formatNumber(
                                    calculated.recommendedIntake
                                  )} kcal`
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
                          />
                        </div>
                      </div>
                    </div>

                    {/* 배변 활동 */}
                    <div
                      className={`${styles.activityCard} ${styles.bathroom}`}
                    >
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <img
                            src="/health/bathroom.png"
                            alt="배변 활동 아이콘"
                          />
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
                          className={styles.noResize}
                          placeholder="추가 사항을 작성하세요."
                          rows={5}
                          id="memo"
                          value={formData.memo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 저장버튼 */}
                <div className={styles.saveSection}>
                  <button className={styles.saveButton} onClick={handleSave}>
                    <img src="/health/save.png" alt="저장 아이콘" />
                    저장
                  </button>
                </div>

                {/* 기록 완료 메시지 오버레이 */}
                {isSubmittedToday && (
                  <div className={styles.overlay}>
                    <div className={styles.overlayMessage}>
                      ✅ 오늘의 기록이 저장되었습니다.
                      <button
                        className={styles.closeButton}
                        onClick={() => setIsSubmittedToday(false)}
                        aria-label="닫기"
                      >
                        <img
                          src="/health/close.png"
                          alt="닫기 아이콘"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
