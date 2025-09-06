"use client"

import React, { useState, useEffect } from 'react';
import styles from '../styles/ReviewStatusModal.module.css';
import { getReview } from '@/api/advertisementApi';

export default function ReviewStatusModal({ isOpen, onClose, adNo }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && adNo) {
      fetchReviews();
    }
  }, [isOpen, adNo]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewData = await getReview(adNo);
      setReviews(reviewData || []);
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = reviews.length;
    const approved = reviews.filter(review => review.isApproved === 'APPROVED').length;
    const pending = reviews.filter(review => review.isApproved === 'PENDING').length;
    const reviewing = reviews.filter(review => review.isApproved === 'REVIEWING').length;
    const rejected = reviews.filter(review => review.isApproved === 'REJECTED').length;
    
    return {
      total,
      approved,
      pending,
      reviewing,
      rejected,
      completed: approved,
      incomplete: pending + reviewing + rejected
    };
  };

  const stats = calculateStats();
  const completedPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const incompletePercentage = 100 - completedPercentage;

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>리뷰 현황을 불러오는 중</p>
        </div>
      );
    }

    if (stats.total === 0) {
      return (
        <div className={styles.error}>
          <p>리뷰 데이터가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className={styles.content}>
        {/* 원형 그래프 */}
        <div className={styles.chartContainer}>
          <div className={styles.pieChart}>
            <svg width="200" height="200" viewBox="0 0 200 200" className={styles.chartSvg}>
              {/* 배경 원 */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="20"
              />
              {/* 진행률 표시 원 - strokeDasharray로 완료/미완료 구분 */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={completedPercentage === 100 ? "#10B981" : completedPercentage === 0 ? "transparent" : "#10B981"}
                strokeWidth="20"
                strokeDasharray={`${completedPercentage * 5.02} ${incompletePercentage * 5.02}`}
                strokeDashoffset="125.5"
                transform="rotate(-90 100 100)"
                className={styles.progressArc}
              />
            </svg>
            <div className={styles.chartCenter}>
              <div className={styles.percentage}>{completedPercentage}%</div>
              <div className={styles.percentageLabel}>제출 완료</div>
            </div>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className={styles.statsContainer}>
          <div className={styles.statsHeader}>
            <h3 className={styles.statsTitle}>리뷰 제출 현황</h3>
            <p className={styles.statsSubtitle}>총 {stats.total}명의 체험단</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <div className={styles.iconCompleted}></div>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.completed}</div>
                <div className={styles.statLabel}>제출 완료</div>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <div className={styles.iconIncomplete}></div>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.incomplete}</div>
                <div className={styles.statLabel}>제출 미완료</div>
              </div>
            </div>
          </div>

          {/* 상세 상태 */}
          <div className={styles.detailStats}>
            <div className={styles.detailItem}>
              <div className={styles.detailDot} style={{ backgroundColor: '#9CA3AF' }}></div>
              <span className={styles.detailLabel}>제출 대기</span>
              <span className={styles.detailCount}>{stats.pending}명</span>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailDot} style={{ backgroundColor: '#F59E0B' }}></div>
              <span className={styles.detailLabel}>검토 중</span>
              <span className={styles.detailCount}>{stats.reviewing}명</span>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailDot} style={{ backgroundColor: '#EF4444' }}></div>
              <span className={styles.detailLabel}>반려됨</span>
              <span className={styles.detailCount}>{stats.rejected}명</span>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailDot} style={{ backgroundColor: '#10B981' }}></div>
              <span className={styles.detailLabel}>승인됨</span>
              <span className={styles.detailCount}>{stats.approved}명</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.modalTitle}>URL 제출 현황</h2>
              <p className={styles.modalSubtitle}>
                체험단들의 리뷰 URL 제출 현황을 확인해보세요
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
