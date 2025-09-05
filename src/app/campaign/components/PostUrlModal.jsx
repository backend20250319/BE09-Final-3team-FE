"use client"

import React, { useState, useEffect } from 'react';
import styles from "../styles/PostUrlModal.module.css";
import { getApplicantsByAd, updateReview, getReview } from '@/api/campaignApi';

export default function PostUrlModal({ isOpen, onClose, adNo }) {
  const [applicants, setApplicants] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [postUrl, setPostUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
        setSelectedPet(selectedPets[0]);
        // 기존 리뷰 정보 조회
        await fetchExistingReview(selectedPets[0].applicantNo);
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
      console.log(reviewData);
      setExistingReview(reviewData);
      
      if (reviewData) {
        // 기존 reviewUrl이 있으면 설정
        if (reviewData.reviewUrl) {
          setPostUrl(reviewData.reviewUrl);
        }
        
        // reason이 있으면 반려 사유로 설정
        if (reviewData.reason) {
          setRejectionReason(reviewData.reason);
        }
      }
    } catch (error) {
      console.error('기존 리뷰 조회 실패:', error);
      // 리뷰가 없는 경우는 정상적인 상황이므로 에러로 처리하지 않음
    }
  };

  const handlePetChange = (applicantNo) => {
    const pet = applicants.find(app => app.applicantNo === parseInt(applicantNo));
    if (pet) {
      setSelectedPet(pet);
      // 펫 변경 시 해당 펫의 기존 리뷰 정보 조회
      fetchExistingReview(pet.applicantNo);
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
      await updateReview(selectedPet.applicantNo, postUrl, "");
      
      console.log('게시물 URL 저장 성공:', { applicantNo: selectedPet.applicantNo, postUrl });
      
      // 성공 시 모달 닫기
      onClose();
      // 성공 메시지 표시 (선택사항)
      alert('게시물 URL이 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('게시물 URL 저장 실패:', error);
      setError('게시물 URL 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPostUrl('');
    setError('');
    setSelectedPet(null);
    setApplicants([]);
    setExistingReview(null);
    setRejectionReason('');
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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 1L16 9L9 17M2 9H16"
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
                      applicants.map((applicant) => (
                        <option key={applicant.applicantNo} value={applicant.applicantNo}>
                          {applicant.pet?.name || `펫 ${applicant.applicantNo}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

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

            {/* 반려 사유 */}
            {rejectionReason && (
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
                <p className={styles.rejectionReason}>{rejectionReason}</p>
                <p className={styles.warningMessage}>
                  위 사유로 인해 반려되었습니다. 수정 후 다시 등록해주세요.
                </p>
              </div>
            )}

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
            취소
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLoading || !selectedPet}
          >
            {isLoading ? '저장중' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
