"use client"

import React, { useState, useEffect } from 'react';
import styles from "../styles/PostUrlModal.module.css";
import { getApplicantsByAd, getReview } from '@/api/campaignApi';
import AlertModal from '@/app/advertiser/components/AlertModal';

export default function CompletedUrlsModal({ isOpen, onClose, adNo }) {
  const [applicants, setApplicants] = useState([]);
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (isOpen && adNo) {
      fetchApprovedApplicants();
    }
  }, [isOpen, adNo]);

  const fetchApprovedApplicants = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // 해당 광고의 모든 사용자 관련 지원자 조회
      const approvedPets = await getApplicantsByAd(adNo);
      console.log('전체 지원자:', approvedPets); // 디버깅용
      
      if (approvedPets.length === 0) {
        setApprovedApplicants([]);
        return;
      }

      // 각 승인된 지원자의 리뷰 정보 조회
      const approvedWithReviews = [];
      for (const applicant of approvedPets) {
        try {
          const reviewData = await getReview(applicant.applicantNo);
          console.log(`지원자 ${applicant.applicantNo} 리뷰 데이터:`, reviewData); // 디버깅용
          
          // reviewUrl이 있든 없든 모든 지원자를 표시
          approvedWithReviews.push({
            ...applicant,
            review: reviewData || null
          });
        } catch (error) {
          console.error(`지원자 ${applicant.applicantNo} 리뷰 조회 실패:`, error);
          // 에러가 발생해도 지원자는 표시
          approvedWithReviews.push({
            ...applicant,
            review: null
          });
        }
      }
      
      console.log('최종 승인된 지원자 목록:', approvedWithReviews); // 디버깅용
      setApprovedApplicants(approvedWithReviews);
    } catch (error) {
      console.error('승인된 지원자 목록 조회 실패:', error);
      setError('승인된 지원자 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setApprovedApplicants([]);
    setApplicants([]);
    setError('');
    onClose();
  };

  const handleUrlClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12L11 14L15 10"
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
              <h2 className={styles.modalTitle}>광고 완료 - 게시물 URL</h2>
              <p className={styles.modalSubtitle}>
                승인된 지원자들이 작성한 게시물 URL을 확인하세요
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
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
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>승인된 지원자 정보를 불러오는 중</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.errorText}>{error}</p>
            </div>
          ) : approvedApplicants.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>승인된 지원자가 없습니다</h3>
              <p className={styles.emptyMessage}>
                현재 이 광고에 승인된 지원자가 없거나<br />
                아직 게시물 URL을 등록하지 않았습니다.
              </p>
            </div>
          ) : (
            <div className={styles.applicantsList}>
              <div className={styles.listHeader}>
                <h3 className={styles.listTitle}>
                  승인된 지원자 ({approvedApplicants.length}명)
                </h3>
                <p className={styles.listSubtitle}>
                  아래 지원자들이 작성한 게시물을 확인할 수 있습니다
                </p>
              </div>
              
              <div className={styles.applicantsGrid}>
                {approvedApplicants.map((applicant) => (
                  <div key={applicant.applicantNo} className={styles.applicantCard}>
                    <div className={styles.applicantHeader}>
                      <div className={styles.petInfo}>
                        <div className={styles.petAvatar}>
                          {applicant.pet?.image ? (
                            <img 
                              src={applicant.pet.image} 
                              alt={applicant.pet.name}
                              className={styles.petImage}
                            />
                          ) : (
                            <div className={styles.defaultAvatar}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                  stroke="#6B7280"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="7"
                                  r="4"
                                  stroke="#6B7280"
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className={styles.petDetails}>
                          <h4 className={styles.petName}>
                            {applicant.pet?.name || `펫 ${applicant.applicantNo}`}
                          </h4>
                          <p className={styles.petBreed}>
                            {applicant.review?.adNo || '품종 정보 없음'}
                          </p>
                        </div>
                      </div>
                      <div className={styles.statusBadge}>
                        <span className={styles.statusText}>승인됨</span>
                      </div>
                    </div>
                    
                    <div className={styles.urlSection}>
                      <div className={styles.urlHeader}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className={styles.urlLabel}>게시물 URL</span>
                      </div>
                      {applicant.review && applicant.review.reviewUrl ? (
                        <div className={styles.urlContainer}>
                          <p className={styles.urlText}>
                            {applicant.review.reviewUrl}
                          </p>
                          <button
                            className={styles.urlButton}
                            onClick={() => handleUrlClick(applicant.review.reviewUrl)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path
                                d="M7 1L13 7L7 13M1 7H13"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className={styles.noUrlContainer}>
                          <p className={styles.noUrlText}>
                            아직 게시물 URL이 등록되지 않았습니다
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
            disabled={isLoading}
          >
            확인
          </button>
        </div>
      </div>
      
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}
