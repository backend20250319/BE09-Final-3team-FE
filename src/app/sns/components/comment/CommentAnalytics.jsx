"use client";

import { useState, useEffect } from "react";
import { getCommentStats, updateAutoDeleteSetting } from "../../lib/commentData";
import { useSns } from "../../context/SnsContext";
import styles from "../../styles/comment/CommentAnalytics.module.css";
import StatsCard from "./StatsCard";
import BannedWords from "./BannedWords";
import SentimentAnalysis from "./SentimentAnalysis";
import { IoInformationCircleOutline } from "react-icons/io5";

export default function CommentAnalytics() {
  const [autoManageEnabled, setAutoManageEnabled] = useState(true);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingToggleState, setPendingToggleState] = useState(false);
  const { selectedInstagramProfile } = useSns();

  const handleToggleChange = () => {
    const newState = !autoManageEnabled;
    setPendingToggleState(newState);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    try {
      if (selectedInstagramProfile?.id) {
        await updateAutoDeleteSetting(selectedInstagramProfile.id, pendingToggleState);
        setAutoManageEnabled(pendingToggleState);
        console.log("Auto delete setting updated successfully");
      } else {
        console.warn("No Instagram profile selected");
      }
    } catch (error) {
      console.error("Failed to update auto delete setting:", error);
      // 에러 발생 시 원래 상태로 되돌리기
      setPendingToggleState(autoManageEnabled);
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handleCancelToggle = () => {
    setIsConfirmModalOpen(false);
    setPendingToggleState(autoManageEnabled);
  };

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        
        if (!selectedInstagramProfile?.id) {
          console.log("No Instagram profile selected");
          // 기본 통계 카드 표시
          const defaultData = [
            { id: 1, label: "총 댓글 수", value: "0" },
            { id: 2, label: "자동 삭제된 댓글", value: "0" },
            { id: 3, label: "자동 삭제율", value: "0%" },
            { id: 4, label: "금지어 댓글", value: "0" }
          ];
          setStatsData(defaultData);
          setLoading(false);
          return;
        }
        
        console.log("Fetching stats for profile:", selectedInstagramProfile.id);
        const apiData = await getCommentStats(selectedInstagramProfile.id);
        console.log("API response:", apiData);
        
        if (apiData) {
          setAutoManageEnabled(selectedInstagramProfile.auto_delete);
          // API 응답 데이터를 간단하게 변환
          const transformedData = [
            { id: 1, label: "총 댓글 수", value: apiData.total_comments || "0" },
            { id: 2, label: "자동 삭제된 댓글", value: apiData.auto_deleted_comments || "0" },
            { id: 3, label: "자동 삭제율", value: apiData.auto_delete_rate ? `${Number(apiData.auto_delete_rate).toFixed(1)}%` : "0%" },
            { id: 4, label: "금지어 댓글", value: apiData.banned_word_comments || "0" }
          ];
          
          console.log("Transformed data:", transformedData);
          setStatsData(transformedData);
        } else {
          console.warn("No stats data received");
          setStatsData([]);
        }
      } catch (error) {
        console.error("Failed to fetch comment stats:", error);
        setStatsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [selectedInstagramProfile]);

  if (loading) {
    return <div className={styles.analyticsSection}>Loading...</div>;
  }

  return (
    <div className={styles.analyticsSection}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>댓글 분석</h1>
        <div className={styles.autoManage}>
          <div className={styles.autoManageContent}>
            <div
              className={styles.infoIcon}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <IoInformationCircleOutline size={22} />
              {showTooltip && (
                <div className={styles.tooltip}>
                  해당 토글을 활성화하면 부적절한 댓글이 자동 삭제 됩니다.
                </div>
              )}
            </div>
            <span className={styles.autoManageLabel}>자동 댓글 관리</span>
          </div>
          <button
            className={`${styles.toggle} ${
              autoManageEnabled ? styles.enabled : ""
            }`}
            onClick={handleToggleChange}
          >
            <div className={styles.toggleSwitch}></div>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        {statsData.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 금지어 관리 */}
              <BannedWords instagram_id={selectedInstagramProfile?.id} />

             {/* 감정 분석 */}
       <SentimentAnalysis instagram_id={selectedInstagramProfile?.id} />

      {/* 토글 확인 모달 */}
      {isConfirmModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCancelToggle}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>자동 댓글 관리 설정</h3>
            <p className={styles.confirmMessage}>
              {pendingToggleState
                ? "자동 댓글 관리를 활성화하시겠습니까?\n부적절한 댓글이 자동으로 삭제됩니다."
                : "자동 댓글 관리를 비활성화하시겠습니까?"}
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelToggle}
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmToggle}
              >
                {pendingToggleState ? "활성화" : "비활성화"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
