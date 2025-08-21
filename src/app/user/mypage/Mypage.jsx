"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Mypage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const router = useRouter();
  const API_BASE = "http://localhost:8000/api/v1/mypage-service";

  // ✅ 컨트롤드 입력을 위한 초기 빈 값
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    bio: "",
    address: "",
    detailAddress: "",
    birthDate: "",
    profileImageUrl: "",
    preferredPetType: "",
    petCount: 0,
    isInfluencer: false,
    influencerCategory: "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [birthType, setBirthType] = useState("text"); // ✅ placeholder 보기 좋게: text ↔ date
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    fetchProfile();
  }, []);

  // 프로필 정보 가져오기
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/user/login");
        return;
      }

      const response = await fetch(`${API_BASE}/api/mypage/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const profile = result.data;
        setFormData({
          name: profile.name || "",
          phone: profile.phone || "",
          email: profile.email || "",
          instagram: profile.instagramUsername || "",
          bio: profile.selfIntroduction || "",
          address: profile.roadAddress || profile.address || "",
          detailAddress: profile.detailAddress || profile.detailedAddress || "",
          birthDate: profile.birthDate ? profile.birthDate.toString() : "",
          profileImageUrl: profile.profileImageUrl || "",
          preferredPetType: profile.preferredPetType || "",
          petCount: profile.petCount || 0,
          isInfluencer: profile.isInfluencer || false,
          influencerCategory: profile.influencerCategory || "",
        });

        if (profile.profileImageUrl) {
          setProfileImage(profile.profileImageUrl);
        }
      } else {
        setError(result.message || "프로필 정보를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 정보 가져오기 실패:", error);
      setError("프로필 정보를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => setIsEditable(true);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/user/login");
        return;
      }

      // 마이페이지 서비스에 전송할 데이터
      const profileData = {
        profileImageUrl: formData.profileImageUrl,
        selfIntroduction: formData.bio,
        instagramUsername: formData.instagram,
        preferredPetType: formData.preferredPetType,
        petCount: formData.petCount,
        isInfluencer: formData.isInfluencer,
        influencerCategory: formData.influencerCategory,
      };

      const response = await fetch(`${API_BASE}/api/mypage/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("프로필 수정 성공:", result.data);
        setIsEditable(false);
        setError("");
        // 수정된 프로필 정보로 다시 가져오기
        await fetchProfile();
      } else {
        setError(result.message || "프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setError("프로필 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setError("");
    // 원래 데이터로 복원
    fetchProfile();
  };

  const handleConnect = () => console.log("연결하기");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) previewImage(file);
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      setFormData((prev) => ({ ...prev, profileImageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  if (loading && !formData.email) {
    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <main className={styles.main}>
            <div className={styles.loading}>로딩 중...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>마이페이지</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

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
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "저장 중..." : "저장하기"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={loading}
              >
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
