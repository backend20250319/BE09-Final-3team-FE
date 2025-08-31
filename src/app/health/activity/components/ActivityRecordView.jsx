"use client";

import React, { useState } from "react";
import { useSelectedPet } from "../../context/SelectedPetContext";
import { activityOptions } from "../../data/mockData";
import styles from "../styles/ActivityRecordView.module.css";

export default function ActivityRecordView({
  isOpen,
  onClose,
  recordData,
  date,
  selectedPetName,
}) {
  const { pets } = useSelectedPet();
  const [showMealDetails, setShowMealDetails] = useState(false);

  const ACTIVITY_LEVEL_MAP = {
    LOW: "거의 안 움직여요",
    MEDIUM_LOW: "가끔 산책해요",
    MEDIUM_HIGH: "자주 뛰어놀아요",
    HIGH: "매우 활동적이에요",
  };

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
  const avatarSrc = selectedPet?.imageUrl || "/user/dog.png";

  return (
    <div className={styles.overlay} suppressHydrationWarning>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img
              src={avatarSrc}
              alt={`${petName} 프로필`}
              className={styles.avatar}
            />
            <h2 className={styles.title}>{formatDate(date)} 활동 기록</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <img src="/health/close.png" alt="닫기" width={20} height={20} />
          </button>
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
            </div>

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
                            #{index + 1}
                          </span>
                        </div>
                        <div className={styles.mealItemData}>
                          <div className={styles.mealDataRow}>
                            <span>총 그람수:</span>
                            <span>{meal.totalWeightG || 0} g</span>
                          </div>
                          <div className={styles.mealDataRow}>
                            <span>총 칼로리:</span>
                            <span>{meal.totalCalories || 0} kcal</span>
                          </div>
                          <div className={styles.mealDataRow}>
                            <span>섭취량:</span>
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
          </div>

          {/* 기타 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/weight.png"
                alt="기타 아이콘"
                className={styles.sectionIcon}
              />
              <h3>기타 활동</h3>
            </div>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.label}>몸무게</span>
                <span className={styles.value}>
                  {recordData.weightKg || recordData.weight || 0} kg
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>수면 시간</span>
                <span className={styles.value}>
                  {recordData.sleepHours || recordData.sleepTime || 0} 시간
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>소변 횟수</span>
                <span className={styles.value}>
                  {recordData.peeCount || recordData.urineCount || 0} 회
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>대변 횟수</span>
                <span className={styles.value}>
                  {recordData.poopCount || recordData.fecesCount || 0} 회
                </span>
              </div>
            </div>
          </div>

          {/* 메모 */}
          {recordData.memo && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <img
                  src="/health/pencil.png"
                  alt="메모 아이콘"
                  className={styles.sectionIcon}
                />
                <h3>메모</h3>
              </div>
              <div className={styles.memoContent}>{recordData.memo}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
