"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./ActivityModal.module.css";
import Image from "next/image";

const ActivityModal = ({
  isOpen,
  onClose,
  onSave,
  isEditMode,
  editingData,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    content: "",
    detailedContent: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const fileInputRef = useRef(null);

  // 수정 모드일 때 기존 데이터를 폼에 불러오기
  useEffect(() => {
    if (isEditMode && editingData) {
      setFormData({
        title: editingData.title || "",
        period: editingData.period || "",
        content: editingData.content || "",
        detailedContent: editingData.detailedContent || "",
      });

      // 기존 이미지들을 모두 불러오기
      if (editingData.images && editingData.images.length > 0) {
        // images 배열이 있는 경우
        const existingImages = editingData.images.map((image, index) => ({
          id: Date.now() + index,
          file: null,
          preview: image.startsWith("/") ? image : `/${image}`,
        }));
        setUploadedImages(existingImages);
      } else if (editingData.image && editingData.image !== "/campaign-1.jpg") {
        // 단일 image가 있는 경우
        setUploadedImages([
          {
            id: Date.now(),
            file: null,
            preview: editingData.image.startsWith("/")
              ? editingData.image
              : `/${editingData.image}`,
          },
        ]);
      } else {
        setUploadedImages([]);
      }
    } else {
      // 새로 등록할 때는 기본값으로 초기화
      setFormData({
        title: "",
        period: "",
        content: "",
        detailedContent: "",
      });
      setUploadedImages([]);
    }
  }, [isEditMode, editingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB 이하

    if (uploadedImages.length + validFiles.length > 10) {
      alert("최대 10장까지만 업로드 가능합니다.");
      return;
    }

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleTempSave = () => {
    // 임시저장 모달 표시
    setShowTempSaveModal(true);

    // 2초 후 모달 자동 닫기
    setTimeout(() => {
      setShowTempSaveModal(false);
    }, 2000);
  };

  const handleSave = () => {
    // 필수 필드 검증
    const missingFields = [];

    if (!formData.title.trim()) {
      missingFields.push("활동 이력 제목");
    }
    if (!formData.period.trim()) {
      missingFields.push("활동 시기");
    }
    if (!formData.content.trim()) {
      missingFields.push("활동 내역");
    }

    if (missingFields.length > 0) {
      // 작성되지 않은 내용이 있는 경우
      setValidationMessage(
        `${missingFields.join(", ")}이(가) 작성되지 않았습니다.`
      );
      setShowValidationModal(true);
      return;
    }

    // 모든 필드가 작성된 경우 확인 모달 표시
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    const activityData = {
      ...formData,
      images: uploadedImages,
      id: isEditMode && editingData ? editingData.id : Date.now(),
    };

    onSave(activityData);
    handleClose();
    setShowConfirmModal(false);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      period: "",
      content: "",
      detailedContent: "",
    });
    setUploadedImages([]);
    setShowTempSaveModal(false);
    setShowValidationModal(false);
    setShowConfirmModal(false);
    onClose();
  };

  if (!isOpen) return null;

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
                  alt="Upload Icon"
                  width={18}
                  height={18}
                />
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.modalTitle}>
                  {isEditMode ? "활동이력 카드 수정" : "활동이력 카드 등록"}
                </h2>
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

        {/* 이미지 업로드 영역 */}
        <div className={styles.imageUploadSection}>
          <div className={styles.uploadArea} onClick={handleImageUpload}>
            <div className={styles.uploadIcon}>
              <Image
                src="/user/upload.svg"
                alt="Upload"
                width={82}
                height={67}
              />
            </div>
            <p className={styles.uploadText}>
              여기로 활동내역 이미지를 드래그하거나 클릭하여 업로드하세요
              <br />
              (최대 10장, 각 10MB 이하)
            </p>
          </div>

          {/* 업로드된 이미지 미리보기 */}
          {uploadedImages.length > 0 && (
            <div className={styles.imagePreviewGrid}>
              {uploadedImages.map((image) => (
                <div key={image.id} className={styles.imagePreview}>
                  <Image
                    src={image.preview}
                    alt="Preview"
                    width={70}
                    height={70}
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.removeImageButton}
                    onClick={() => removeImage(image.id)}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* 추가 버튼 */}
              {uploadedImages.length < 10 && (
                <div
                  className={styles.addImageButton}
                  onClick={handleImageUpload}
                >
                  <div className={styles.addImageIcon}>
                    <Image
                      src="/user/upload.svg"
                      alt="Add Image"
                      width={40}
                      height={33}
                    />
                  </div>
                  <span className={styles.addImageText}>추가</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 폼 영역 */}
        <div className={styles.formSection}>
          {/* 활동 이력 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>활동 이력 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="활동 이력의 제목을 작성해주세요."
              className={styles.formInput}
            />
          </div>
          {/* 활동 시기 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>활동 시기</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              placeholder="활동 시기를 입력해주세요."
              className={styles.formInput}
            />
          </div>

          {/* 활동 내역 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>활동 내역</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="활동 내역을 입력해주세요."
              className={styles.formTextarea}
              rows={4}
            />
          </div>

          {/* 상세 내용 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>상세 내용</label>
            <textarea
              name="detailedContent"
              value={formData.detailedContent}
              onChange={handleInputChange}
              placeholder="상세 내용을 입력해주세요."
              className={styles.formTextarea}
              rows={6}
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonSection}>
          <button className={styles.tempSaveButton} onClick={handleTempSave}>
            임시저장
          </button>
          <button className={styles.editButton} onClick={handleSave}>
            <Image
              src="/user/edit-icon.svg"
              alt="Edit"
              width={16}
              height={16}
            />
            {isEditMode ? "수정" : "등록"}
          </button>
          <button className={styles.deleteButton} onClick={handleClose}>
            <Image
              src="/user/delete-icon.svg"
              alt="Delete"
              width={14}
              height={16}
            />
            취소
          </button>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ display: "none" }}
        />

        {/* 임시저장 완료 모달 */}
        {showTempSaveModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.alertModal}>
              <div className={styles.alertContent}>
                <div className={`${styles.alertIcon} ${styles.successIcon}`}>
                  ✓
                </div>
                <h3 className={styles.alertTitle}>
                  임시저장이 완료되었습니다.
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* 검증 실패 모달 */}
        {showValidationModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.alertModal}>
              <div className={styles.alertContent}>
                <div className={`${styles.alertIcon} ${styles.warningIcon}`}>
                  ⚠
                </div>
                <h3 className={styles.alertTitle}>{validationMessage}</h3>
                <button
                  className={styles.alertButton}
                  onClick={() => setShowValidationModal(false)}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 등록 확인 모달 */}
        {showConfirmModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.alertModal}>
              <div className={styles.alertContent}>
                <div className={`${styles.alertIcon} ${styles.questionIcon}`}>
                  ?
                </div>
                <h3 className={styles.alertTitle}>등록하시겠습니까?</h3>
                <div className={styles.confirmButtons}>
                  <button
                    className={styles.confirmButton}
                    onClick={handleConfirmSave}
                  >
                    등록
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowConfirmModal(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityModal;
