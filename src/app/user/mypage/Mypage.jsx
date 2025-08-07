"use client";
import React, { useState, useRef } from "react";
import styles from "./Mypage.module.css";
import Image from "next/image";

const MyPage = () => {
  const [formData, setFormData] = useState({
    name: "정승원",
    phone: "010-1234-5678",
    email: "petlover123@email.com",
    instagram: "@buddytheretriever",
    bio: "안녕하세요! 골든 리트리버 '버디'와 함께 살고 있는 펫 인플루언서입니다. 반려동물과의 일상을 공유하고, 다양한 펫 용품을 소개하는 것을 좋아합니다.",
    address: "서울특별시 강남구",
    detailAddress: "",
    birthDate: "2001-08-10",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => setIsEditable(true);
  const handleSave = () => {
    console.log("저장하기:", formData);
    setIsEditable(false);
  };
  const handleCancel = () => setIsEditable(false);
  const handleConnect = () => console.log("연결하기");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      previewImage(file);
    }
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>마이페이지</h1>

          {!isEditable && (
            <div className={styles.editSection}>
              <button className={styles.editButton} onClick={handleEditToggle}>
                <Image src="/user/edit.svg" alt="편집" width={35} height={35} />
              </button>
            </div>
          )}

          <section className={styles.profileSection}>
            <div className={styles.profileContent}>
              <div className={styles.profileImageContainer}>
                <div
                  className={styles.profileImage}
                  onClick={triggerFileSelect}
                >
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="프로필 이미지"
                      layout="fill"
                      objectFit="cover"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <Image
                      src="/user/upload.svg"
                      alt="업로드 아이콘"
                      width={43}
                      height={31}
                      className={styles.cameraIcon}
                    />
                  )}
                </div>
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.nameContainer}>
                  <label className={styles.nameLabel}>이름</label>
                  <div className={styles.nameInputWrapper}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.nameInput}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.bioContainer}>
                  <label className={styles.bioLabel}>자기 소개</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={styles.bioTextarea}
                    readOnly={!isEditable}
                  />
                </div>

                <div className={styles.birthContainer}>
                  <label className={styles.birthLabel}>생년월일</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={styles.birthInput}
                    readOnly={!isEditable}
                  />
                </div>

                <div className={styles.addressContainer}>
                  <div className={styles.addressRow}>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={styles.addressInput}
                      readOnly={!isEditable}
                    />
                    <input
                      type="text"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleInputChange}
                      className={styles.detailAddressInput}
                      readOnly={!isEditable}
                    />
                  </div>
                  <span className={styles.locationLabel}>거주지 위치</span>
                </div>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </section>

          <section className={styles.additionalInfoSection}>
            <h3 className={styles.sectionTitle}>추가 정보</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>연락처</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  readOnly={!isEditable}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>이메일</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  readOnly={!isEditable}
                />
              </div>
            </div>
          </section>

          <section className={styles.socialMediaSection}>
            <h3 className={styles.sectionTitle}>소셜 미디어</h3>
            <div className={styles.socialMediaRow}>
              <div className={styles.instagramContainer}>
                <div className={styles.instagramIcon}>
                  <Image
                    src="/user/instagram.svg"
                    alt="Instagram"
                    width={35}
                    height={31}
                  />
                </div>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className={styles.instagramInput}
                  readOnly={!isEditable}
                />
                <button
                  className={styles.connectButton}
                  onClick={handleConnect}
                >
                  <div className={styles.connectIcon}>
                    <Image
                      src="/user/instagram.svg"
                      alt="연결"
                      width={23}
                      height={21}
                    />
                  </div>
                  <span>연결 하기</span>
                </button>
              </div>
            </div>
          </section>

          {isEditable && (
            <div className={styles.buttonSection}>
              <button className={styles.saveButton} onClick={handleSave}>
                저장하기
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                취소
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyPage;
