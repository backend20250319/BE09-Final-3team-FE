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
    startDate: "",
    endDate: "",
    content: "",
    detailedContent: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const fileInputRef = useRef(null);

  // 수정 모드일 때 기존 데이터를 폼에 불러오기
  useEffect(() => {
    if (isEditMode && editingData) {
      // 기존 period 데이터를 startDate와 endDate로 분리
      let startDate = "";
      let endDate = "";

      if (editingData.period) {
        const periodParts = editingData.period.split(" ~ ");
        if (periodParts.length === 2) {
          startDate = periodParts[0];
          endDate = periodParts[1];
        } else {
          startDate = editingData.period;
          endDate = editingData.period;
        }
      }

      setFormData({
        title: editingData.title || "",
        startDate: startDate,
        endDate: endDate,
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
        startDate: "",
        endDate: "",
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

  const handleDateChange = (date, type) => {
    if (type === "startDate") {
      // 시작 시기를 종료 시기보다 늦게 설정하려는 경우
      if (formData.endDate && date > formData.endDate) {
        alert("시작 시기는 종료 시기보다 늦을 수 없습니다.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        startDate: date,
      }));
      setShowStartCalendar(false);
    } else {
      // 종료 시기를 시작 시기보다 이르게 설정하려는 경우
      if (formData.startDate && date < formData.startDate) {
        alert("종료 시기는 시작 시기보다 이를 수 없습니다.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        endDate: date,
      }));
      setShowEndCalendar(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const Calendar = ({
    selectedDate,
    onDateSelect,
    onClose,
    isVisible,
    isEndDate = false,
  }) => {
    if (!isVisible) return null;

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const days = generateCalendarDays(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    );

    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];

    const nextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    };

    const prevMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    };

    const handleDateClick = (date) => {
      const formattedDate = date.toISOString().split("T")[0];

      // 종료 시기 캘린더에서 시작 시기보다 이전 날짜 선택 방지
      if (
        isEndDate &&
        formData.startDate &&
        formattedDate < formData.startDate
      ) {
        alert("종료 시기는 시작 시기보다 이전 날짜를 선택할 수 없습니다.");
        return;
      }

      // 시작 시기 캘린더에서 종료 시기보다 이후 날짜 선택 방지
      if (!isEndDate && formData.endDate && formattedDate > formData.endDate) {
        alert("시작 시기는 종료 시기보다 이후 날짜를 선택할 수 없습니다.");
        return;
      }

      onDateSelect(formattedDate);
    };

    return (
      <div className={styles.calendarOverlay} onClick={onClose}>
        <div className={styles.calendar} onClick={(e) => e.stopPropagation()}>
          <div className={styles.calendarHeader}>
            <button onClick={prevMonth} className={styles.calendarNavButton}>
              ‹
            </button>
            <span className={styles.calendarTitle}>
              {currentMonth.getFullYear()}년{" "}
              {monthNames[currentMonth.getMonth()]}
            </span>
            <button onClick={nextMonth} className={styles.calendarNavButton}>
              ›
            </button>
          </div>

          <div className={styles.calendarGrid}>
            <div className={styles.calendarWeekdays}>
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className={styles.calendarWeekday}>
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.calendarDays}>
              {days.map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();
                const isSelected =
                  selectedDate === date.toISOString().split("T")[0];
                const isToday =
                  date.toDateString() === new Date().toDateString();

                // 종료 시기 캘린더에서 시작 시기보다 이전 날짜는 비활성화
                const isDisabled =
                  isEndDate &&
                  formData.startDate &&
                  date.toISOString().split("T")[0] < formData.startDate;

                // 시작 시기 캘린더에서 종료 시기보다 이후 날짜는 비활성화
                const isDisabledStart =
                  !isEndDate &&
                  formData.endDate &&
                  date.toISOString().split("T")[0] > formData.endDate;

                return (
                  <button
                    key={index}
                    className={`${styles.calendarDay} ${
                      !isCurrentMonth ? styles.otherMonth : ""
                    } ${isSelected ? styles.selected : ""} ${
                      isToday ? styles.today : ""
                    } ${isDisabled || isDisabledStart ? styles.disabled : ""}`}
                    onClick={() => handleDateClick(date)}
                    disabled={!isCurrentMonth || isDisabled || isDisabledStart}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
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
    if (!formData.startDate.trim()) {
      missingFields.push("시작 시기");
    }
    if (!formData.endDate.trim()) {
      missingFields.push("종료 시기");
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
    // period를 startDate와 endDate를 조합하여 생성
    const period = `${formData.startDate} ~ ${formData.endDate}`;

    const activityData = {
      ...formData,
      period: period, // 기존 period 형식으로 변환
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
      startDate: "",
      endDate: "",
      content: "",
      detailedContent: "",
    });
    setUploadedImages([]);
    setShowTempSaveModal(false);
    setShowValidationModal(false);
    setShowConfirmModal(false);
    setShowStartCalendar(false);
    setShowEndCalendar(false);
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
            <div className={styles.dateInputGroup}>
              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>시작 시기</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="text"
                    value={formatDateForDisplay(formData.startDate)}
                    placeholder="시작 날짜를 선택하세요"
                    className={styles.dateInput}
                    readOnly
                    onClick={() => setShowStartCalendar(true)}
                  />
                  <button
                    type="button"
                    className={styles.calendarButton}
                    onClick={() => setShowStartCalendar(true)}
                  >
                    📅
                  </button>
                </div>
              </div>

              <div className={styles.dateSeparator}>~</div>

              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>종료 시기</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="text"
                    value={formatDateForDisplay(formData.endDate)}
                    placeholder="종료 날짜를 선택하세요"
                    className={styles.dateInput}
                    readOnly
                    onClick={() => setShowEndCalendar(true)}
                  />
                  <button
                    type="button"
                    className={styles.calendarButton}
                    onClick={() => setShowEndCalendar(true)}
                  >
                    📅
                  </button>
                </div>
              </div>
            </div>
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

        {/* 캘린더 컴포넌트들 */}
        <Calendar
          selectedDate={formData.startDate}
          onDateSelect={(date) => handleDateChange(date, "startDate")}
          onClose={() => setShowStartCalendar(false)}
          isVisible={showStartCalendar}
          isEndDate={false}
        />

        <Calendar
          selectedDate={formData.endDate}
          onDateSelect={(date) => handleDateChange(date, "endDate")}
          onClose={() => setShowEndCalendar(false)}
          isVisible={showEndCalendar}
          isEndDate={true}
        />

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
