"use client";
import React, { useState, useRef } from "react";
import styles from "./Mypage.module.css";
import Image from "next/image";

const MyPage = () => {
  // ✅ 컨트롤드 입력을 위한 초기 빈 값
  const [formData, setFormData] = useState({
    name: "정승원",
    phone: "010-1234-1234",
    email: "petlover123@email.com",
    instagram: "@buddytheretriever",
    bio: "안녕하세요!골든 리트리버 ‘황금이’, 샴 고양이 ‘루나’, 푸른 마코 앵무 ‘찰리’와 함께하는 인플루언서 정승원입니다. 저는 반려동물과 함께하는 일상 속에서 다양한 상품과 서비스를 체험하고, 그 경험을 진솔하고 생생하게 전달하는 것을 주 컨텐츠로 삼고 있습니다.특히 펫 전용 제품 리뷰, 체험단 활동, 반려동물과의 라이프스타일 콘텐츠를 통해 많은 분들이 반려동물과의 삶을 더 풍성하게 즐길 수 있도록 돕고 있습니다.",
    address: "서울특별시 강남구",
    detailAddress: "",
    birthDate: "2001-08-10",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [birthType, setBirthType] = useState("text"); // ✅ placeholder 보기 좋게: text ↔ date
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
    if (file) previewImage(file);
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

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
                <div className={styles.profileImage} onClick={triggerFileSelect}>
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="프로필 이미지"
                      fill
                      style={{ objectFit: "cover", borderRadius: "50%" }}
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
                {/* 이름 */}
                <div className={styles.nameContainer}>
                  <label className={styles.nameLabel}>이름</label>
                  <div className={styles.nameInputWrapper}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name ?? ""}
                      onChange={handleInputChange}
                      className={styles.nameInput}
                      placeholder="이름을 입력하세요"
                      readOnly={!isEditable}
                    />
                  </div>
                </div>

                {/* 자기소개 */}
                <div className={styles.bioContainer}>
                  <label className={styles.bioLabel}>자기 소개</label>
                  <textarea
                    name="bio"
                    value={formData.bio ?? ""}
                    onChange={handleInputChange}
                    className={styles.bioTextarea}
                    placeholder="자기 소개를 입력하세요"
                    readOnly={!isEditable}
                  />
                </div>

                {/* 생년월일 */}
                <div className={styles.birthContainer}>
                  <label className={styles.birthLabel}>생년월일</label>
                  <input
                    type={birthType}
                    name="birthDate"
                    value={formData.birthDate ?? ""}
                    onChange={handleInputChange}
                    className={styles.birthInput}
                    placeholder="생년월일을 선택하세요"
                    onFocus={() => setBirthType("date")}
                    onBlur={() => {
                      if (!formData.birthDate) setBirthType("text");
                    }}
                    readOnly={!isEditable}
                  />
                </div>

                {/* 주소 */}
                <div className={styles.addressContainer}>
                  <div className={styles.addressRow}>
                    <input
                      type="text"
                      name="address"
                      value={formData.address ?? ""}
                      onChange={handleInputChange}
                      className={styles.addressInput}
                      placeholder="주소를 입력하세요"
                      readOnly={!isEditable}
                    />
                    <input
                      type="text"
                      name="detailAddress"
                      value={formData.detailAddress ?? ""}
                      onChange={handleInputChange}
                      className={styles.detailAddressInput}
                      placeholder="상세 주소를 입력하세요"
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

          {/* 추가 정보 */}
          <section className={styles.additionalInfoSection}>
            <h3 className={styles.sectionTitle}>추가 정보</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>연락처</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone ?? ""}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="연락처를 입력하세요"
                  readOnly={!isEditable}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>이메일</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email ?? ""}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="이메일을 입력하세요"
                  readOnly={!isEditable}
                />
              </div>
            </div>
          </section>

          {/* 소셜 */}
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
                  value={formData.instagram ?? ""}
                  onChange={handleInputChange}
                  className={styles.instagramInput}
                  placeholder="인스타그램 계정을 입력하세요"
                  readOnly={!isEditable}
                />
                <button
                  className={styles.connectButton}
                  onClick={handleConnect}
                  disabled={!formData.instagram}
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
