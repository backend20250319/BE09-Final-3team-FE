"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import styles from "../styles/ActivityReport.module.css";
import { getActivityReport } from "../../../../api/activityApi";
import { useSelectedPet } from "../../context/SelectedPetContext";
import DateRangeCalendar from "./DateRangeCalendar";
import Toast from "../../medical/components/Toast";

// 메트릭 설정 - 2x2 그리드 배치 (산책-식사, 배변-수면)
const activityMetrics = [
  {
    id: 1,
    title: "산책 소모 칼로리",
    icon: "/health/footprint.png",
    colorActual: "#8BC34A",
    colorRecommended: "#AED581",
    type: "bar",
    hasRecommended: true,
  },
  {
    id: 2,
    title: "섭취 칼로리",
    icon: "/health/meal.png",
    colorActual: "#FF9800",
    colorRecommended: "#FFB74D",
    type: "bar",
    hasRecommended: true,
  },
  {
    id: 3,
    title: "배변 횟수",
    icon: "/health/bathroom.png",
    colorActual: "#FF7675",
    colorRecommended: null,
    type: "line",
    hasRecommended: false,
  },
  {
    id: 4,
    title: "수면 시간",
    icon: "/health/sleep.png",
    colorActual: "#6C5CE7",
    colorRecommended: "#A29BFE",
    type: "bar",
    hasRecommended: true,
  },
];

export default function ActivityReport() {
  // 날짜 상태 - 기본값을 당일로 설정 (한국 시간대 기준)
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [reportData, setReportData] = useState({
    daily: { common: [], poop: [] },
    weekly: { common: [], poop: [] },
    monthly: { common: [], poop: [] },
    yearly: { common: [], poop: [] },
  });
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const { selectedPetName, selectedPetNo } = useSelectedPet();

  // 데이터 상태 구분을 위한 상태 추가 - 기본적으로 당일 데이터 조회
  const [hasSelectedPeriod, setHasSelectedPeriod] = useState(true);
  const [backendError, setBackendError] = useState(false);

  // 커스텀 캘린더 관련 상태
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startDateButtonRef, setStartDateButtonRef] = useState(null);
  const [endDateButtonRef, setEndDateButtonRef] = useState(null);

  // 토스트 메시지 상태
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = (selectedStartDate, selectedEndDate) => {
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    setHasSelectedPeriod(true);
  };

  // 시작일 캘린더 열기
  const handleStartDateClick = (e) => {
    e.preventDefault();
    setStartDateButtonRef(e.currentTarget);
    setShowStartCalendar(true);
    setShowEndCalendar(false);
  };

  // 종료일 캘린더 열기
  const handleEndDateClick = (e) => {
    e.preventDefault();
    setEndDateButtonRef(e.currentTarget);
    setShowEndCalendar(true);
    setShowStartCalendar(false);
  };

  // 건강 점수 계산 함수 - 반려동물 맞춤 기준
  const calculateHealthScore = (count, type) => {
    if (type === "pee") {
      // 소변: 반려동물 기준 (3-6회가 정상)
      // 3-6회: 정상 (100점)
      // 2-7회: 양호 (85점)
      // 1-8회: 보통 (70점)
      // 0회: 주의 (30점) - 탈수 위험
      // 9회 이상: 과다 (50점) - 당뇨/신장질환 의심
      if (count >= 3 && count <= 6) return 100;
      if (count >= 2 && count <= 7) return 85;
      if (count >= 1 && count <= 8) return 70;
      if (count === 0) return 30; // 배뇨 부족 - 탈수 위험
      return 50; // 과다 배뇨 - 질환 의심
    } else if (type === "poop") {
      // 대변: 반려동물 기준 (1-3회가 정상)
      // 1-3회: 정상 (100점)
      // 0-4회: 양호 (80점)
      // 0회: 주의 (40점) - 변비 위험
      // 5회 이상: 과다 (60점) - 소화불량 의심
      if (count >= 1 && count <= 3) return 100;
      if (count >= 0 && count <= 4) return 80;
      if (count === 0) return 40; // 배변 부족 - 변비 위험
      return 60; // 과다 배변 - 소화불량 의심
    }
    return 50;
  };

  // 달성률 계산 함수 - 더 합리적인 기준
  const calculateAchievement = (actual, target) => {
    if (target <= 0) return 0;
    const ratio = actual / target;

    // 100% 달성 = 100점
    if (ratio >= 1.0) return 100;
    // 80% 이상 = 80점
    if (ratio >= 0.8) return Math.round(ratio * 100);
    // 60% 이상 = 60점
    if (ratio >= 0.6) return Math.round(ratio * 100);
    // 그 외 = 실제 비율
    return Math.round(ratio * 100);
  };

  // 균형도 계산 함수 - 더 합리적인 기준
  const calculateBalance = (actual, target) => {
    if (target <= 0) return 0;
    const ratio = actual / target;

    // 90-110% = 균형잡힌 상태 (100점)
    if (ratio >= 0.9 && ratio <= 1.1) return 100;
    // 80-120% = 양호한 상태 (80점)
    if (ratio >= 0.8 && ratio <= 1.2) return 80;
    // 70-130% = 보통 상태 (60점)
    if (ratio >= 0.7 && ratio <= 1.3) return 60;
    // 그 외 = 불균형 상태
    return Math.round(ratio * 100);
  };

  // 수면 품질 계산 함수 - 반려동물 맞춤 기준
  const calculateSleepQuality = (actualHours) => {
    if (actualHours <= 0) return 0;

    // 반려동물 수면 기준 (성체 기준)
    // 12-14시간 = 최적 수면 (100점) - 반려동물 정상 패턴
    if (actualHours >= 12 && actualHours <= 14) return 100;
    // 10-16시간 = 양호한 수면 (85점) - 허용 범위
    if (actualHours >= 10 && actualHours <= 16) return 85;
    // 8-18시간 = 보통 수면 (70점) - 정상 범위
    if (actualHours >= 8 && actualHours <= 18) return 70;
    // 6-20시간 = 주의 (50점) - 경계선
    if (actualHours >= 6 && actualHours <= 20) return 50;
    // 그 외 = 부족하거나 과다한 수면 (30점)
    return 30;
  };

  // 날짜 라벨 포맷팅 함수 - n월 n일 형식
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "오늘";

    // displayDate가 '일'인 경우 실제 date 필드 사용
    if (dateStr === "일") {
      return "일";
    }

    try {
      const date = new Date(dateStr);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();

      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (isToday) {
        return `${month}월 ${day}일(오늘)`;
      } else {
        return `${month}월 ${day}일`;
      }
    } catch (error) {
      console.log("날짜 파싱 실패:", dateStr, error);
      return "오늘";
    }
  };

  // 정보 안내 컴포넌트 - 식사활동과 동일한 방식
  const InfoTooltip = ({ title, content }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className={styles.infoContainer}>
        <button
          className={styles.infoButton}
          onClick={() => setShowTooltip((v) => !v)}
          aria-label={`${title} 정보`}
        >
          i
        </button>
        {showTooltip && <div className={styles.infoDropdown}>{content}</div>}
      </div>
    );
  };

  // 백엔드에서 리포트 데이터 가져오기
  useEffect(() => {
    let isMounted = true;

    const fetchReportData = async () => {
      if (!selectedPetName || !selectedPetNo) {
        console.log("펫이 선택되지 않음:", { selectedPetName, selectedPetNo });
        if (isMounted) {
          setNoData(true);
          setHasSelectedPeriod(false);
        }
        return;
      }

      // 날짜가 선택되지 않았을 때는 API 호출하지 않음
      if (!startDate || !endDate) {
        console.log("날짜가 선택되지 않음:", { startDate, endDate });
        if (isMounted) {
          setNoData(true);
          setHasSelectedPeriod(false);
        }
        return;
      }

      try {
        setLoading(true);
        // 단순화된 Chart API 호출
        const data = await getActivityReport(selectedPetNo, startDate, endDate);

        if (data) {
          // 백엔드 에러 응답 확인
          if (data.code === "9000") {
            setBackendError(true);
          } else {
            setBackendError(false);
          }
        }

        // 요약 데이터 설정 (Chart API에서 summaryStats 제공)
        if (data && data.summaryStats) {
          setSummaryData({
            data: {
              summaryStats: data.summaryStats,
              startDate: startDate,
              endDate: endDate,
            },
          });
        } else {
          // summaryStats가 없어도 기본값으로 설정하여 UI가 깨지지 않도록 함
          setSummaryData({
            data: {
              summaryStats: {
                totalDays: 0,
                totalWalkingDistance: 0,
                averageWalkingDistance: 0,
                averageCaloriesBurned: 0,
                averageCaloriesIntake: 0,
                averageSleepHours: 0,
                totalPoopCount: 0,
                totalPeeCount: 0,
                averagePoopCount: 0,
                averagePeeCount: 0,
              },
              startDate: startDate,
              endDate: endDate,
            },
          });
        }

        if (data && data.chartData) {
          const chartData = data.chartData || [];
          // 데이터가 비어있는지 확인
          if (chartData.length === 0) {
            setReportData({
              daily: { common: [], poop: [] },
              weekly: { common: [], poop: [] },
              monthly: { common: [], poop: [] },
              yearly: { common: [], poop: [] },
            });
            setNoData(true);
            return;
          }

          // 데이터가 있지만 실제 값들이 모두 0인지 확인
          const hasValidData = chartData.some((item) => {
            const hasWalkingData = (item.actualCaloriesBurned || 0) > 0;
            const hasMealData = (item.actualCaloriesIntake || 0) > 0;
            const hasBathroomData =
              (item.peeCount || 0) > 0 || (item.poopCount || 0) > 0;
            const hasSleepData = (item.sleepHours || 0) > 0;

            return (
              hasWalkingData || hasMealData || hasBathroomData || hasSleepData
            );
          });

          if (!hasValidData) {
            if (isMounted) {
              setReportData({
                daily: { common: [], poop: [] },
                weekly: { common: [], poop: [] },
                monthly: { common: [], poop: [] },
                yearly: { common: [], poop: [] },
              });
              setNoData(true);
            }
            return;
          }

          // 백엔드 데이터를 프론트엔드 차트 형식으로 변환
          const convertedData = {
            daily: {
              // 산책 소모 칼로리 - 달성률 + 목표 대비 현황
              walking: chartData.map((item) => ({
                date: formatDateLabel(item.date || item.displayDate),
                category: "산책 소모 칼로리",
                actual: item.actualCaloriesBurned || 0,
                target: item.recommendedCaloriesBurned || 0,
                achievement: calculateAchievement(
                  item.actualCaloriesBurned || 0,
                  item.recommendedCaloriesBurned || 0
                ),
              })),
              // 섭취 칼로리 - 균형 분석 + 권장 대비 현황
              meal: chartData.map((item) => ({
                date: formatDateLabel(item.date || item.displayDate),
                category: "섭취 칼로리",
                actual: item.actualCaloriesIntake || 0,
                target: item.recommendedCaloriesIntake || 0,
                balance: calculateBalance(
                  item.actualCaloriesIntake || 0,
                  item.recommendedCaloriesIntake || 0
                ),
              })),
              // 배변 횟수 - 소변과 대변을 하나의 아이템에 포함, 통합 건강점수
              bathroom: chartData.map((item) => {
                const peeScore = calculateHealthScore(
                  item.peeCount || 0,
                  "pee"
                );
                const poopScore = calculateHealthScore(
                  item.poopCount || 0,
                  "poop"
                );
                const overallHealthScore = Math.round(
                  (peeScore + poopScore) / 2
                );

                return {
                  date: formatDateLabel(item.date || item.displayDate),
                  소변: item.peeCount || 0,
                  대변: item.poopCount || 0,
                  통합건강점수: overallHealthScore,
                };
              }),
              // 수면 시간 - 품질 점수 포함
              sleep: chartData.map((item) => {
                const actualHours = item.sleepHours > 0 ? item.sleepHours : 12;
                const quality = calculateSleepQuality(actualHours);
                return {
                  date: formatDateLabel(item.date || item.displayDate),
                  category: "수면 시간",
                  actual: actualHours,
                  recommended: 13.0, // 반려동물 권장 수면 시간 (13시간)
                  quality: quality, // 수면 품질 점수
                };
              }),
            },
            weekly: {
              common: chartData.map((item) => ({
                week: item.displayDate,
                actualValue: item.actualCaloriesBurned || 0,
                recommendedValue: item.recommendedCaloriesBurned || 0,
              })),
              poop: chartData.map((item) => ({
                week: item.displayDate,
                소변: item.peeCount || 0,
                대변: item.poopCount || 0,
              })),
            },
            monthly: {
              common: chartData.map((item) => ({
                month: item.displayDate,
                actualValue: item.actualCaloriesBurned || 0,
                recommendedValue: item.recommendedCaloriesBurned || 0,
              })),
              poop: chartData.map((item) => ({
                month: item.displayDate,
                소변: item.peeCount || 0,
                대변: item.poopCount || 0,
              })),
            },
            yearly: {
              common: chartData.map((item) => ({
                year: item.displayDate,
                actualValue: item.actualCaloriesBurned || 0,
                recommendedValue: item.recommendedCaloriesBurned || 0,
              })),
              poop: chartData.map((item) => ({
                year: item.displayDate,
                소변: item.peeCount || 0,
                대변: item.poopCount || 0,
              })),
            },
          };

          setReportData(convertedData);
          if (isMounted) {
            setNoData(false);
            setHasSelectedPeriod(true);
          }
        } else {
          console.log("=== 차트 데이터 없음 디버깅 ===");
          console.log("data:", data);
          console.log("data.chartData:", data?.chartData);
          console.log("data가 null인가?", data === null);
          console.log("data가 undefined인가?", data === undefined);
          console.log("data가 객체인가?", typeof data === "object");
          console.log("data의 키들:", data ? Object.keys(data) : "N/A");
          console.log("백엔드에서 데이터가 없을 경우 - 기본값으로 설정");

          // 차트 데이터가 없어도 기본 구조로 설정하여 UI가 깨지지 않도록 함
          setReportData({
            daily: { common: [], poop: [] },
            weekly: { common: [], poop: [] },
            monthly: { common: [], poop: [] },
            yearly: { common: [], poop: [] },
          });

          if (isMounted) {
            setNoData(true);
            setHasSelectedPeriod(true); // 데이터가 없어도 선택된 기간으로 표시
          }
        }
      } catch (error) {
        console.error("리포트 데이터 조회 실패:", error);
        if (isMounted) {
          setReportData({
            daily: { common: [], poop: [] },
            weekly: { common: [], poop: [] },
            monthly: { common: [], poop: [] },
            yearly: { common: [], poop: [] },
          });
          setNoData(true);

          // 에러 메시지 표시
          if (error.message.includes("최대 7일까지")) {
            setToastMessage("최대 7일까지 조회 가능합니다.");
            setToastType("error");
            setShowToast(true);
          } else if (error.message.includes("잘못된 날짜 범위")) {
            setToastMessage("잘못된 날짜 범위입니다.");
            setToastType("error");
            setShowToast(true);
          } else if (error.message.includes("서버 내부 오류")) {
            setToastMessage(
              "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
            setToastType("error");
            setShowToast(true);
          } else {
            setToastMessage("데이터를 불러오는 중 오류가 발생했습니다.");
            setToastType("error");
            setShowToast(true);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReportData();

    return () => {
      isMounted = false;
    };
  }, [selectedPetName, selectedPetNo, startDate, endDate]);

  function getDataAndKey(metric) {
    // noData 상태이거나 reportData가 아직 초기화되지 않았거나 undefined인 경우 빈 배열 반환
    if (noData || !reportData || !reportData.daily) {
      console.log(`${metric.title} - getDataAndKey에서 빈 데이터 반환:`, {
        noData,
        hasReportData: !!reportData,
        hasDaily: !!reportData?.daily,
      });
      return {
        data: [],
        xKey: "date",
      };
    }

    // 일별 데이터만 사용 (단순화)
    const getData = (dataType) => {
      if (!reportData.daily) return [];

      let data = [];
      switch (dataType) {
        case "walking":
          data = reportData.daily.walking || [];
          break;
        case "meal":
          data = reportData.daily.meal || [];
          break;
        case "bathroom":
          data = reportData.daily.bathroom || [];
          break;
        case "sleep":
          data = reportData.daily.sleep || [];
          break;
        default:
          data = reportData.daily.common || [];
      }

      // 데이터가 있지만 실제 값들이 모두 0인지 확인
      if (data.length > 0) {
        const hasValidValues = data.some((item) => {
          if (dataType === "walking")
            return (item.actual || 0) > 0 || (item.target || 0) > 0;
          if (dataType === "meal")
            return (item.actual || 0) > 0 || (item.target || 0) > 0;
          if (dataType === "bathroom")
            return (item.소변 || 0) > 0 || (item.대변 || 0) > 0;
          if (dataType === "sleep") return (item.actual || 0) > 0;
          return true;
        });

        if (!hasValidValues) {
          console.log(
            `${dataType} 데이터가 있지만 실제 값들이 모두 0입니다:`,
            data
          );
          return [];
        }
      }

      return data;
    };

    return {
      data:
        metric.title === "산책 소모 칼로리"
          ? getData("walking")
          : metric.title === "섭취 칼로리"
          ? getData("meal")
          : metric.title === "배변 횟수"
          ? getData("bathroom")
          : metric.title === "수면 시간"
          ? getData("sleep")
          : getData("common"),
      xKey: "date",
    };
  }

  // ✅ 커스텀 툴팁 컴포넌트 - 모든 차트에 적용
  const CustomTooltip = ({ active, payload, label, metricTitle }) => {
    if (active && payload && payload.length) {
      // 각 차트별 순서 정의
      const getOrder = (metricTitle) => {
        switch (metricTitle) {
          case "산책 소모 칼로리":
            return { 권장량: 1, 소모량: 2, "달성률(%)": 3 };
          case "섭취 칼로리":
            return { 권장량: 1, 식사량: 2, "균형도(%)": 3 };
          case "배변 횟수":
            return { 소변: 1, 대변: 2, 통합건강점수: 3 };
          case "수면 시간":
            return { "권장 수면": 1, "실제 수면": 2, "수면 품질(%)": 3 };
          default:
            return {};
        }
      };

      // 단위 정의
      const getUnit = (metricTitle, dataKey) => {
        // 퍼센트 값들
        if (
          dataKey === "achievement" ||
          dataKey === "balance" ||
          dataKey === "quality"
        ) {
          return "%";
        }

        // 차트별 기본 단위
        switch (metricTitle) {
          case "산책 소모 칼로리":
            return dataKey === "target" || dataKey === "actual" ? "kcal" : "";
          case "섭취 칼로리":
            return dataKey === "target" || dataKey === "actual" ? "kcal" : "";
          case "수면 시간":
            return dataKey === "actual" || dataKey === "recommended"
              ? "시간"
              : "";
          case "배변 횟수":
            return dataKey === "소변" || dataKey === "대변" ? "회" : "";
          default:
            return "";
        }
      };

      // 순서에 따라 정렬
      const order = getOrder(metricTitle);
      const sortedPayload = payload.sort((a, b) => {
        return (order[a.name] || 999) - (order[b.name] || 999);
      });

      return (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            zIndex: 10000,
            minWidth: "120px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: "600",
              fontSize: "13px",
              color: "#374151",
            }}
          >
            {label}
          </p>
          {sortedPayload.map((entry, index) => {
            const unit = getUnit(metricTitle, entry.dataKey);
            return (
              <p
                key={index}
                style={{
                  margin: "4px 0",
                  color: entry.color,
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: entry.color,
                    display: "inline-block",
                  }}
                />
                {entry.name}: {entry.value}
                {unit && ` ${unit}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // ✅ Tooltip 포맷 함수
  const customTooltipFormatter = (metricTitle) => (value, name) => {
    const labelMap = {
      "섭취 칼로리": {
        actualValue: "식사량",
        recommendedValue: "권장량",
      },
      "산책 소모 칼로리": {
        actualValue: "소모량",
        recommendedValue: "권장량",
      },
      "수면 시간": {
        actualValue: "실제 수면",
        recommendedValue: "권장 수면",
        quality: "수면 품질",
      },
      "배변 횟수": {
        소변: "소변",
        대변: "대변",
      },
    };

    const unitMap = {
      "섭취 칼로리": "kcal",
      "산책 소모 칼로리": "kcal",
      "수면 시간": "시간",
      "배변 횟수": "회",
    };

    const label = labelMap[metricTitle]?.[name] || name;
    const unit = unitMap[metricTitle] || "";

    return [`${value} ${unit}`, label];
  };

  return (
    <section className={styles.activityReportSection} suppressHydrationWarning>
      {selectedPetName && selectedPetNo && (
        <div className={styles.dateRangeContainer}>
          <div className={styles.dateRangeHeader}>
            {/* 날짜 선택기 */}
            <div className={styles.datePickerContainer}>
              <div className={styles.dateInputGroup}>
                <label htmlFor="startDate">시작일</label>
                <button
                  type="button"
                  className={styles.dateButton}
                  onClick={handleStartDateClick}
                >
                  {startDate ? startDate : "시작일 선택"}
                </button>
              </div>
              <div className={styles.dateInputGroup}>
                <label htmlFor="endDate">종료일</label>
                <button
                  type="button"
                  className={styles.dateButton}
                  onClick={handleEndDateClick}
                >
                  {endDate ? endDate : "종료일 선택"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 커스텀 캘린더 컴포넌트들 */}
      <DateRangeCalendar
        isOpen={showStartCalendar}
        onClose={() => setShowStartCalendar(false)}
        onDateRangeSelect={handleDateRangeSelect}
        startDate={startDate}
        endDate={endDate}
        buttonRef={startDateButtonRef}
        maxDays={7}
      />

      <DateRangeCalendar
        isOpen={showEndCalendar}
        onClose={() => setShowEndCalendar(false)}
        onDateRangeSelect={handleDateRangeSelect}
        startDate={startDate}
        endDate={endDate}
        buttonRef={endDateButtonRef}
        maxDays={7}
      />

      {/* 백엔드 에러 메시지 */}
      {backendError && (
        <div className={styles.errorMessage}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorText}>
            <strong>서버 오류가 발생했습니다.</strong>
            <br />
            백엔드에서 데이터를 불러오는 중 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </div>
        </div>
      )}

      {/* 요약 통계 표시 영역 - 데이터가 있을 때만 표시 */}
      {selectedPetName &&
        selectedPetNo &&
        summaryData &&
        summaryData.data &&
        !noData && (
          <div className={styles.summaryStats}>
            <div className={styles.summaryCard}>
              <h4>총 활동 일수</h4>
              <span>{summaryData.data.summaryStats?.totalDays || 0}일</span>
            </div>
            <div className={styles.summaryCard}>
              <h4>평균 산책 거리</h4>
              <span>
                {Math.round(
                  summaryData.data.summaryStats?.averageWalkingDistance || 0
                )}
                km
              </span>
            </div>
            <div className={styles.summaryCard}>
              <h4>평균 소모 칼로리</h4>
              <span>
                {Math.round(
                  summaryData.data.summaryStats?.averageCaloriesBurned || 0
                )}
                kcal
              </span>
            </div>
            <div className={styles.summaryCard}>
              <h4>기간</h4>
              <span>
                {summaryData.data.startDate} ~ {summaryData.data.endDate}
              </span>
            </div>
          </div>
        )}

      {!selectedPetName || !selectedPetNo ? (
        <div className={styles.noPetArea}>
          <div className={styles.noPetIcon}>🐕</div>
          <div className={styles.noPetText}>
            <h3>반려동물을 선택해주세요</h3>
            <p>활동 리포트를 보려면 먼저 반려동물을 선택해주세요!</p>
          </div>
        </div>
      ) : loading && hasSelectedPeriod ? (
        <div className={styles.loadingContainer}>
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : noData ? (
        <div className={styles.noDataContainer}>
          <div className={styles.noDataIcon}>📊</div>
          {!hasSelectedPeriod ? (
            <>
              <h3>기간을 설정하면 리포트를 볼 수 있습니다!</h3>
              <p>위의 드롭다운에서 원하는 기간을 선택해주세요.</p>
              <p>선택한 기간에 맞는 활동 리포트가 표시됩니다.</p>
            </>
          ) : (
            <>
              <h3>기록된 데이터가 없습니다!</h3>
              <p>
                {selectedPetName}의 선택한 기간에 활동 데이터가 기록되지
                않았습니다.
              </p>
              <p>다른 기간을 선택하거나 활동을 기록해보세요.</p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.metricsGrid}>
          {console.log(
            "차트 렌더링 시작 - noData:",
            noData,
            "hasSelectedPeriod:",
            hasSelectedPeriod,
            "reportData:",
            reportData
          )}
          {noData || !hasSelectedPeriod
            ? // noData 상태이거나 기간이 선택되지 않았을 때는 모든 메트릭에 "데이터 없음" 메시지 표시
              activityMetrics.map((metric) => (
                <div key={metric.id} className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <div className={styles.metricIcon}>
                      <img
                        src={metric.icon}
                        alt={metric.title}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span className={styles.metricTitle}>{metric.title}</span>
                  </div>
                  <div className={styles.noDataMessage}>
                    <p>
                      {!hasSelectedPeriod
                        ? "기간을 선택해주세요"
                        : "데이터가 없습니다"}
                    </p>
                  </div>
                </div>
              ))
            : activityMetrics.map((metric) => {
                const { data, xKey } = getDataAndKey(metric);

                console.log(
                  `${metric.title} - 데이터:`,
                  data,
                  "xKey:",
                  xKey,
                  "noData:",
                  noData,
                  "데이터 상세:",
                  data.map((item) => ({
                    date: item.date,
                    actual: item.actual,
                    target: item.target,
                    achievement: item.achievement,
                    balance: item.balance,
                    소변: item.소변,
                    대변: item.대변,
                    통합건강점수: item.통합건강점수,
                    recommended: item.recommended,
                  }))
                );

                // noData 상태이거나 기간이 선택되지 않았을 때는 차트를 완전히 차단
                if (noData || !hasSelectedPeriod) {
                  console.log(
                    `${metric.title} - noData 또는 기간 미선택 상태로 차트 차단`
                  );
                  return (
                    <div key={metric.id} className={styles.metricCard}>
                      <div className={styles.metricHeader}>
                        <div className={styles.metricIcon}>
                          <img
                            src={metric.icon}
                            alt={metric.title}
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className={styles.metricTitle}>
                          {metric.title}
                        </span>
                      </div>
                      <div className={styles.noDataMessage}>
                        <p>데이터가 없습니다</p>
                      </div>
                    </div>
                  );
                }

                // 데이터가 없을 때 메시지 표시
                if (!data || data.length === 0) {
                  if (loading) {
                    // 로딩 중일 때는 로딩 표시
                    return (
                      <div key={metric.id} className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                          <div className={styles.metricIcon}>
                            <img
                              src={metric.icon}
                              alt={metric.title}
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className={styles.metricTitle}>
                            {metric.title}
                          </span>
                        </div>
                        <div className={styles.loadingMessage}>
                          <p>데이터를 불러오는 중...</p>
                        </div>
                      </div>
                    );
                  } else {
                    // 로딩이 끝났는데 데이터가 없을 때만 "데이터 없음" 표시
                    console.log(`${metric.title} 데이터 없음:`, data);
                    return (
                      <div key={metric.id} className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                          <div className={styles.metricIcon}>
                            <img
                              src={metric.icon}
                              alt={metric.title}
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className={styles.metricTitle}>
                            {metric.title}
                          </span>
                        </div>
                        <div className={styles.noDataMessage}>
                          <p>데이터가 없습니다</p>
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <div key={metric.id} className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricIcon}>
                        <img
                          src={metric.icon}
                          alt={metric.title}
                          width={24}
                          height={24}
                        />
                      </div>
                      <span className={styles.metricTitle}>{metric.title}</span>
                      {metric.title === "산책 소모 칼로리" && (
                        <InfoTooltip
                          title="산책 소모 칼로리 기준"
                          content="일반적인 성체 반려동물 기준입니다. 품종과 크기에 따라 다를 수 있으며, 품종별 맞춤 기준 업데이트를 준비 중입니다."
                        />
                      )}
                      {metric.title === "섭취 칼로리" && (
                        <InfoTooltip
                          title="섭취 칼로리 기준"
                          content="일반적인 성체 반려동물 기준입니다. 품종과 크기에 따라 다를 수 있으며, 품종별 맞춤 기준 업데이트를 준비 중입니다."
                        />
                      )}
                      {metric.title === "배변 횟수" && (
                        <InfoTooltip
                          title="배변 횟수 기준"
                          content="일반적인 성체 반려동물 기준입니다. 소변 3-6회, 대변 1-3회가 정상입니다. 품종별 맞춤 기준 업데이트를 준비 중입니다."
                        />
                      )}
                      {metric.title === "수면 시간" && (
                        <InfoTooltip
                          title="수면 시간 기준"
                          content="일반적인 성체 반려동물 기준입니다. 권장 수면 시간은 13시간이며, 품종별 맞춤 기준 업데이트를 준비 중입니다."
                        />
                      )}
                    </div>

                    <div
                      className={`${styles.metricChart} ${
                        metric.title === "배변 횟수"
                          ? styles.shiftChartLeft
                          : ""
                      }`}
                    >
                      {metric.type === "bar" && (
                        <ResponsiveContainer width="100%" height={150}>
                          <ComposedChart
                            data={data}
                            barCategoryGap="20%"
                            barGap={4}
                          >
                            <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                              content={(props) => (
                                <CustomTooltip
                                  {...props}
                                  metricTitle={metric.title}
                                />
                              )}
                              contentStyle={{
                                zIndex: 10000,
                                position: "relative",
                              }}
                              wrapperStyle={{
                                zIndex: 10000,
                              }}
                            />

                            {metric.title === "산책 소모 칼로리" && (
                              <>
                                {/* 권장량 (막대) - 첫 번째 */}
                                <Bar
                                  yAxisId="left"
                                  dataKey="target"
                                  fill={metric.colorRecommended}
                                  name="권장량"
                                  radius={[4, 4, 0, 0]}
                                />
                                {/* 실제 소모량 (막대) - 두 번째 */}
                                <Bar
                                  yAxisId="left"
                                  dataKey="actual"
                                  fill={metric.colorActual}
                                  name="소모량"
                                  radius={[4, 4, 0, 0]}
                                />
                                {/* 달성률 (선) - 세 번째 */}
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="achievement"
                                  stroke="#3B82F6"
                                  strokeWidth={2}
                                  strokeDasharray="3,3"
                                  name="달성률(%)"
                                  dot={{ r: 3, fill: "#3B82F6" }}
                                />
                              </>
                            )}

                            {metric.title === "섭취 칼로리" && (
                              <>
                                {/* 권장 섭취량 (막대) */}
                                <Bar
                                  yAxisId="left"
                                  dataKey="target"
                                  fill={metric.colorRecommended}
                                  name="권장량"
                                  radius={[4, 4, 0, 0]}
                                />
                                {/* 실제 섭취량 (막대) */}
                                <Bar
                                  yAxisId="left"
                                  dataKey="actual"
                                  fill={metric.colorActual}
                                  name="식사량"
                                  radius={[4, 4, 0, 0]}
                                />
                                {/* 균형도 (선) */}
                                <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="balance"
                                  stroke="#E91E63"
                                  strokeDasharray="3,3"
                                  name="균형도(%)"
                                  strokeWidth={2}
                                />
                              </>
                            )}

                            {metric.title === "수면 시간" && (
                              <>
                                {/* 권장 수면 시간 (막대) */}
                                <Bar
                                  yAxisId="left"
                                  dataKey="recommended"
                                  fill={metric.colorRecommended}
                                  name="권장 수면"
                                  radius={[4, 4, 0, 0]}
                                />
                                {/* 실제 수면 시간 (막대) */}
                                <Bar
                                  yAxisId="left"
                                  dataKey="actual"
                                  fill={metric.colorActual}
                                  name="실제 수면"
                                  radius={[4, 4, 0, 0]}
                                />
                                {/* 수면 품질 (선) */}
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="quality"
                                  stroke="#9C27B0"
                                  strokeDasharray="3,3"
                                  name="수면 품질(%)"
                                  strokeWidth={2}
                                />
                              </>
                            )}

                            <Legend verticalAlign="bottom" height={36} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      )}
                      {metric.type === "line" && (
                        <ResponsiveContainer width="100%" height={150}>
                          <ComposedChart
                            data={data}
                            barCategoryGap="20%"
                            barGap={4}
                          >
                            <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                              content={(props) => (
                                <CustomTooltip
                                  {...props}
                                  metricTitle={metric.title}
                                />
                              )}
                              contentStyle={{
                                zIndex: 10000,
                                position: "relative",
                              }}
                              wrapperStyle={{
                                zIndex: 10000,
                              }}
                            />

                            {/* 소변 횟수 (파란색 막대) */}
                            <Bar
                              yAxisId="left"
                              dataKey="소변"
                              fill="#42A5F5"
                              name="소변 횟수"
                              radius={[4, 4, 0, 0]}
                            />

                            {/* 대변 횟수 (주황색 막대) */}
                            <Bar
                              yAxisId="left"
                              dataKey="대변"
                              fill="#FF7043"
                              name="대변 횟수"
                              radius={[4, 4, 0, 0]}
                            />

                            {/* 통합 건강점수 (점선) */}
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="통합건강점수"
                              stroke="#4CAF50"
                              strokeDasharray="3,3"
                              name="통합 건강점수"
                              dot={{ r: 3, fill: "#4CAF50" }}
                            />

                            <Legend verticalAlign="bottom" height={36} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      )}
                      {metric.type === "area" && (
                        <ResponsiveContainer width="100%" height={150}>
                          <ComposedChart data={data}>
                            <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                              contentStyle={{
                                zIndex: 10000,
                                position: "relative",
                              }}
                              wrapperStyle={{
                                zIndex: 10000,
                              }}
                            />

                            {/* 실제 수면 시간 (막대) */}
                            <Bar
                              yAxisId="left"
                              dataKey="actual"
                              fill={metric.colorActual}
                              name="수면 시간"
                            />

                            {/* 권장 수면 시간 (선) */}
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="recommended"
                              stroke="#E91E63"
                              strokeDasharray="5,5"
                              name="권장 시간"
                            />

                            <Legend verticalAlign="bottom" height={36} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      )}

      {/* 토스트 메시지 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  );
}
