"use client";
import React, { useState } from "react";
import styles from "./ActivityDetailModal.module.css";
import Image from "next/image";

const ActivityDetailModal = ({ isOpen, onClose, activityData, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageSelectionMode, setIsImageSelectionMode] = useState(false);

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

  // 이미지 선택 모드 토글
  const toggleImageSelectionMode = () => {
    setIsImageSelectionMode(!isImageSelectionMode);
    if (!isImageSelectionMode) {
      setSelectedImages([]);
    }
  };

  // 이미지 선택/해제
  const handleImageSelect = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  // 선택된 이미지들 삭제
  const handleDeleteSelectedImages = async () => {
    if (selectedImages.length === 0) return;

    const confirmDelete = window.confirm(
      `선택된 ${selectedImages.length}개의 이미지를 삭제하시겠습니까?`
    );
    if (!confirmDelete) return;

    try {
      // 백엔드 이미지 ID들을 추출
      const backendImageIds = selectedImages
        .map((imageId) => {
          const image = activityData.images?.find((img) => img.id === imageId);
          return image?.imageId || image?.fileName; // 백엔드 ID 또는 파일명 사용
        })
        .filter((id) => id); // null/undefined 제거

      if (backendImageIds.length === 0) {
        alert("삭제할 이미지를 찾을 수 없습니다.");
        return;
      }

      const imageIdsParam = backendImageIds.join(",");
      console.log("삭제할 백엔드 이미지 ID들:", backendImageIds);

      const response = await fetch(
        `/api/pets/${activityData.petNo}/histories/${activityData.historyNo}/images?imageIds=${imageIdsParam}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-User-No": localStorage.getItem("userNo"),
          },
        }
      );

      if (response.ok) {
        alert("선택된 이미지가 삭제되었습니다.");
        setSelectedImages([]);
        setIsImageSelectionMode(false);
        // 부모 컴포넌트에 이미지 삭제 완료 알림
        if (onDelete) {
          onDelete(activityData);
        }
      } else {
        const errorData = await response.json();
        console.error("이미지 삭제 실패:", errorData);
        alert("이미지 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      alert("이미지 삭제 중 오류가 발생했습니다.");
    }
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

            {/* 이미지 선택 체크박스들 */}
            {isImageSelectionMode && (
              <div className={styles.imageCheckboxes}>
                {activityData.images?.map((image, index) => {
                  const uniqueKey = `${activityData.historyNo}-${index}`;
                  const imageId = image.id || uniqueKey;

                  return (
                    <div key={uniqueKey} className={styles.imageCheckbox}>
                      <input
                        type="checkbox"
                        id={`image-${uniqueKey}`}
                        checked={selectedImages.includes(imageId)}
                        onChange={() => handleImageSelect(imageId)}
                      />
                      <label htmlFor={`image-${uniqueKey}`}>
                        이미지 {index + 1}
                        {image.imageId && ` (ID: ${image.imageId})`}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
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

        {/* 액션 버튼 영역 */}
        <div className={styles.actionSection}>
          <div className={styles.buttonRow}>
            <div className={styles.leftButtons}>
              <button
                className={styles.selectionModeButton}
                onClick={toggleImageSelectionMode}
              >
                {isImageSelectionMode ? "선택 모드 해제" : "이미지 선택"}
              </button>

              {isImageSelectionMode && selectedImages.length > 0 && (
                <button
                  className={styles.deleteImagesButton}
                  onClick={handleDeleteSelectedImages}
                >
                  선택된 이미지 삭제 ({selectedImages.length}개)
                </button>
              )}
            </div>

            {onDelete && (
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(activityData)}
              >
                활동이력 삭제
              </button>
            )}
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
