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
import {
  getActivityReport,
  getActivitySummary,
} from "../../../../api/activityApi";
import { useSelectedPet } from "../../context/SelectedPetContext";

// 메트릭 설정 - 사용자가 자주 볼 것 같은 핵심 차트만
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
    title: "배변 횟수",
    icon: "/health/bathroom.png",
    colorActual: "#FF7675",
    colorRecommended: null,
    type: "line",
    hasRecommended: false,
  },
];

export default function ActivityReport() {
  const [mainPeriod, setMainPeriod] = useState("선택");
  const [subPeriod, setSubPeriod] = useState("");
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [reportData, setReportData] = useState({
    daily: { common: [], poop: [] },
    weekly: { common: [], poop: [] },
    monthly: { common: [], poop: [] },
    yearly: { common: [], poop: [] },
  });
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const { selectedPetName, selectedPetNo } = useSelectedPet();

  // 데이터 상태 구분을 위한 상태 추가
  const [hasSelectedPeriod, setHasSelectedPeriod] = useState(false);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.dropdownContainer}`)) {
        setShowMainDropdown(false);
        setShowSubDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 2단계 드롭다운을 위한 기간 옵션 구조
  const periodOptions = {
    일별: [
      { key: "TODAY", label: "오늘", periodType: "TODAY", apiType: "summary" },
      {
        key: "LAST_3_DAYS",
        label: "최근 3일",
        periodType: "LAST_3_DAYS",
        apiType: "summary",
      },
      {
        key: "LAST_7_DAYS",
        label: "최근 7일",
        periodType: "LAST_7_DAYS",
        apiType: "summary",
      },
    ],
    주별: [
      {
        key: "THIS_WEEK",
        label: "이번 주",
        periodType: "THIS_WEEK",
        apiType: "summary",
      },
      { key: "WEEK", label: "주간별", periodType: "WEEK", apiType: "chart" },
    ],
    월별: [
      {
        key: "THIS_MONTH",
        label: "이번 달",
        periodType: "THIS_MONTH",
        apiType: "summary",
      },
      { key: "MONTH", label: "월별", periodType: "MONTH", apiType: "chart" },
    ],
    "사용자 지정": [
      {
        key: "CUSTOM",
        label: "날짜 선택",
        periodType: "CUSTOM",
        apiType: "summary",
      },
    ],
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

  // 날짜 라벨 포맷팅 함수
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "일";

    // displayDate가 '일'인 경우 실제 date 필드 사용
    if (dateStr === "일") {
      return "오늘";
    }

    try {
      const date = new Date(dateStr);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();

      if (isToday) {
        return `${date.getDate()}일(오늘)`;
      } else {
        return `${date.getDate()}일`;
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
    let isMounted = true; // 컴포넌트 마운트 상태 추적
    let isFetching = false; // API 호출 중복 방지

    const fetchReportData = async () => {
      // 중복 API 호출 방지
      if (isFetching) {
        console.log("이미 API 호출 중입니다. 중복 실행 차단");
        return;
      }

      console.log(
        "API 호출 시작 - isFetching:",
        isFetching,
        "isMounted:",
        isMounted
      );

      // useEffect 중복 실행 방지를 위한 추가 체크
      if (isMounted === false) {
        console.log("컴포넌트가 언마운트되었습니다. API 호출 중단");
        return;
      }

      // 새로운 요약 API 호출 함수
      const fetchActivitySummary = async () => {
        if (!selectedPetNo) return;

        try {
          const summary = await getActivitySummary(
            selectedPetNo,
            selectedPeriod
          );
          console.log("활동 요약 데이터:", summary);
          setSummaryData(summary);
        } catch (error) {
          console.error("활동 요약 데이터 조회 실패:", error);
        }
      };

      // 사용자 지정 기간 데이터 조회 함수
      const fetchCustomPeriodData = async () => {
        if (!selectedPetNo || !customStartDate || !customEndDate) return;

        try {
          setLoading(true);
          const summary = await getActivitySummary(
            selectedPetNo,
            "CUSTOM",
            customStartDate,
            customEndDate
          );
          console.log("사용자 지정 기간 요약 데이터:", summary);

          if (summary && summary.data) {
            setSummaryData(summary);
            // 차트 데이터도 함께 설정
            if (summary.data.activities) {
              const chartData = {
                chartData: summary.data.activities,
                periodType: "CUSTOM",
              };
              // 차트 데이터 처리 로직 호출
              processChartData(chartData);
            }
          }
        } catch (error) {
          console.error("사용자 지정 기간 데이터 조회 실패:", error);
          alert("데이터 조회 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };

      // 차트 데이터 처리 함수
      const processChartData = (chartData) => {
        if (!chartData || !chartData.chartData) return;

        // 기존 차트 데이터 처리 로직과 동일하게 처리
        const data = chartData;
        const chartDataArray = data.chartData || [];

        if (chartDataArray.length === 0) {
          setNoData(true);
          return;
        }

        // 데이터 유효성 검사 및 변환 로직은 기존과 동일
        // 여기서 차트 데이터를 reportData에 설정
        setNoData(false);
        // 추가적인 차트 데이터 처리 로직...
      };

      if (!selectedPetName || !selectedPetNo) {
        console.log("펫이 선택되지 않음:", { selectedPetName, selectedPetNo });
        if (isMounted) {
          setNoData(true);
        }
        return;
      }

      console.log("펫 변경 감지 - 데이터 재조회:", {
        selectedPetName,
        selectedPetNo,
      });

      if (isMounted) {
        isFetching = true;
        console.log("isFetching을 true로 설정");
        setLoading(true);
        // 펫 변경 시 기존 데이터 초기화
        setReportData({
          daily: { common: [], poop: [] },
          weekly: { common: [], poop: [] },
          monthly: { common: [], poop: [] },
          yearly: { common: [], poop: [] },
        });
        // noData를 즉시 true로 설정하여 차트 렌더링 차단
        setNoData(true);
        // 기간 선택 상태도 초기화
        setHasSelectedPeriod(false);
        // 로딩 상태도 초기화
        setLoading(false);
        console.log("noData를 true로 설정 (펫 변경 시)");
      }

      // 메인 드롭다운이 선택되지 않았을 때는 API 호출하지 않음
      if (mainPeriod === "선택") {
        console.log("기간이 선택되지 않음:", mainPeriod);
        if (isMounted) {
          setNoData(true);
          setLoading(false);
          setHasSelectedPeriod(false);
        }
        return;
      }

      try {
        // 선택된 기간 옵션 찾기
        const selectedOption = periodOptions[mainPeriod]?.find(
          (option) => option.key === subPeriod
        );

        if (!selectedOption) {
          console.error("선택된 기간을 찾을 수 없습니다:", subPeriod);
          return;
        }

        console.log(
          "선택된 기간:",
          mainPeriod,
          "→",
          subPeriod,
          "→ 백엔드 periodType:",
          selectedOption.periodType,
          "→ API 타입:",
          selectedOption.apiType
        );

        let data = null;
        let summary = null;

        // API 타입에 따라 적절한 API 호출
        if (selectedOption.apiType === "chart") {
          // 기존 차트 API 호출
          data = await getActivityReport(
            selectedPetNo,
            selectedOption.periodType
          );
          console.log("차트 API 응답:", data);
        } else if (selectedOption.apiType === "summary") {
          // 새로운 요약 API 호출
          summary = await getActivitySummary(
            selectedPetNo,
            selectedOption.periodType
          );
          console.log("요약 API 응답:", summary);

          // 요약 API에서 차트 데이터도 함께 제공하는 경우
          if (summary && summary.data && summary.data.activities) {
            data = {
              chartData: summary.data.activities,
              periodType: selectedOption.periodType,
            };
          }
        }

        console.log("백엔드 API 응답:", data);

        // 요약 데이터 설정
        if (summary && summary.data) {
          setSummaryData(summary);
        } else {
          setSummaryData(null);
        }

        if (data && data.chartData) {
          // 백엔드 데이터를 프론트엔드 형식에 맞게 변환
          const chartData = data.chartData || [];
          const responsePeriodType = data.periodType;

          // 데이터가 비어있는지 확인
          if (chartData.length === 0) {
            console.log("선택된 펫의 데이터가 없습니다:", {
              selectedPetName,
              selectedPetNo,
            });
            // 빈 데이터로 차트 초기화하고 noData 상태 설정
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

            console.log("데이터 유효성 검사:", {
              item,
              hasWalkingData,
              hasMealData,
              hasBathroomData,
              hasSleepData,
              actualCaloriesBurned: item.actualCaloriesBurned,
              actualCaloriesIntake: item.actualCaloriesIntake,
              peeCount: item.peeCount,
              poopCount: item.poopCount,
              sleepHours: item.sleepHours,
            });

            return (
              hasWalkingData || hasMealData || hasBathroomData || hasSleepData
            );
          });

          console.log("전체 데이터 유효성:", hasValidData);

          // 기간별 데이터 유효성 추가 확인 (주/월/년 데이터도 체크)
          const hasWeeklyData = chartData.some(
            (item) => (item.actualCaloriesBurned || 0) > 0
          );
          const hasMonthlyData = chartData.some(
            (item) => (item.actualCaloriesBurned || 0) > 0
          );
          const hasYearlyData = chartData.some(
            (item) => (item.actualCaloriesBurned || 0) > 0
          );

          console.log("기간별 데이터 유효성:", {
            daily: hasValidData,
            weekly: hasWeeklyData,
            monthly: hasMonthlyData,
            yearly: hasYearlyData,
          });

          // 현재 선택된 기간에 데이터가 있는지 확인
          const currentPeriodHasData = (() => {
            switch (selectedPeriod) {
              case "일":
                return hasValidData;
              case "주":
                return hasWeeklyData;
              case "월":
                return hasMonthlyData;
              case "년":
                return hasYearlyData;
              default:
                return hasValidData;
            }
          })();

          console.log("현재 선택된 기간 데이터 유효성:", {
            selectedPeriod,
            hasData: currentPeriodHasData,
          });

          if (!currentPeriodHasData) {
            console.log("현재 선택된 기간에 데이터가 없습니다:", {
              selectedPetName,
              selectedPetNo,
              selectedPeriod,
              chartData,
            });
            // 현재 기간에 데이터가 없으면 noData 상태 설정
            if (isMounted) {
              setReportData({
                daily: { common: [], poop: [] },
                weekly: { common: [], poop: [] },
                monthly: { common: [], poop: [] },
                yearly: { common: [], poop: [] },
              });
              setNoData(true);
              console.log(
                "현재 기간에 데이터가 없어 noData 상태를 true로 설정했습니다."
              );
            }
            return;
          }

          console.log(
            "데이터 유효성 검사 통과 - 차트 렌더링을 위한 데이터 준비 완료"
          );

          console.log("백엔드 응답 periodType:", responsePeriodType);
          console.log(
            "요청 vs 응답 periodType:",
            selectedOption?.periodType,
            "vs",
            responsePeriodType
          );
          console.log("차트 데이터 상세:", chartData);
          console.log("첫 번째 아이템:", chartData[0]);

          // 백엔드 데이터를 프론트엔드 차트 형식으로 변환
          // 기간별로 다른 데이터 구조 생성
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
                // 소변과 대변 건강점수의 평균을 통합 건강점수로 사용
                const overallHealthScore = Math.round(
                  (peeScore + poopScore) / 2
                );

                console.log("배변 데이터 변환:", {
                  peeCount: item.peeCount,
                  poopCount: item.poopCount,
                  peeScore,
                  poopScore,
                  overallHealthScore,
                });

                return {
                  date: formatDateLabel(item.date || item.displayDate),
                  소변: item.peeCount || 0,
                  대변: item.poopCount || 0,
                  통합건강점수: overallHealthScore,
                };
              }),
              // 수면 시간 - 단순화된 구조
              sleep: chartData.map((item) => {
                console.log("수면 데이터 아이템:", item);
                console.log("sleepHours 값:", item.sleepHours);

                // sleepHours가 너무 작은 경우 테스트용 값 사용 (백엔드 연결 후 제거)
                const actualHours = item.sleepHours > 0 ? item.sleepHours : 12;

                return {
                  date: formatDateLabel(item.date || item.displayDate),
                  category: "수면 시간",
                  actual: actualHours,
                  recommended: 13.0, // 반려동물 권장 수면 시간 (13시간)
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

          console.log("백엔드 데이터 변환 결과:", {
            original: data,
            chartData: chartData,
            converted: convertedData,
          });

          setReportData(convertedData);
          if (isMounted) {
            setNoData(false);
            console.log("백엔드 데이터로 noData를 false로 설정했습니다.");
          }
        } else {
          // 백엔드에서 데이터가 없을 경우
          console.log("백엔드에서 데이터 없음");

          // 빈 데이터 구조로 설정
          setReportData({
            daily: { common: [], poop: [] },
            weekly: { common: [], poop: [] },
            monthly: { common: [], poop: [] },
            yearly: { common: [], poop: [] },
          });

          if (isMounted) {
            setNoData(true);
            console.log("데이터 없음으로 noData를 true로 설정했습니다.");
          }
        }
      } catch (error) {
        console.error("리포트 데이터 조회 실패:", error);
        // 에러 발생 시 기본 구조 제공
        if (isMounted) {
          setReportData({
            daily: { common: [], poop: [] },
            weekly: { common: [], poop: [] },
            monthly: { common: [], poop: [] },
            yearly: { common: [], poop: [] },
          });
          setNoData(true); // 오류 발생 시 noData = true
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetching = false; // API 호출 완료 표시
        }
      }
    };

    fetchReportData();

    // cleanup 함수
    return () => {
      isMounted = false;
    };
  }, [selectedPetName, selectedPetNo, subPeriod]);

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
        xKey: "day",
      };
    }

    // subPeriod 기반으로 period 매핑
    const periodMap = {
      TODAY: "daily",
      LAST_3_DAYS: "daily",
      LAST_7_DAYS: "daily",
      THIS_WEEK: "weekly",
      WEEK: "weekly",
      THIS_MONTH: "monthly",
      MONTH: "monthly",
      CUSTOM: "daily", // 사용자 지정은 일별로 처리
    };
    const period = periodMap[subPeriod];

    // 안전하게 데이터에 접근
    const getData = (periodKey, dataType) => {
      if (!reportData[periodKey]) return [];

      if (periodKey === "daily") {
        // 일별 데이터는 새로운 구조 사용
        let data = [];
        switch (dataType) {
          case "walking":
            data = reportData[periodKey].walking || [];
            break;
          case "meal":
            data = reportData[periodKey].meal || [];
            break;
          case "bathroom":
            data = reportData[periodKey].bathroom || [];
            break;
          case "sleep":
            data = reportData[periodKey].sleep || [];
            break;
          default:
            data = reportData[periodKey].common || [];
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
      } else {
        // 주/월/년 데이터는 기존 구조 사용
        if (dataType === "poop") {
          return reportData[periodKey].poop || [];
        } else if (dataType === "sleep") {
          return reportData[periodKey].sleep || [];
        } else {
          return reportData[periodKey].common || [];
        }
      }
    };

    switch (subPeriod) {
      case "TODAY":
      case "LAST_3_DAYS":
      case "LAST_7_DAYS":
      case "CUSTOM":
        return {
          data:
            metric.title === "산책 소모 칼로리"
              ? getData("daily", "walking")
              : metric.title === "섭취 칼로리"
              ? getData("daily", "meal")
              : metric.title === "배변 횟수"
              ? getData("daily", "bathroom")
              : metric.title === "수면 시간"
              ? getData("daily", "sleep")
              : getData("daily", "common"),
          xKey: metric.title === "배변 횟수" ? "date" : "date",
        };
      case "THIS_WEEK":
      case "WEEK":
        return {
          data:
            metric.type === "line"
              ? getData("weekly", "poop")
              : metric.type === "area"
              ? getData("weekly", "sleep")
              : getData("weekly", "common"),
          xKey: "week",
        };
      case "THIS_MONTH":
      case "MONTH":
        return {
          data:
            metric.type === "line"
              ? getData("monthly", "poop")
              : metric.type === "area"
              ? getData("monthly", "sleep")
              : getData("monthly", "common"),
          xKey: "month",
        };
      default:
        return {
          data:
            metric.type === "line"
              ? getData("daily", "poop")
              : metric.type === "area"
              ? getData("daily", "sleep")
              : getData("daily", "common"),
          xKey: "day",
        };
    }
  }

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
        actualValue: "수면",
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
            <span className={styles.dateRangeLabel}></span>
            {/* 2단계 드롭다운 기간 선택 */}
            <div className={styles.periodDropdowns}>
              {/* 메인 드롭다운 */}
              <div className={styles.dropdownContainer}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => {
                    setShowMainDropdown(!showMainDropdown);
                    setShowSubDropdown(false);
                  }}
                >
                  <span>{mainPeriod}</span>
                  <svg
                    className={`${styles.dropdownArrow} ${
                      showMainDropdown ? styles.rotated : ""
                    }`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showMainDropdown && (
                  <div className={styles.dropdownMenu}>
                    {Object.keys(periodOptions).map((period) => (
                      <div
                        key={period}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setMainPeriod(period);
                          setShowMainDropdown(false);

                          // 첫 번째 서브 옵션을 기본값으로 설정
                          const firstSubOption = periodOptions[period][0];
                          setSubPeriod(firstSubOption.key);

                          // 기간 선택 상태 업데이트
                          setHasSelectedPeriod(true);

                          // 사용자 지정이 아닌 경우에만 서브 드롭다운 표시
                          if (firstSubOption.key !== "CUSTOM") {
                            setShowSubDropdown(true);
                            setShowCustomDatePicker(false);
                          } else {
                            setShowSubDropdown(false);
                            setShowCustomDatePicker(true);
                          }
                        }}
                      >
                        {period}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 서브 드롭다운 - 메인 선택 후에만 표시 */}
              {mainPeriod !== "선택" && (
                <div className={styles.dropdownContainer}>
                  <button
                    className={`${styles.dropdownButton} ${
                      mainPeriod === "선택" ? styles.disabled : ""
                    }`}
                    onClick={() => {
                      if (mainPeriod !== "선택") {
                        setShowSubDropdown(!showSubDropdown);
                      }
                    }}
                    disabled={mainPeriod === "선택"}
                  >
                    <span>
                      {mainPeriod === "선택"
                        ? "선택"
                        : periodOptions[mainPeriod]?.find(
                            (opt) => opt.key === subPeriod
                          )?.label || "선택"}
                    </span>
                    <svg
                      className={`${styles.dropdownArrow} ${
                        showSubDropdown ? styles.rotated : ""
                      }`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {showSubDropdown && mainPeriod !== "선택" && (
                    <div className={styles.dropdownMenu}>
                      {periodOptions[mainPeriod]?.map((option) => (
                        <div
                          key={option.key}
                          className={`${styles.dropdownItem} ${
                            subPeriod === option.key ? styles.selected : ""
                          }`}
                          onClick={() => {
                            setSubPeriod(option.key);
                            setShowSubDropdown(false);
                            // 기간 선택 상태 업데이트
                            setHasSelectedPeriod(true);
                            if (option.key === "CUSTOM") {
                              setShowCustomDatePicker(true);
                            } else {
                              setShowCustomDatePicker(false);
                            }
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 사용자 지정 기간 날짜 선택기 */}
            {showCustomDatePicker && (
              <div className={styles.customDatePicker}>
                <div className={styles.dateInputGroup}>
                  <label htmlFor="startDate">시작일:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.dateInputGroup}>
                  <label htmlFor="endDate">종료일:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
                <button
                  className={styles.applyButton}
                  onClick={async () => {
                    if (customStartDate && customEndDate) {
                      // 날짜 유효성 검증
                      if (new Date(customStartDate) > new Date(customEndDate)) {
                        alert("시작일은 종료일보다 이전이어야 합니다.");
                        return;
                      }
                      // 데이터 조회
                      await fetchCustomPeriodData();
                    } else {
                      alert("시작일과 종료일을 모두 선택해주세요.");
                    }
                  }}
                  disabled={!customStartDate || !customEndDate}
                >
                  적용
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 요약 통계 표시 영역 */}
      {selectedPetName && selectedPetNo && summaryData && summaryData.data && (
        <div className={styles.summaryStats}>
          <div className={styles.summaryCard}>
            <h4>총 활동 횟수</h4>
            <span>{summaryData.data.summaryStats?.totalActivities || 0}회</span>
          </div>
          <div className={styles.summaryCard}>
            <h4>총 산책 거리</h4>
            <span>
              {summaryData.data.summaryStats?.totalWalkingDistance || 0}km
            </span>
          </div>
          <div className={styles.summaryCard}>
            <h4>소모 칼로리 달성률</h4>
            <span>
              {summaryData.data.summaryStats?.caloriesBurnedAchievementRate ||
                0}
              %
            </span>
          </div>
          <div className={styles.summaryCard}>
            <h4>평균 체중</h4>
            <span>{summaryData.data.summaryStats?.averageWeight || 0}kg</span>
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
                          {selectedPeriod === "일" ? (
                            // 일별 차트 - 새로운 구조
                            <ComposedChart
                              data={data}
                              barCategoryGap="20%"
                              barGap={4}
                            >
                              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                              <YAxis yAxisId="left" />
                              <YAxis yAxisId="right" orientation="right" />
                              <Tooltip />

                              {metric.title === "산책 소모 칼로리" && (
                                <>
                                  {/* 권장량 (막대) */}
                                  <Bar
                                    yAxisId="left"
                                    dataKey="target"
                                    fill={metric.colorRecommended}
                                    name="권장량"
                                    radius={[4, 4, 0, 0]}
                                  />
                                  {/* 실제 소모량 (막대) */}
                                  <Bar
                                    yAxisId="left"
                                    dataKey="actual"
                                    fill={metric.colorActual}
                                    name="소모량"
                                    radius={[4, 4, 0, 0]}
                                  />
                                  {/* 달성률 (영역) */}
                                  <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="achievement"
                                    fill={metric.colorActual}
                                    fillOpacity={0.3}
                                    name="달성률(%)"
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

                              <Legend verticalAlign="bottom" height={36} />
                            </ComposedChart>
                          ) : (
                            // 주/월/년 차트 - 기존 구조
                            <BarChart
                              data={data}
                              barCategoryGap="20%"
                              barGap={4}
                            >
                              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                              <YAxis hide />
                              <Tooltip
                                formatter={customTooltipFormatter(metric.title)}
                              />
                              {/* 실제값 막대 - 앞쪽 */}
                              <Bar
                                dataKey="actualValue"
                                fill={metric.colorActual}
                                radius={[4, 4, 0, 0]}
                                barSize={15}
                                name={
                                  metric.title === "산책 소모 칼로리"
                                    ? "소모량"
                                    : metric.title === "섭취 칼로리"
                                    ? "식사량"
                                    : "실제값"
                                }
                              />
                              {/* 권장량 막대 - 뒤쪽 */}
                              {metric.hasRecommended && (
                                <Bar
                                  dataKey="recommendedValue"
                                  fill={metric.colorRecommended}
                                  radius={[4, 4, 0, 0]}
                                  barSize={15}
                                  name="권장량"
                                />
                              )}
                              <Legend verticalAlign="bottom" height={36} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      )}
                      {metric.type === "line" && (
                        <ResponsiveContainer width="100%" height={150}>
                          {selectedPeriod === "일" &&
                          metric.title === "배변 횟수" ? (
                            // 일별 배변 차트 - 소변/대변 횟수 + 건강점수
                            <ComposedChart
                              data={data}
                              barCategoryGap="20%"
                              barGap={4}
                            >
                              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                              <YAxis yAxisId="left" />
                              <YAxis yAxisId="right" orientation="right" />
                              <Tooltip />

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
                          ) : (
                            // 주/월/년 배변 차트 - 기존 구조
                            <LineChart data={data}>
                              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                              <YAxis />
                              <Tooltip
                                formatter={customTooltipFormatter(metric.title)}
                              />
                              <Legend verticalAlign="bottom" height={36} />
                              <Line
                                type="monotone"
                                dataKey="소변"
                                stroke="#42A5F5"
                                dot={{ r: 4 }}
                                name="소변"
                              />
                              <Line
                                type="monotone"
                                dataKey="대변"
                                stroke="#FF7043"
                                dot={{ r: 4 }}
                                name="대변"
                              />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      )}
                      {metric.type === "area" && (
                        <ResponsiveContainer width="100%" height={150}>
                          {selectedPeriod === "일" &&
                          metric.title === "수면 시간" ? (
                            // 일별 수면 차트 - 새로운 구조
                            <ComposedChart data={data}>
                              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                              <YAxis yAxisId="left" />
                              <YAxis yAxisId="right" orientation="right" />
                              <Tooltip />

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
                          ) : (
                            // 주/월/년 수면 차트 - 기존 구조
                            <AreaChart data={data}>
                              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                              <YAxis hide />
                              <Tooltip
                                formatter={customTooltipFormatter(metric.title)}
                              />
                              <Area
                                type="monotone"
                                dataKey="actualValue"
                                stroke={metric.colorActual}
                                fill={metric.colorActual}
                                name="수면 시간"
                                fillOpacity={0.3}
                              />
                              <Legend verticalAlign="bottom" height={36} />
                            </AreaChart>
                          )}
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </section>
  );
}
