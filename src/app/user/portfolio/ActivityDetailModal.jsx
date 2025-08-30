"use client";
import React, { useState } from "react";
import styles from "./ActivityDetailModal.module.css";
import Image from "next/image";

const ActivityDetailModal = ({ isOpen, onClose, activityData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !activityData) return null;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (activityData.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (activityData.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  const handleImageClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFullscreenClose = () => {
    setIsFullscreen(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
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
                <h2 className={styles.modalTitle}>활동 기록 관리</h2>
                <p className={styles.modalSubtitle}>
                  반려동물의 활동을 기록하고 관리하세요
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

        {/* 이미지 영역 */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {(() => {
              const imageSrc =
                activityData.images?.[currentImageIndex]?.preview ||
                activityData.images?.[currentImageIndex] ||
                activityData.image ||
                "/campaign-1.jpg";

              return imageSrc &&
                imageSrc.trim() !== "" &&
                imageSrc !== "undefined" ? (
                <Image
                  src={imageSrc}
                  alt="Activity Image"
                  layout="fill"
                  objectFit="cover"
                  onClick={handleImageClick}
                  style={{ cursor: "pointer" }}
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    e.target.src = "/campaign-1.jpg";
                  }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Image
                    src="/campaign-1.jpg"
                    alt="Default Activity Image"
                    layout="fill"
                    objectFit="cover"
                  />
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
              {Array.from({ length: activityData.images?.length || 1 }).map(
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
              value={activityData.period || ""}
              readOnly
              className={styles.formInput}
              placeholder="2025-08-01 ~ 2025-08-01"
            />
          </div>

          {/* 활동 설명 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>활동 설명</label>
            <textarea
              value={activityData.detailedContent || activityData.content || ""}
              readOnly
              className={styles.formTextarea}
              placeholder="활동에 대한 자세한 설명을 입력하세요"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* 풀스크린 이미지 모달 */}
      {isFullscreen && (
        <div
          className={styles.fullscreenOverlay}
          onClick={handleFullscreenClose}
        >
          <div
            className={styles.fullscreenContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 풀스크린 이미지 네비게이션 */}
            <div className={styles.fullscreenNavigation}>
              <button
                className={styles.fullscreenNavButton}
                onClick={handlePreviousImage}
              >
                <Image
                  src="/user/left.svg"
                  alt="Previous"
                  width={20}
                  height={20}
                />
              </button>
              <button
                className={styles.fullscreenNavButton}
                onClick={handleNextImage}
              >
                <Image
                  src="/user/right.svg"
                  alt="Next"
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {(() => {
              const imageSrc =
                activityData.images?.[currentImageIndex]?.preview ||
                activityData.images?.[currentImageIndex] ||
                activityData.image ||
                "/campaign-1.jpg";

              return imageSrc &&
                imageSrc.trim() !== "" &&
                imageSrc !== "undefined" ? (
                <Image
                  src={imageSrc}
                  alt="Activity Image Fullscreen"
                  layout="fill"
                  objectFit="contain"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    e.target.src = "/campaign-1.jpg";
                  }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Image
                    src="/campaign-1.jpg"
                    alt="Default Activity Image Fullscreen"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetailModal;
