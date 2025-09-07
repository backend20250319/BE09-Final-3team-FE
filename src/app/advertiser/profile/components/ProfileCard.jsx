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
import { useState, useRef, useEffect } from "react";
import styles from "../styles/ProfilePage.module.css";
import { getAdvertiser, updateAdvertiser, getFileByAdvertiserNo, updateFile } from "@/api/advertiserApi";
import { useImage } from "../../context/ImageContext";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const { refreshImage } = useImage();

  const DEFAULT_IMAGE_URL = `http://dev.macacolabs.site:8008/3/advertiser/images/default_brand.png`;

  // 전화번호 분할 상태
  const splitPhone = (phone) => {
    // 숫자만 추출 후 3-4-4로 분리
    const nums = (phone || "").replace(/\D/g, "");
    return [nums.slice(0, 3), nums.slice(3, 7), nums.slice(7, 11)];
  };

  const [editData, setEditData] = useState(companyData);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [phoneFields, setPhoneFields] = useState(["", "", ""]);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const loadProfileImage = async () => {
    try {
      setIsLoadingImage(true);
      const fileData = await getFileByAdvertiserNo();

      // status가 IMAGE인 항목을 찾아서 previewImage 설정
      const imageFile = fileData?.find(file => file.type === 'PROFILE');
      
      if (imageFile?.filePath && imageFile.filePath.trim() !== "") {
        setPreviewImage(imageFile.filePath);
      } else {
        setPreviewImage(DEFAULT_IMAGE_URL);
      }
    } catch (error) {
      console.error("Failed to load profile image:", error);
      setPreviewImage(DEFAULT_IMAGE_URL);
    } finally {
      setIsLoadingImage(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdvertiser();
        setCompanyData(data);
        setEditData(data);
        setPhoneFields(splitPhone(data?.phone));
      } catch (error) {
        console.error("Failed to get advertiser profile:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    loadProfileImage();
  }, [])

  const handleEdit = () => {
    setEditData(companyData);
    setIsEditing(true);
    setPhoneFields(splitPhone(companyData.phone));
    setUploadedFile(null);
  };

  const handleSave = async () => {
    // 웹사이트와 이메일 필드 검증
    const websiteInput = document.querySelector('input[type="url"]');
    const emailInput = document.querySelector('input[type="email"]');
    
    if (websiteInput && !websiteInput.checkValidity()) {
      websiteInput.reportValidity();
      return;
    }
    
    if (emailInput && !emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

  try {
    const phone = phoneFields.join("-");
    const updatedData = { ...editData, phone };
    const savedData = await updateAdvertiser(updatedData);

    if (uploadedFile) {
      try {
        await updateFile(uploadedFile);
      } catch (imageError) {
        console.error("Failed to upload image:", imageError);
      }
    }

    // 서버 응답 데이터로 상태 업데이트
    setCompanyData(savedData);
    setEditData(savedData);
    setIsEditing(false);
    setIsSaved(true);
    setUploadedFile(null);

    await loadProfileImage();

    refreshImage();
  } catch (error) {
    console.error("Failed to update advertiser profile:", error);
  }
}

  const handleCancel = () => {
    setIsSaved(false);
    setIsEditing(false);
    setUploadedFile(null);
    loadProfileImage();
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreviewImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 로딩 상태 처리
  if (!companyData) {
    return (
      <div className={styles.profileCard}>
        <div className={styles.cardContent}>
          <div className={styles.loadingContainer}>
            <p></p>
          </div>
        </div>
      </div>
    );
  }

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
              {isLoadingImage ? (
                <div></div>
              ) : (
                <>
                  <img
                    src={previewImage || DEFAULT_IMAGE_URL}
                    alt="Advertiser"
                    className={styles.avatar}
                  />
                  <div className={styles.userName}>{companyData?.name}</div>
                </>
              )}
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
                  value={editData?.name}
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
                  value={editData?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={styles.editTextarea}
                  rows="4"
                  placeholder="기업 소개를 입력해주세요"
                />
              ) : (
                <p className={styles.description}>
                  {companyData?.description || <span style={{ color: "#888" }}>기입된 기업 소개가 없습니다</span>}
                </p>
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
                      {companyData?.phone}
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
                      value={editData?.website || ""}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className={styles.editContactInput}
                      placeholder="웹사이트를 입력해주세요"
                    />
                  ) : (
                    <p className={styles.contactText}>
                      {companyData?.website || <span style={{ color: "#888" }}>기입된 웹사이트가 없습니다</span>}
                    </p>
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
                      value={editData?.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={styles.editContactInput}
                      placeholder="이메일을 입력해주세요"
                    />
                  ) : (
                    <p className={styles.contactText}>
                      {companyData?.email || <span style={{ color: "#888" }}>기입된 이메일이 없습니다</span>}
                    </p>
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
