"use client"

import React, { useState, useEffect } from 'react';
import styles from "../styles/EditApplicationModal.module.css";
import { getApplicantsByAd, updateApplicant } from '@/api/campaignApi';

export default function EditApplicationModal({ isOpen, onClose, adNo }) {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && adNo) {
      fetchApplicants();
    } else if (isOpen && !adNo) {
      setError('광고 정보가 누락되었습니다.');
    }
  }, [isOpen, adNo]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const applicantsData = await getApplicantsByAd(adNo);
      setApplicants(applicantsData);
      
      if (applicantsData.length > 0) {
        setSelectedApplicant(applicantsData[0]);
        setContent(applicantsData[0].content || '');
      }
    } catch (error) {
      console.error('지원자 목록 조회 실패:', error);
      setError('지원자 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicantChange = (applicantNo) => {
    const applicant = applicants.find(app => app.applicantNo === parseInt(applicantNo));
    if (applicant) {
      setSelectedApplicant(applicant);
      setContent(applicant.content || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedApplicant) {
      setError('지원자를 선택해주세요.');
      return;
    }
    
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await updateApplicant(selectedApplicant.applicantNo, content);
      onClose();
      // 성공 메시지나 페이지 새로고침 등을 여기에 추가할 수 있습니다.
    } catch (error) {
      console.error('지원 내용 수정 실패:', error);
      setError('지원 내용 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setError('');
    setSelectedApplicant(null);
    setApplicants([]);
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
              <h2 className={styles.modalTitle}>추가 내용 수정</h2>
              <p className={styles.modalSubtitle}>
                추가 내용을 수정하여 더 나은 지원서를 작성해보세요
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
            {/* Applicant Selection */}
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>
                  지원자 선택
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputContainer}>
                  <select
                    id="applicant"
                    value={selectedApplicant?.applicantNo || ''}
                    onChange={(e) => handleApplicantChange(e.target.value)}
                    className={styles.select}
                    disabled={isLoading || applicants.length === 0}
                  >
                    {applicants.length === 0 ? (
                      <option value="">지원자가 없습니다</option>
                    ) : (
                      applicants.map((applicant) => (
                        <option key={applicant.applicantNo} value={applicant.applicantNo}>
                          {applicant.pet?.name || `지원자 ${applicant.applicantNo}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>
                  추가 내용
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputContainer}>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="추가 내용을 입력해주세요"
                    className={styles.textarea}
                    rows={6}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

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
            disabled={isLoading || !selectedApplicant}
          >
            {isLoading ? '수정중' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}
