"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./PetProfileRegistration.module.css";
import axios from "axios";

const PET_API_BASE = "http://localhost:8000/api/v1/pet-service";

const PetProfileRegistration = ({
  isOpen,
  onClose,
  petData,
  isEditMode,
  onSuccess,
  onSuccessMessage,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    age: "",
    gender: "",
    weight: "",
    imageUrl: "",
    snsUrl: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [fileTypeMessage, setFileTypeMessage] = useState("");

  // 수정 모드일 때 기존 데이터를 폼에 불러오기
  useEffect(() => {
    if (isEditMode && petData) {
      console.log("수정 모드 - 기존 펫 데이터:", petData);
      const updatedFormData = {
        name: petData.name || "",
        type: petData.type || "",
        age: petData.age || "",
        gender: petData.gender || "",
        weight: petData.weight || "",
        imageUrl: petData.imageUrl || "",
        snsUrl: petData.snsUrl && petData.snsUrl !== null ? petData.snsUrl : "",
      };
      setFormData(updatedFormData);
      console.log("설정된 formData.snsUrl:", petData.snsUrl);
      console.log("설정된 전체 formData:", updatedFormData);
      console.log("snsUrl 처리 결과:", updatedFormData.snsUrl);
      // 기존 이미지가 있으면 표시
      if (petData.imageUrl && petData.imageUrl.trim() !== "") {
        setSelectedImage(petData.imageUrl);
      } else {
        setSelectedImage(null);
      }
    } else {
      // 새로 등록할 때는 기본값으로 초기화
      setFormData({
        name: "",
        type: "",
        age: "",
        gender: "",
        weight: "",
        imageUrl: "",
        snsUrl: "",
      });
      setSelectedImage(null);
    }
  }, [isEditMode, petData]);

  // Select 요소 색상 초기화
  useEffect(() => {
    const genderSelect = document.querySelector('select[name="gender"]');

    if (genderSelect) {
      genderSelect.style.color = formData.gender ? "#000000" : "#9ca3af";
    }
  }, [formData.gender]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Select 요소의 색상 변경
    if (field === "gender") {
      const selectElement = document.querySelector(`select[name="${field}"]`);
      if (selectElement) {
        if (value) {
          selectElement.style.color = "#000000";
        } else {
          selectElement.style.color = "#9ca3af";
        }
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 지원하는 이미지 파일 확장자
    const supportedExtensions = ["jpg", "jpeg", "png"];

    // 파일 확장자 검증
    const extension = file.name.split(".").pop().toLowerCase();
    if (!supportedExtensions.includes(extension)) {
      setFileTypeMessage(
        `지원하지 않는 파일확장자입니다.\n(지원하는 파일확장자: ${supportedExtensions.join(
          ", "
        )})`
      );
      setShowFileTypeModal(true);
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      if (onSuccessMessage) {
        onSuccessMessage("파일 크기는 5MB 이하여야 합니다.");
      }
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      if (onSuccessMessage) {
        onSuccessMessage("이미지 파일만 업로드 가능합니다.");
      }
      return;
    }

    // 미리보기용으로 설정
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // 파일을 formData에 저장 (나중에 업로드용)
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = async () => {
    try {
      // 필수 필드 검증
      if (
        !formData.name ||
        !formData.type ||
        !formData.age ||
        !formData.gender ||
        !formData.weight
      ) {
        if (onSuccessMessage) {
          onSuccessMessage("모든 필수 필드를 입력해주세요.");
        }
        return;
      }

      const token = localStorage.getItem("token");
      const userNo = localStorage.getItem("userNo");

      const requestData = {
        name: formData.name,
        type: formData.type,
        age: parseInt(formData.age),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        imageUrl: formData.imageUrl || null,
        snsUrl:
          formData.snsUrl && formData.snsUrl !== null ? formData.snsUrl : "",
      };

      console.log("전송할 데이터:", requestData);
      console.log("수정 모드 여부:", isEditMode);
      console.log("기존 펫 데이터:", petData);
      console.log("현재 formData.snsUrl:", formData.snsUrl);
      console.log("formData.snsUrl 타입:", typeof formData.snsUrl);
      console.log("formData.snsUrl === null:", formData.snsUrl === null);
      console.log(
        "API 엔드포인트:",
        isEditMode
          ? `${PET_API_BASE}/pets/${petData.petNo}`
          : `${PET_API_BASE}/pets`
      );

      let petResponse;
      if (isEditMode && petData) {
        // 수정
        console.log("PUT 요청 시작 - 펫 번호:", petData.petNo);
        petResponse = await axios.put(
          `${PET_API_BASE}/pets/${petData.petNo}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
              ...(userNo && { "X-User-No": userNo }),
            },
          }
        );
        console.log("PUT 요청 응답:", petResponse.data);
      } else {
        // 등록
        petResponse = await axios.post(`${PET_API_BASE}/pets`, requestData, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(userNo && { "X-User-No": userNo }),
          },
        });
      }

      // 반려동물 등록/수정 성공 후 이미지 업로드
      if (formData.imageFile && petResponse.data.code === "2000") {
        const petNo = petResponse.data.data.petNo;

        const imageFormData = new FormData();
        imageFormData.append("file", formData.imageFile);

        try {
          const imageResponse = await axios.post(
            `${PET_API_BASE}/pets/${petNo}/image`,
            imageFormData,
            {
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(userNo && { "X-User-No": userNo }),
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (imageResponse.data.code === "2000") {
            console.log("이미지 업로드 성공:", imageResponse.data.data);
            // 이미지 업로드 성공 시 새로운 이미지 URL로 업데이트
            const newImageUrl = imageResponse.data.data.fileUrl;
            setFormData((prev) => ({
              ...prev,
              imageUrl: newImageUrl,
            }));
          } else {
            console.error("이미지 업로드 실패:", imageResponse.data.message);
          }
        } catch (imageError) {
          console.error("이미지 업로드 중 오류:", imageError);
          // 이미지 업로드 실패해도 반려동물 등록은 성공했으므로 계속 진행
        }
      }

      // 성공 로그 출력
      console.log(
        isEditMode ? "펫 프로필 수정 성공!" : "펫 프로필 등록 성공!",
        {
          petNo: petResponse.data.data.petNo,
          name: formData.name,
          type: formData.type,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          imageUrl: formData.imageUrl,
          snsUrl: formData.snsUrl,
          response: petResponse.data,
        }
      );

      // 성공 메시지 표시
      if (onSuccessMessage) {
        onSuccessMessage(
          isEditMode
            ? "펫 정보가 수정되었습니다."
            : "반려동물이 등록되었습니다."
        );
      }

      onClose();
      // 부모 컴포넌트에서 목록 새로고침을 위해 콜백 호출
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      console.error("반려동물 저장 실패:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "반려동물 저장에 실패했습니다.";
      if (onSuccessMessage) {
        onSuccessMessage(errorMessage);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h1 className={styles.title}>
            {isEditMode ? "반려동물 프로필 수정" : "반려동물 프로필"}
          </h1>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* Image Upload Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {selectedImage ? (
                <div className={styles.imageWrapper}>
                  <img
                    src={selectedImage}
                    alt="Pet profile"
                    className={styles.petImage}
                  />
                  <div className={styles.imageOverlay}>
                    <button
                      className={styles.overlayUploadButton}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isEditMode ? "사진 변경" : "사진 업로드"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <img
                    src="/user/upload.svg"
                    alt="Upload"
                    className={styles.uploadIcon}
                  />
                  <button
                    className={styles.placeholderUploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isEditMode ? "사진 변경" : "사진 업로드"}
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className={styles.formSection}>
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={styles.input}
                placeholder="반려동물 이름"
              />
            </div>

            {/* Type and Age Fields */}
            <div className={styles.rowGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>품종</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className={styles.input}
                  placeholder="품종을 입력해주세요."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>나이</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className={styles.input}
                  placeholder="나이"
                />
              </div>
            </div>

            {/* Gender Field */}
            <div className={styles.formGroup}>
              <label className={styles.genderLabel}>성별</label>
              <div className={styles.selectContainer}>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className={styles.select}
                >
                  <option value="" disabled hidden>
                    반려동물의 성별을 선택해주세요.
                  </option>
                  <option value="M">수컷</option>
                  <option value="F">암컷</option>
                </select>
                <img
                  src="/user/dropdown-sns.svg"
                  alt="Dropdown"
                  className={styles.dropdownIcon}
                />
              </div>
            </div>

            {/* Weight Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>체중 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className={styles.input}
                placeholder="체중을 입력해주세요"
              />
            </div>

            {/* SNS URL Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>SNS URL</label>
              <div className={styles.snsContainer}>
                <img
                  src="/user/instagram.svg"
                  alt="SNS"
                  className={styles.snsIcon}
                />
                <div className={styles.snsUrlInputContainer}>
                  <span className={styles.snsUrlPrefix}>
                    www.instagram.com/
                  </span>
                  <input
                    type="text"
                    value={
                      formData.snsUrl &&
                      formData.snsUrl !== null &&
                      formData.snsUrl !== "" &&
                      formData.snsUrl.includes("www.instagram.com/")
                        ? formData.snsUrl.replace("www.instagram.com/", "")
                        : ""
                    }
                    onChange={(e) => {
                      const username = e.target.value;
                      const fullUrl = username
                        ? `www.instagram.com/${username}`
                        : "";
                      handleInputChange("snsUrl", fullUrl);
                    }}
                    className={styles.snsUrlInput}
                    placeholder="사용자명"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button className={styles.editButton} onClick={handleSubmit}>
            <img
              src="/user/edit-icon.svg"
              alt="Edit"
              className={styles.buttonIcon}
            />
            {isEditMode ? "수정 완료" : "등록"}
          </button>
        </div>
      </div>

      {/* 파일 타입 검증 모달 */}
      {showFileTypeModal && (
        <div className={styles.fileTypeModalOverlay}>
          <div
            className={styles.fileTypeModalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.fileTypeModalContent}>
              <div className={styles.fileTypeWarningIcon}>
                <span>⚠️</span>
              </div>
              <h3 className={styles.fileTypeModalTitle}>
                지원하지 않는 파일 형식
              </h3>
              <p className={styles.fileTypeModalMessage}>{fileTypeMessage}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowFileTypeModal(false)}
                className={styles.fileTypeModalButton}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProfileRegistration;
