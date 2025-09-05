"use client";
import React, { useState } from "react";
import styles from "../styles/CampaignActivityDetailModal.module.css";
import Image from "next/image";

const CampaignActivityDetailModal = ({
  isOpen,
  onClose,
  activityData,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !activityData) return null;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (activityData.imageUrls?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (activityData.imageUrls?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <Image
                  src="/user/foot.svg"
                  alt="Activity Icon"
                  width={18}
                  height={18}
                />
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.modalTitle}>활동 기록 상세</h2>
                <p className={styles.modalSubtitle}>
                  반려동물의 활동 기록을 자세히 확인해보세요
                </p>
              </div>
            </div>
            <button className={styles.closeButton} onClick={handleClose}>
              <Image
                src="/icons/close-icon.svg"
                alt="Close"
                width={25}
                height={24}
              />
            </button>
          </div>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className={styles.modalContent}>
          {/* 이미지 영역 */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {(() => {
                const imageSrc = activityData.imageUrls?.[currentImageIndex];

                return imageSrc &&
                  imageSrc.trim() !== "" &&
                  imageSrc !== "undefined" ? (
                  <Image
                    src={`http://dev.macacolabs.site:8008/3/pet/${imageSrc}`}
                    alt="Activity Image"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span>이미지 없음</span>
                  </div>
                );
              })()}

              {/* 이미지 네비게이션 버튼 */}
              <div className={styles.imageNavigation}>
                <button
                  className={styles.navButton}
                  onClick={handlePreviousImage}
                >
                  <Image
                    src="/user/left.svg"
                    alt="Previous"
                    width={16}
                    height={16}
                  />
                </button>
                <button className={styles.navButton} onClick={handleNextImage}>
                  <Image
                    src="/user/right.svg"
                    alt="Next"
                    width={16}
                    height={16}
                  />
                </button>
              </div>

              {/* 이미지 인디케이터 */}
              <div className={styles.imageIndicators}>
                {Array.from({ length: activityData.imageUrls?.length || 1 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className={`${styles.indicator} ${
                        index === currentImageIndex ? styles.active : ""
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* 폼 영역 */}
          <div className={styles.formSection}>
            {/* 활동 제목 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>활동 제목</label>
              <input
                type="text"
                value={activityData.title || ""}
                readOnly
                className={styles.formInput}
                placeholder="활동 제목을 입력하세요"
              />
            </div>

            {/* 활동 기간 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>활동 기간</label>
              <input
                type="text"
                value={`${activityData.historyStart || ''} ~ ${activityData.historyEnd || ''}`}
                readOnly
                className={styles.formInput}
                placeholder="활동 기간"
              />
            </div>

            {/* 활동 설명 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>활동 설명</label>
              <textarea
                value={activityData.content || ""}
                readOnly
                className={styles.formTextarea}
                placeholder="활동에 대한 자세한 설명을 입력하세요"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignActivityDetailModal;
