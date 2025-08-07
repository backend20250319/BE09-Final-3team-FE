"use client";

import { useState, useRef } from "react";
import styles from "./PetProfileRegistration.module.css";

const PetProfileRegistration = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "버디",
    breed: "",
    age: "1살",
    gender: "",
    description: "",
    sns: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleEdit = () => {
    console.log("Edit profile");
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete profile");
    onClose();
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
          <h1 className={styles.title}>반려동물 프로필</h1>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* Image Upload Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Pet profile"
                  className={styles.petImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <img
                    src="/user/upload.svg"
                    alt="Upload"
                    className={styles.uploadIcon}
                  />
                </div>
              )}
            </div>

            <div className={styles.uploadButtonContainer}>
              <img
                src="/user/upload.svg"
                alt="Upload"
                className={styles.uploadIcon}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <button
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
              >
                사진 업로드
              </button>
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

            {/* Breed and Age Fields */}
            <div className={styles.rowGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>품종</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  className={styles.input}
                  placeholder="품종을 입력해주세요."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>나이</label>
                <input
                  type="text"
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
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className={styles.select}
                >
                  <option value="" disabled hidden>
                    반려동물의 성별을 선택해주세요.
                  </option>
                  <option value="수컷">수컷</option>
                  <option value="암컷">암컷</option>
                </select>
                <img
                  src="/user/dropdown-sns.svg"
                  alt="Dropdown"
                  className={styles.dropdownIcon}
                />
              </div>
            </div>

            {/* SNS Field */}
            <div className={styles.formGroup}>
              <div className={styles.snsContainer}>
                <img
                  src="/user/instagram.svg"
                  alt="SNS"
                  className={styles.snsIcon}
                />
                <div className={styles.selectContainer}>
                  <select
                    value={formData.sns}
                    onChange={(e) => handleInputChange("sns", e.target.value)}
                    className={styles.select}
                  >
                    <option value="">SNS URL를 선택해주세요</option>
                    <option value="instagram">Instagram</option>
                  </select>
                  <img
                    src="/user/dropdown-sns.svg"
                    alt="Dropdown"
                    className={styles.dropdownIcon}
                  />
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>반려동물 한줄평</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={styles.textarea}
                placeholder="반려동물을 대표하는 한 줄평을 작성해주세요."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button className={styles.editButton} onClick={handleEdit}>
            <img
              src="/user/edit-icon.svg"
              alt="Edit"
              className={styles.buttonIcon}
            />
            수정
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <img
              src="/user/delete-icon.svg"
              alt="Delete"
              className={styles.buttonIcon}
            />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetProfileRegistration;
