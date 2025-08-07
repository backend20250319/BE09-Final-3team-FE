'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from "../styles/PostUrlModal.module.css"

export default function PostUrlModal({ isOpen, onClose, campaignData }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted URL:', url);
    onClose();
  };

  const handleCancel = () => {
    setUrl('');
    onClose();
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
                <Image 
                  src="/campaign/file.png"
                  alt="file.png"
                  width={18}
                  height={18}/>
              </div>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.modalTitle}>게시물 URL 등록</h2>
              <p className={styles.modalSubtitle}>
                체험한 상품에 대한 리뷰 게시물 URL을 등록해보세요
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <Image 
              src="/campaign/close.png"
              alt="close.png"
              width={14}
              height={14}/>
          </button>
        </div>

        {/* Form */}
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {/* Campaign Info */}
            <div className={styles.formSection}>
              <div className={styles.campaignInfo}>
                <label className={styles.formLabel}>참여한 캠페인</label>
                <div className={styles.campaignName}>
                  {campaignData.title}
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
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="게시물 URL을 작성해주세요"
                    className={styles.urlInput}
                    required
                  />
                  <div className={styles.inputIcon}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
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

            {/* Action Buttons */}
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                취소
              </button>
              <button type="submit" className={styles.submitButton}>
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
