"use client";

import { useState, useEffect } from "react";
import { getCommentStats } from "../../lib/commentData";
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

  const handleToggleChange = () => {
    const newState = !autoManageEnabled;
    setPendingToggleState(newState);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmToggle = () => {
    setAutoManageEnabled(pendingToggleState);
    setIsConfirmModalOpen(false);
  };

  const handleCancelToggle = () => {
    setIsConfirmModalOpen(false);
    setPendingToggleState(autoManageEnabled);
  };

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await getCommentStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch comment stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

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
      <BannedWords />

      {/* 감정 분석 */}
      <SentimentAnalysis />

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
