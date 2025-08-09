"use client";

import {
  FiEdit,
  FiPhone,
  FiMail,
  FiGlobe,
  FiSave,
  FiX,
  FiCamera,
} from "react-icons/fi";
import { useState, useRef } from "react";
import styles from "../styles/ProfilePage.module.css";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "PawsomeNutrition",
    description:
`PawsomeNutrition은 전 세계 반려동물에게 최고의 영양과 건강을 선사하기 위해 끊임없이 연구하고 노력하는 유기농 반려동물 사료 전문 기업입니다.
엄선된 유기농 원료만을 사용하여 안전하고 균형 잡힌 영양을 제공하며, 합성 첨가물과 인공 색소를 배제해 반려동물이 자연 그대로의 맛과 영양을 누릴 수 있도록 합니다.
또한 지속 가능한 생산과 친환경 포장을 통해 지구와 환경까지 생각하는 착한 기업으로, 반려동물과 보호자가 함께하는 모든 순간이 더 행복하고 건강할 수 있도록 최선을 다하고 있습니다.`,
    phone: "02-123-4567",
    email: "contact@pawsomenutrition.com",
    website: "www.pawsomenutrition.com",
    profileImage: "/campaign/brand-1.jpg",
  });

  const [editData, setEditData] = useState(companyData);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // 전화번호 분할 상태
  const splitPhone = (phone) => {
    // 숫자만 추출 후 3-4-4로 분리
    const nums = (phone || "").replace(/\D/g, "");
    return [nums.slice(0, 3), nums.slice(3, 7), nums.slice(7, 11)];
  };
  const [phoneFields, setPhoneFields] = useState(splitPhone(companyData.phone));

  const handleEdit = () => {
    setEditData(companyData);
    setPreviewImage(null);
    setIsEditing(true);
    setPhoneFields(splitPhone(companyData.phone));
  };

  const handleSave = () => {
    // 전화번호 합치기
    const phone = phoneFields.join("-");
    setCompanyData({ ...editData, phone });
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(companyData);
    setPreviewImage(null);
    setIsEditing(false);
    setPhoneFields(splitPhone(companyData.phone));
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhoneChange = (idx, value) => {
    // 숫자만 허용, 자리수 제한
    let maxLen = idx === 0 ? 3 : 4;
    let v = value.replace(/\D/g, "").slice(0, maxLen);
    setPhoneFields((prev) => prev.map((p, i) => (i === idx ? v : p)));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하로 선택해주세요.");
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreviewImage(imageUrl);
        handleInputChange("profileImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.cardContent}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            <div
              className={`${styles.imageWrapper} ${
                isEditing ? styles.editableImage : ""
              }`}
              onClick={handleImageClick}
            >
              <img
                src={previewImage || companyData.profileImage}
                alt="Company Profile"
                className={styles.profileImage}
              />
              {isEditing && (
                <div className={styles.imageOverlay}>
                  <FiCamera className={styles.cameraIcon} />
                  <span className={styles.overlayText}>이미지 변경</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>기업 이름</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={styles.editInput}
                />
              ) : (
                <h2 className={styles.companyName}>{companyData.name}</h2>
              )}
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: "24px" }}>
              <label className={styles.label}>기업 소개</label>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={styles.editTextarea}
                  rows="4"
                />
              ) : (
                <p className={styles.description}>{companyData.description}</p>
              )}
            </div>

            <div className={styles.contactRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>연락처</label>
                <div className={styles.contactItem}>
                  <FiPhone className={styles.contactIcon} />
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneFields[0]}
                        onChange={(e) => handlePhoneChange(0, e.target.value)}
                        className={styles.editContactInput}
                        style={{ width: 55, textAlign: "center" }}
                        maxLength={3}
                      />
                      <span style={{ margin: "0 4px" }}>-</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneFields[1]}
                        onChange={(e) => handlePhoneChange(1, e.target.value)}
                        className={styles.editContactInput}
                        style={{ width: 65, textAlign: "center" }}
                        maxLength={4}
                      />
                      <span style={{ margin: "0 4px" }}>-</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneFields[2]}
                        onChange={(e) => handlePhoneChange(2, e.target.value)}
                        className={styles.editContactInput}
                        style={{ width: 65, textAlign: "center" }}
                        maxLength={4}
                      />
                    </>
                  ) : (
                    <span className={styles.contactText}>
                      {companyData.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>웹사이트</label>
                <div className={styles.contactItem}>
                  <FiGlobe className={styles.contactIcon} />
                  {isEditing ? (
                    <input
                      type="url"
                      value={editData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className={styles.editContactInput}
                    />
                  ) : (
                    <span className={styles.contactText}>
                      {companyData.website}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.contactRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>이메일</label>
                <div className={styles.contactItem}>
                  <FiMail className={styles.contactIcon} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={styles.editContactInput}
                    />
                  ) : (
                    <span className={styles.contactText}>
                      {companyData.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className={styles.editButtons}>
              <button className={styles.saveButton} onClick={handleSave}>
                <FiSave className={styles.buttonIcon} />
                저장
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                <FiX className={styles.buttonIcon} />
                취소
              </button>
            </div>
          ) : (
            <button className={styles.editButton} onClick={handleEdit}>
              <FiEdit className={styles.editIcon} />
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
