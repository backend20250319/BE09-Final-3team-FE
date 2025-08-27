"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./PetProfileRegistration.module.css";

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

  // 수정 모드일 때 기존 데이터를 폼에 불러오기
  useEffect(() => {
    if (isEditMode && petData) {
      setFormData({
        name: petData.name || "",
        type: petData.type || "",
        age: petData.age || "",
        gender: petData.gender || "",
        weight: petData.weight || "",
        imageUrl: petData.imageUrl || "",
        snsUrl: petData.snsUrl || "",
      });
      setSelectedImage(petData.imageUrl || null);
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
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
        imageUrl: null, // 임시로 null로 설정
        imageNo: 1, // 임시로 기본값 설정
        snsProfileNo: formData.snsUrl ? 1 : null, // 임시로 기본값 설정
      };

      console.log("전송할 데이터:", requestData);
      console.log("전송할 데이터 JSON:", JSON.stringify(requestData));

      if (isEditMode && petData) {
        // 수정
        const response = await fetch(`${PET_API_BASE}/pets/${petData.petNo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(userNo && { "X-User-No": userNo }),
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "반려동물 수정에 실패했습니다.");
        }
      } else {
        // 등록
        const response = await fetch(`${PET_API_BASE}/pets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(userNo && { "X-User-No": userNo }),
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("백엔드 오류 응답:", errorData);
          throw new Error(errorData.message || "반려동물 등록에 실패했습니다.");
        }
      }

      onClose();
      // 부모 컴포넌트에서 목록 새로고침을 위해 콜백 호출
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }
      // 성공 메시지 표시
      if (onSuccessMessage) {
        onSuccessMessage(
          isEditMode
            ? "펫 정보가 수정되었습니다."
            : "반려동물이 등록되었습니다."
        );
      }
    } catch (error) {
      console.error("반려동물 저장 실패:", error);
      if (onSuccessMessage) {
        onSuccessMessage(error.message);
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
              <div className={styles.snsContainer}>
                <img
                  src="/user/instagram.svg"
                  alt="SNS"
                  className={styles.snsIcon}
                />
                <input
                  type="text"
                  value={formData.snsUrl}
                  onChange={(e) => handleInputChange("snsUrl", e.target.value)}
                  className={styles.input}
                  placeholder="SNS URL을 입력해주세요"
                />
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
    </div>
  );
};

export default PetProfileRegistration;
