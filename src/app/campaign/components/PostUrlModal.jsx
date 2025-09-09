"use client"

import React, { useState, useEffect } from 'react';
import styles from "../styles/PostUrlModal.module.css";
import { getApplicantsByAd, updateReview, getReview } from '@/api/campaignApi';
import AlertModal from '@/app/advertiser/components/AlertModal';

export default function PostUrlModal({ isOpen, onClose, adNo }) {
  const [applicants, setApplicants] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [postUrl, setPostUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [petReviews, setPetReviews] = useState({}); // 각 펫의 리뷰 상태 저장
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (isOpen && adNo) {
      fetchApplicants();
    }
  }, [isOpen, adNo]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const applicantsData = await getApplicantsByAd(adNo);
      // selected 상태인 펫들만 필터링
      const selectedPets = applicantsData.filter(applicant => applicant.status === 'SELECTED');
      setApplicants(selectedPets);
      
      if (selectedPets.length > 0) {
        // 모든 선택된 펫의 리뷰 정보를 미리 조회
        const reviewsData = {};
        for (const pet of selectedPets) {
          try {
            const reviewData = await getReview(pet.applicantNo);
            reviewsData[pet.applicantNo] = reviewData;
          } catch (error) {
            console.error(`펫 ${pet.applicantNo} 리뷰 조회 실패:`, error);
            reviewsData[pet.applicantNo] = null;
          }
        }
        setPetReviews(reviewsData);
        
        // 첫 번째 펫을 선택하고 해당 리뷰 정보 설정
        setSelectedPet(selectedPets[0]);
        const firstPetReview = reviewsData[selectedPets[0].applicantNo];
        setExistingReview(firstPetReview);
        
        if (firstPetReview) {
          setPostUrl(firstPetReview.reviewUrl || '');
          setRejectionReason(firstPetReview.reason || '');
        } else {
          setPostUrl('');
          setRejectionReason('');
        }
      }
    } catch (error) {
      console.error('선정된 펫 목록 조회 실패:', error);
      setError('선정된 펫 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  // 기존 리뷰 정보 조회
  const fetchExistingReview = async (applicantNo) => {
    try {
      const reviewData = await getReview(applicantNo);
      console.log('리뷰 데이터:', reviewData);
      setExistingReview(reviewData);
      
      // 리뷰 데이터가 있으면 해당 데이터로 설정, 없으면 초기화
      if (reviewData) {
        // 기존 reviewUrl이 있으면 설정
        if (reviewData.reviewUrl) {
          setPostUrl(reviewData.reviewUrl);
        } else {
          setPostUrl('');
        }
        
        // reason이 있으면 반려 사유로 설정
        if (reviewData.reason) {
          setRejectionReason(reviewData.reason);
        } else {
          setRejectionReason('');
        }
      } else {
        // 리뷰 데이터가 없으면 초기화
        setPostUrl('');
        setRejectionReason('');
      }
    } catch (error) {
      console.error('기존 리뷰 조회 실패:', error);
      // 리뷰가 없는 경우는 정상적인 상황이므로 에러로 처리하지 않음
      setExistingReview(null);
      setPostUrl('');
      setRejectionReason('');
    }
  };

  const handlePetChange = (applicantNo) => {
    const pet = applicants.find(app => app.applicantNo === parseInt(applicantNo));
    if (pet) {
      setSelectedPet(pet);
      // 미리 조회된 리뷰 데이터 사용
      const petReview = petReviews[pet.applicantNo];
      setExistingReview(petReview);
      
      if (petReview) {
        setPostUrl(petReview.reviewUrl || '');
        setRejectionReason(petReview.reason || '');
      } else {
        setPostUrl('');
        setRejectionReason('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPet) {
      setError('펫을 선택해주세요.');
      return;
    }
    
    if (!postUrl.trim()) {
      setError('게시물 URL을 입력해주세요.');
      return;
    }

    // URL 형식 검증
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(postUrl)) {
      setError('올바른 URL 형식을 입력해주세요. (http:// 또는 https://로 시작)');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // updateReview API 호출하여 reviewUrl 저장 (reason은 빈 값으로 설정하여 반려 사유 제거)
      await updateReview(selectedPet.applicantNo, postUrl, "", "REVIEWING");
      
      console.log('게시물 URL 저장 성공:', { applicantNo: selectedPet.applicantNo, postUrl });
      
      // petReviews 상태 업데이트
      setPetReviews(prev => ({
        ...prev,
        [selectedPet.applicantNo]: {
          ...prev[selectedPet.applicantNo],
          reviewUrl: postUrl,
          reason: "",
          isApproved: "REVIEWING"
        }
      }));
      
      // 성공 시 모달 닫기
      onClose();
      // 성공 메시지 표시
      setAlertModal({
        isOpen: true,
        title: '등록 완료',
        message: '게시물 URL이 성공적으로 등록되었습니다.',
        type: 'success'
      });
    } catch (error) {
      console.error('게시물 URL 저장 실패:', error);
      setError('게시물 URL 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // review 상태에 따른 UI 렌더링 함수
  const renderContentByStatus = () => {
    if (!existingReview) {
      // 리뷰가 없는 경우 (PENDING 상태)
      return renderPendingState();
    }

    switch (existingReview.isApproved) {
      case 'PENDING':
        return renderPendingState();
      case 'REVIEWING':
        return renderReviewingState();
      case 'REJECTED':
        return renderRejectedState();
      case 'APPROVED':
        return renderApprovedState();
      default:
        return renderPendingState();
    }
  };

  const renderPendingState = () => (
    <>
      {/* URL Input */}
      <div className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label className={styles.formLabel}>
            게시물 URL
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputContainer}>
            <input
              type="url"
              id="postUrl"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="게시물 URL을 작성해주세요"
              className={styles.urlInput}
              disabled={isLoading || !selectedPet}
              required
            />
            <div className={styles.inputIcon}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1L13 7L7 13M1 7H13"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderReviewingState = () => (
    <div className={styles.statusContainer}>
      <div className={styles.reviewingStatus}>
        <div className={styles.statusIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className={styles.statusTitle}>제출하신 URL을 검토중입니다</h3>
        <p className={styles.statusMessage}>
          검토 완료 후 결과를 알려드리겠습니다
        </p>
        <div className={styles.submittedUrl}>
          <span className={styles.urlLabel}>제출된 URL:</span>
          <a href={existingReview.reviewUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
            {existingReview.reviewUrl}
          </a>
        </div>
      </div>
    </div>
  );

  const renderRejectedState = () => (
    <>
      {/* 반려 사유 표시 */}
      <div className={styles.rejectionWarning}>
        <div className={styles.warningHeader}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1L15 14H1L8 1Z"
              stroke="#DC2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.warningTitle}>반려 사유</span>
        </div>
        <p className={styles.rejectionReason}>{existingReview.reason}</p>
        <p className={styles.warningMessage}>
          위 사유로 인해 반려되었습니다. 수정 후 다시 등록해주세요.
        </p>
      </div>

      {/* URL Input (수정 가능) */}
      <div className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label className={styles.formLabel}>
            게시물 URL (수정)
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputContainer}>
            <input
              type="url"
              id="postUrl"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="수정된 게시물 URL을 작성해주세요"
              className={styles.urlInput}
              disabled={isLoading || !selectedPet}
              required
            />
            <div className={styles.inputIcon}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1L13 7L7 13M1 7H13"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderApprovedState = () => (
    <div className={styles.statusContainer}>
      <div className={styles.approvedStatus}>
        <div className={styles.statusIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12L11 14L15 10"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#10B981"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h3 className={styles.statusTitle}>URL이 승인되었습니다!</h3>
        <p className={styles.statusMessage}>
          제출해주신 게시물 URL이 승인되었습니다
        </p>
        <div className={styles.approvedUrl}>
          <span className={styles.urlLabel}>승인된 URL:</span>
          <a href={existingReview.reviewUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
            {existingReview.reviewUrl}
          </a>
        </div>
      </div>
    </div>
  );

  const handleClose = () => {
    setPostUrl('');
    setError('');
    setSelectedPet(null);
    setApplicants([]);
    setExistingReview(null);
    setRejectionReason('');
    setPetReviews({});
    onClose();
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
              <h2 className={styles.modalTitle}>게시물 URL 등록</h2>
              <p className={styles.modalSubtitle}>
                체험한 상품에 대한 리뷰 게시물 URL을 등록해보세요
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

        {/* Form */}
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {/* Pet Selection */}
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>
                  펫 선택
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputContainer}>
                  <select
                    id="pet"
                    value={selectedPet?.applicantNo || ''}
                    onChange={(e) => handlePetChange(e.target.value)}
                    className={styles.select}
                    disabled={isLoading || applicants.length === 0}
                  >
                    {applicants.length === 0 ? (
                      <option value="">선정된 펫이 없습니다</option>
                    ) : (
                      applicants.map((applicant) => {
                        const review = petReviews[applicant.applicantNo];
                        const statusText = review ? 
                          (review.isApproved === 'PENDING' ? ' (미제출)' :
                           review.isApproved === 'REVIEWING' ? ' (검토중)' :
                           review.isApproved === 'REJECTED' ? ' (반려)' :
                           review.isApproved === 'APPROVED' ? ' (승인)' : '') : ' (미제출)';
                        
                        return (
                          <option key={applicant.applicantNo} value={applicant.applicantNo}>
                            {applicant.pet?.name || `펫 ${applicant.applicantNo}`}{statusText}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* 상태에 따른 동적 컨텐츠 */}
            {renderContentByStatus()}

            {/* Error Message */}
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
            disabled={isLoading}
          >
            {existingReview?.isApproved === 'APPROVED' ? '확인' : '취소'}
          </button>
          {/* PENDING, REJECTED 상태에서만 등록 버튼 표시 */}
          {(!existingReview || existingReview.isApproved === 'PENDING' || existingReview.isApproved === 'REJECTED') && (
            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isLoading || !selectedPet}
            >
              {isLoading ? '저장중' : '등록'}
            </button>
          )}
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
