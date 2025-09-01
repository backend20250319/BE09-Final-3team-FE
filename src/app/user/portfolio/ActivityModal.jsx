"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./ActivityModal.module.css";
import Image from "next/image";
import axios from "axios";

const ActivityModal = ({
  isOpen,
  onClose,
  onSave,
  isEditMode,
  editingData,
}) => {
  // API 기본 URL
  const PET_API_BASE = "http://localhost:8000/api/v1/pet-service";

  // URL 파라미터에서 petNo 가져오기
  const getPetNo = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("petId");
    }
    return null;
  };
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
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [fileTypeMessage, setFileTypeMessage] = useState("");
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
        const periodParts = editingData.period.split(" - ");
        if (periodParts.length === 2) {
          startDate = periodParts[0].trim();
          endDate = periodParts[1].trim();
        } else {
          startDate = editingData.period.trim();
          endDate = editingData.period.trim();
        }
      }

      // 날짜 형식 검증 및 변환
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";

        // YYYY-MM-DD 형식인지 확인
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(dateStr)) {
          return dateStr;
        }

        // 다른 형식의 날짜인 경우 Date 객체로 변환 시도
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          // YYYY-MM-DD 형식으로 변환
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }

        return "";
      };

      const formattedStartDate = formatDateForInput(startDate);
      const formattedEndDate = formatDateForInput(endDate);

      console.log("원본 period:", editingData.period);
      console.log("파싱된 startDate:", startDate);
      console.log("파싱된 endDate:", endDate);
      console.log("변환된 startDate:", formattedStartDate);
      console.log("변환된 endDate:", formattedEndDate);

      setFormData({
        title: editingData.title || "",
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        content: editingData.content || "",
        detailedContent: editingData.detailedContent || "",
      });

      // 기존 이미지들을 모두 불러오기
      if (editingData.images && editingData.images.length > 0) {
        // images 배열이 있는 경우 (이미 객체 형태로 되어 있음)
        const existingImages = editingData.images
          .filter((image) => {
            if (typeof image === "string") {
              return (
                image &&
                image.trim() !== "" &&
                image !== "undefined" &&
                !image.toLowerCase().endsWith(".webp") && // .webp 파일 제외
                !image.toLowerCase().endsWith(".gif") // .gif 파일 제외
              );
            }
            // 객체 형태인 경우 preview나 url에서 .webp 파일 제외
            const imageUrl = image.preview || image.url || image;
            if (typeof imageUrl === "string") {
              return (
                image &&
                (image.preview || image.url) &&
                !imageUrl.toLowerCase().endsWith(".webp") && // .webp 파일 제외
                !imageUrl.toLowerCase().endsWith(".gif") // .gif 파일 제외
              );
            }
            return image && (image.preview || image.url);
          })
          .map((image, index) => ({
            id: image.id || Date.now() + index,
            file: image.file || null,
            preview:
              typeof image === "string"
                ? image.startsWith("http")
                  ? image
                  : image.startsWith("/")
                  ? image
                  : `http://dev.macacolabs.site:8008/3/pet/${image}`
                : image.preview || image.url || image,
          }));
        setUploadedImages(existingImages);
      } else if (
        editingData.image &&
        editingData.image !== "/campaign-1.jpg" &&
        editingData.image.trim() !== "" &&
        editingData.image !== "undefined" &&
        !editingData.image.toLowerCase().endsWith(".webp") && // .webp 파일 제외
        !editingData.image.toLowerCase().endsWith(".gif") // .gif 파일 제외
      ) {
        // 단일 image가 있는 경우
        setUploadedImages([
          {
            id: Date.now(),
            file: null,
            preview: editingData.image.startsWith("http")
              ? editingData.image
              : editingData.image.startsWith("/")
              ? editingData.image
              : `http://dev.macacolabs.site:8008/3/pet/${editingData.image}`,
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

    // YYYY-MM-DD 형식인지 확인
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateString)) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    }

    // 다른 형식의 날짜인 경우 변환 시도
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    // 날짜 변환에 실패한 경우 원본 문자열 반환
    console.warn("날짜 변환 실패:", dateString);
    return dateString;
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

    // 지원하는 이미지 파일 확장자
    const supportedExtensions = ["jpg", "jpeg", "png"];

    // 파일 확장자 검증
    const invalidFiles = files.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return !supportedExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      const invalidExtensions = [
        ...new Set(
          invalidFiles.map((file) => file.name.split(".").pop().toLowerCase())
        ),
      ].join(", ");

      setFileTypeMessage(
        `지원하지 않는 파일확장자입니다.\n(지원하는 파일확장자: ${supportedExtensions.join(
          ", "
        )})`
      );
      setShowFileTypeModal(true);
      return;
    }

    // 파일 크기 검증 (10MB 이하)
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);

    if (uploadedImages.length + validFiles.length > 10) {
      alert("최대 10장까지만 업로드 가능합니다.");
      return;
    }

    const newImages = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  // 이미지 삭제 (백엔드 API 호출)
  const removeImage = async (id) => {
    try {
      const imageToRemove = uploadedImages.find((img) => img.id === id);
      if (!imageToRemove) return;

      // 새로 업로드된 이미지인 경우 (아직 백엔드에 저장되지 않음)
      if (imageToRemove.file) {
        setUploadedImages((prev) => {
          const imageToRemove = prev.find((img) => img.id === id);
          if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
          }
          return prev.filter((img) => img.id !== id);
        });
        return;
      }

      // 기존 이미지인 경우 백엔드에서 삭제
      if (isEditMode && editingData?.historyNo) {
        const petNo = getPetNo();
        if (!petNo) {
          alert("반려동물 정보를 찾을 수 없습니다.");
          return;
        }

        // 이미지 ID 추출 (백엔드에서 받은 imageId 사용)
        let imageId = null;
        if (imageToRemove.imageId) {
          imageId = imageToRemove.imageId;
        } else if (typeof imageToRemove.preview === "string") {
          // preview에서 파일명을 추출하여 임시로 사용
          if (imageToRemove.preview.startsWith("http")) {
            imageId = imageToRemove.preview.split("/").pop();
          } else {
            imageId = imageToRemove.preview;
          }
        }

        if (!imageId) {
          alert("이미지 ID를 찾을 수 없습니다.");
          return;
        }

        // 백엔드에서 이미지 삭제 (개별 이미지 삭제)
        const response = await axios.delete(
          `${PET_API_BASE}/pets/${petNo}/histories/${editingData.historyNo}/images/${imageId}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (response.data.code === "2000") {
          console.log("이미지 삭제 성공:", imageId);
          // 프론트엔드에서도 이미지 제거
          setUploadedImages((prev) => prev.filter((img) => img.id !== id));
        } else {
          console.error("이미지 삭제 실패:", response.data.message);
          alert("이미지 삭제에 실패했습니다.");
        }
      } else {
        // 편집 모드가 아닌 경우 프론트엔드에서만 제거
        setUploadedImages((prev) => {
          const imageToRemove = prev.find((img) => img.id === id);
          if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
          }
          return prev.filter((img) => img.id !== id);
        });
      }
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      alert("이미지 삭제 중 오류가 발생했습니다.");
    }
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

  // 인증 헤더 가져오기
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const userNo = localStorage.getItem("userNo");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (userNo) {
      headers["X-User-No"] = userNo;
    }

    return headers;
  };

  // History 생성 및 이미지 업로드
  const createHistoryWithImages = async (historyData, images) => {
    try {
      const petNo = getPetNo();
      if (!petNo) {
        throw new Error("반려동물 정보를 찾을 수 없습니다.");
      }

      // 1. History 생성 또는 수정
      console.log("historyData.startDate:", historyData.startDate);
      console.log("historyData.endDate:", historyData.endDate);

      // 기존 이미지 정보 추출 (수정 모드에서만)
      let existingImageUrls = [];
      if (isEditMode && editingData && editingData.images) {
        existingImageUrls = editingData.images
          .filter((img) => img && img.preview && !img.file) // 새로 업로드되지 않은 기존 이미지만
          .map((img) => {
            // preview가 전체 URL인지 파일명인지 확인
            if (typeof img.preview === "string") {
              if (img.preview.startsWith("http")) {
                // 전체 URL에서 파일명만 추출
                return img.preview.split("/").pop();
              } else if (img.preview.startsWith("/")) {
                // 로컬 경로는 제외
                return null;
              } else {
                // 파일명 그대로 사용
                return img.preview;
              }
            }
            return null;
          })
          .filter((url) => url); // null 값 제거
      }

      const historyRequest = {
        title: historyData.title, // 제목 필드 추가
        historyStart: historyData.startDate, // YYYY-MM-DD 형식 (예: "2025-09-21")
        historyEnd: historyData.endDate, // YYYY-MM-DD 형식 (예: "2025-09-28")
        content: historyData.content,
        image_urls: existingImageUrls, // 기존 이미지 URL들 추가
      };

      console.log("기존 이미지 URL들:", existingImageUrls);
      console.log("전송할 History 데이터:", historyRequest);

      let historyResponse;
      let historyNo;

      if (isEditMode && editingData && editingData.historyNo) {
        // 수정 모드
        console.log("History 수정 요청:", historyRequest);
        historyResponse = await axios.put(
          `${PET_API_BASE}/pets/${petNo}/histories/${editingData.historyNo}`,
          historyRequest,
          {
            headers: getAuthHeaders(),
          }
        );
        historyNo = editingData.historyNo;
      } else {
        // 생성 모드
        console.log("History 생성 요청:", historyRequest);
        historyResponse = await axios.post(
          `${PET_API_BASE}/pets/${petNo}/histories`,
          historyRequest,
          {
            headers: getAuthHeaders(),
          }
        );
        historyNo = historyResponse.data.data.historyNo;
      }

      if (historyResponse.data.code !== "2000") {
        throw new Error(
          isEditMode
            ? "History 수정에 실패했습니다."
            : "History 생성에 실패했습니다."
        );
      }

      console.log(
        isEditMode ? "History 수정 성공" : "History 생성 성공, historyNo:",
        historyNo
      );

      // 2. 이미지 업로드 (이미지가 있는 경우)
      if (images && images.length > 0) {
        const imageFiles = images.filter((img) => img.file); // 실제 파일만 필터링

        if (imageFiles.length > 0) {
          const imageFormData = new FormData();
          imageFiles.forEach((image, index) => {
            imageFormData.append("files", image.file);
          });

          console.log("이미지 업로드 시작:", imageFiles.length, "개");

          const imageResponse = await axios.post(
            `${PET_API_BASE}/pets/${petNo}/histories/${historyNo}/images`,
            imageFormData,
            {
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (imageResponse.data.code === "2000") {
            console.log("이미지 업로드 성공:", imageResponse.data.data);

            // 백엔드에서 반환한 이미지 정보를 로그로 확인
            if (imageResponse.data.data && imageResponse.data.data.images) {
              console.log(
                "업로드된 이미지 정보:",
                imageResponse.data.data.images
              );
            }
          } else {
            console.error("이미지 업로드 실패:", imageResponse.data.message);
          }
        }
      }

      return historyResponse.data.data;
    } catch (error) {
      console.error("History 생성/수정 및 이미지 업로드 실패:", error);
      throw error;
    }
  };

  const handleConfirmSave = async () => {
    try {
      // period를 startDate와 endDate를 조합하여 생성
      const period = `${formData.startDate} - ${formData.endDate}`;

      // History 생성 및 이미지 업로드
      const historyResult = await createHistoryWithImages(
        formData,
        uploadedImages
      );

      const activityData = {
        ...formData,
        period: period, // 기존 period 형식으로 변환
        images: uploadedImages,
        id: isEditMode && editingData ? editingData.id : Date.now(),
        historyNo:
          isEditMode && editingData
            ? editingData.historyNo
            : historyResult.historyNo, // 수정 모드에서는 기존 historyNo 유지
      };

      onSave(activityData);
      handleClose();
      setShowConfirmModal(false);
    } catch (error) {
      console.error("활동 이력 저장 실패:", error);
      setValidationMessage("활동 이력 저장에 실패했습니다. 다시 시도해주세요.");
      setShowValidationModal(true);
      setShowConfirmModal(false);
    }
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
          <div
            className={styles.uploadArea}
            onClick={handleImageUpload}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);

              // 지원하는 이미지 파일 확장자
              const supportedExtensions = ["jpg", "jpeg", "png"];

              // 파일 확장자 검증
              const invalidFiles = files.filter((file) => {
                const extension = file.name.split(".").pop().toLowerCase();
                return !supportedExtensions.includes(extension);
              });

              if (invalidFiles.length > 0) {
                const invalidExtensions = [
                  ...new Set(
                    invalidFiles.map((file) =>
                      file.name.split(".").pop().toLowerCase()
                    )
                  ),
                ].join(", ");

                setFileTypeMessage(
                  `지원하지 않는 파일확장자입니다.\n(지원하는 파일확장자: ${supportedExtensions.join(
                    ", "
                  )})`
                );
                setShowFileTypeModal(true);
                return;
              }

              // 파일 크기 검증 (10MB 이하)
              const validFiles = files.filter(
                (file) => file.size <= 10 * 1024 * 1024
              );

              if (uploadedImages.length + validFiles.length > 10) {
                alert("최대 10장까지만 업로드 가능합니다.");
                return;
              }

              const newImages = validFiles.map((file, index) => ({
                id: Date.now() + index,
                file: file,
                preview: URL.createObjectURL(file),
              }));

              setUploadedImages((prev) => [...prev, ...newImages]);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
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
                  {image.preview &&
                  image.preview.trim() !== "" &&
                  image.preview !== "undefined" ? (
                    <Image
                      src={image.preview}
                      alt="Preview"
                      width={70}
                      height={70}
                      className={styles.previewImage}
                      onError={(e) => {
                        // 이미지 로드 실패 시 기본 이미지로 대체
                        e.target.src = "/user/upload.svg";
                      }}
                    />
                  ) : (
                    <div className={styles.previewPlaceholder}>
                      <Image
                        src="/user/upload.svg"
                        alt="Preview Placeholder"
                        width={40}
                        height={33}
                      />
                    </div>
                  )}
                  <button
                    className={styles.removeImageButton}
                    onClick={async () => await removeImage(image.id)}
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

        {/* 파일 확장자 검증 모달 */}
        {showFileTypeModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.alertModal}>
              <div className={styles.alertContent}>
                <div className={`${styles.alertIcon} ${styles.warningIcon}`}>
                  ⚠
                </div>
                <h3 className={styles.alertTitle}>
                  지원하지 않는 파일확장자입니다.
                </h3>
                <p
                  className={styles.alertMessage}
                  style={{ whiteSpace: "pre-line", textAlign: "center" }}
                >
                  {fileTypeMessage}
                </p>
                <button
                  className={styles.alertButton}
                  onClick={() => setShowFileTypeModal(false)}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityModal;
