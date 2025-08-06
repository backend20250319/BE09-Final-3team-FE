"use client";

import React, { useState } from "react";
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
    activityFactor: "",
    caloriePerGram: "",
    feedingAmount: "",
    weight: "",
    sleepTime: "",
    urineCount: "",
    fecesCount: "",
    memo: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    const walkingDistanceNum = parseFloat(formData.walkingDistance);
    const activityFactorNum = parseFloat(formData.activityFactor);
    const caloriePerGramNum = parseFloat(formData.caloriePerGram);
    const feedingAmountNum = parseFloat(formData.feedingAmount);
    const weightNum = parseFloat(formData.weight);
    const sleepTimeNum = parseFloat(formData.sleepTime);
    const urineCountNum = parseFloat(formData.urineCount);
    const fecesCountNum = parseFloat(formData.fecesCount);

    if (
      isNaN(walkingDistanceNum) ||
      walkingDistanceNum < 0 ||
      isNaN(activityFactorNum) ||
      activityFactorNum < 0 ||
      isNaN(caloriePerGramNum) ||
      caloriePerGramNum < 0 ||
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
      alert("모든 숫자 필드는 0 이상 올바른 값을 입력해주세요.");
      return;
    }

    if (
      formData.walkingDistance.trim() === "" ||
      formData.activityFactor.trim() === "" ||
      formData.caloriePerGram.trim() === "" ||
      formData.feedingAmount.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.sleepTime.trim() === "" ||
      formData.urineCount.trim() === "" ||
      formData.fecesCount.trim() === ""
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

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

              {/* 폼은 항상 렌더링 */}
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
                          <label htmlFor="activityFactor">
                            활동 계수 (1-10)
                          </label>
                          <input
                            type="number"
                            id="activityFactor"
                            value={formData.activityFactor}
                            onChange={handleChange}
                            min={1}
                            max={10}
                          />
                        </div>
                        <div className={styles.calorieInfo}>
                          <div className={styles.calorieItem}>
                            <p>권장 소모 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                          <div className={styles.calorieItem}>
                            <p>소모 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
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
                        <div className={styles.formGroup}>
                          <label htmlFor="caloriePerGram">칼로리(kcal)</label>
                          <input
                            type="number"
                            id="caloriePerGram"
                            value={formData.caloriePerGram}
                            onChange={handleChange}
                            min={0}
                          />
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
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                          <div className={styles.calorieItem}>
                            <p>권장 섭취 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽 박스*/}
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
                        <h3>수면 시간</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <div className={styles.formGroup}>
                          <label htmlFor="sleepTime">수면 시간 (시간)</label>
                          <input
                            type="number"
                            id="sleepTime"
                            value={formData.sleepTime}
                            onChange={handleChange}
                            step={0.1}
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
