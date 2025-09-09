"use client"

import React, { useState, useEffect } from 'react';
import styles from '../styles/ReviewUrlModal.module.css';
import AlertModal from '../../../components/AlertModal';
import { getPersonalReview, updateReview } from '@/api/advertisementApi';

export default function ReviewUrlModal({ isOpen, onClose, applicant, onReviewUpdate, campaign }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    if (isOpen && applicant?.applicantNo) {
      fetchReview();
    }
  }, [isOpen, applicant]);

  const fetchReview = async () => {
    setLoading(true);
    try {
      const reviewData = await getPersonalReview(applicant.applicantNo);
      setReview(reviewData);
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      setReview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await updateReview(applicant.applicantNo, {
        isApproved: 'APPROVED'
      });
      // 성공 후 리뷰 다시 조회
      await fetchReview();
      // 부모 컴포넌트에 리뷰 업데이트 알림
      if (onReviewUpdate) {
        onReviewUpdate(applicant.applicantNo);
      }
    } catch (error) {
      console.error('승인 처리 실패:', error);
      setAlertData({
        title: '승인 실패',
        message: '승인 처리에 실패했습니다.',
        type: 'error'
      });
      setIsAlertModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setAlertData({
        title: '입력 필요',
        message: '반려 사유를 입력해주세요.',
        type: 'warning'
      });
      setIsAlertModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateReview(applicant.applicantNo, {
        isApproved: 'REJECTED',
        reason: rejectionReason
      });
      // 성공 후 리뷰 다시 조회
      await fetchReview();
      setRejectionReason('');
      setShowRejectionForm(false);
      // 부모 컴포넌트에 리뷰 업데이트 알림
      if (onReviewUpdate) {
        onReviewUpdate(applicant.applicantNo);
      }
    } catch (error) {
      console.error('반려 처리 실패:', error);
      setAlertData({
        title: '반려 실패',
        message: '반려 처리에 실패했습니다.',
        type: 'error'
      });
      setIsAlertModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectionForm(true);
  };

  const handleCancelReject = () => {
    setShowRejectionForm(false);
    setRejectionReason('');
  };

  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopyMessage(true);
      // 2초 후 메시지 숨김
      setTimeout(() => {
        setShowCopyMessage(false);
      }, 2000);
    } catch (error) {
      console.error('URL 복사 실패:', error);
      setAlertData({
        title: '복사 실패',
        message: 'URL 복사에 실패했습니다.',
        type: 'error'
      });
      setIsAlertModalOpen(true);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>리뷰 정보를 불러오는 중</p>
        </div>
      );
    }

    if (!review) {
      return (
        <div className={styles.error}>
          <p>리뷰 정보를 불러올 수 없습니다.</p>
        </div>
      );
    }

    switch (review.isApproved) {
      case 'PENDING':
        return (
          <div className={styles.pendingContent}>
            <div className={styles.statusIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.statusTitle}>리뷰 URL 제출 이전</h3>
            <p className={styles.statusDescription}>
              체험단이 아직 리뷰 게시물을 제출하지 않았습니다.
            </p>
          </div>
        );

      case 'REVIEWING':
        return (
          <div className={styles.reviewingContent}>
            <div className={styles.statusIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#FFCD17" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="#FFCD17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.statusTitle}>리뷰 검토 중</h3>
            <p className={styles.statusDescription}>
              체험단이 리뷰 게시물을 제출했습니다. 검토 후 승인 또는 반려해주세요.
            </p>
            
            {review.reviewUrl && (
              <div className={styles.urlSection}>
                <label className={styles.urlLabel}>게시물 URL</label>
                <div className={styles.urlContainer}>
                  <input 
                    type="text" 
                    value={review.reviewUrl} 
                    readOnly 
                    className={styles.urlInput}
                  />
                  <button 
                    className={styles.copyButton}
                    onClick={() => handleCopyUrl(review.reviewUrl)}
                  >
                    복사
                  </button>
                </div>
                {showCopyMessage && (
                  <div className={styles.copyMessage}>
                    URL이 클립보드에 복사되었습니다
                  </div>
                )}
              </div>
            )}

            {campaign?.adStatus !== 'ENDED' && (
              <div className={styles.actionButtons}>
                <button 
                  className={styles.approveButton}
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  승인
                </button>
                <button 
                  className={styles.rejectButton}
                  onClick={handleRejectClick}
                  disabled={isSubmitting}
                >
                  반려
                </button>
              </div>
            )}
          </div>
        );

      case 'REJECTED':
        return (
          <div className={styles.rejectedContent}>
            <div className={styles.statusIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#FF8484" strokeWidth="2"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="#FF8484" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.statusTitle}>리뷰 반려됨</h3>
            <p className={styles.statusDescription}>
              체험단이 아직 리뷰 게시물을 수정하지 않았습니다.
            </p>
            
            {review.reviewUrl && (
              <div className={styles.urlSection}>
                <label className={styles.urlLabel}>게시물 URL</label>
                <div className={styles.urlContainer}>
                  <input 
                    type="text" 
                    value={review.reviewUrl} 
                    readOnly 
                    className={styles.urlInput}
                  />
                  <button 
                    className={styles.copyButton}
                    onClick={() => handleCopyUrl(review.reviewUrl)}
                  >
                    복사
                  </button>
                </div>
                {showCopyMessage && (
                  <div className={styles.copyMessage}>
                    URL이 클립보드에 복사되었습니다
                  </div>
                )}
              </div>
            )}

            {review.reason && (
              <div className={styles.reasonSection}>
                <label className={styles.reasonLabel}>반려 사유</label>
                <div className={styles.reasonText}>
                  {review.reason}
                </div>
              </div>
            )}
          </div>
        );

      case 'APPROVED':
        return (
          <div className={styles.approvedContent}>
            <div className={styles.statusIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#8BC34A" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="#8BC34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.statusTitle}>리뷰 승인됨</h3>
            <p className={styles.statusDescription}>
              체험단의 리뷰가 승인되었습니다.
            </p>
            
            {review.reviewUrl && (
              <div className={styles.urlSection}>
                <label className={styles.urlLabel}>게시물 URL</label>
                <div className={styles.urlContainer}>
                  <input 
                    type="text" 
                    value={review.reviewUrl} 
                    readOnly 
                    className={styles.urlInput}
                  />
                  <button 
                    className={styles.copyButton}
                    onClick={() => handleCopyUrl(review.reviewUrl)}
                  >
                    복사
                  </button>
                </div>
                {showCopyMessage && (
                  <div className={styles.copyMessage}>
                    URL이 클립보드에 복사되었습니다
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className={styles.error}>
            <p>알 수 없는 상태입니다.</p>
          </div>
        );
    }
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.modalTitle}>
                {campaign?.adStatus === 'ENDED' ? '게시물 URL 확인' : '게시물 URL 관리'}
              </h2>
              <p className={styles.modalSubtitle}>
                {campaign?.adStatus === 'ENDED' 
                  ? '체험단의 완료된 리뷰 게시물을 확인해주세요'
                  : '체험단의 리뷰 게시물 상태를 확인하고 관리해주세요'
                }
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
          <div className={styles.petInfo}>
            <h3 className={styles.petName}>{applicant?.pet?.name}</h3>
            <p className={styles.petHandle}>{applicant?.pet?.snsUsername || 'SNS 정보 없음'}</p>
          </div>
          
          {renderContent()}
        </div>

        {/* Rejection Form */}
        {showRejectionForm && (
          <div className={styles.rejectionForm}>
            <div className={styles.rejectionFormHeader}>
              <h3 className={styles.rejectionFormTitle}>반려 사유 작성</h3>
              <p className={styles.rejectionFormSubtitle}>
                체험단에게 전달될 반려 사유를 작성해주세요
              </p>
            </div>
            <div className={styles.rejectionFormBody}>
              <textarea
                className={styles.rejectionTextarea}
                placeholder="반려 사유를 입력해주세요..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className={styles.rejectionFormActions}>
              <button
                className={styles.cancelRejectButton}
                onClick={handleCancelReject}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                className={styles.confirmRejectButton}
                onClick={handleReject}
                disabled={isSubmitting || !rejectionReason.trim()}
              >
                {isSubmitting ? '처리 중' : '반려 처리'}
              </button>
            </div>
          </div>
        )}
      </div>
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={handleCloseAlertModal}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
      />
    </div>
  );
}
