"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Mypage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const router = useRouter();
  const USER_API_BASE = "http://localhost:8000/api/v1/user-service";

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
    isInfluencer: false,
    influencerCategory: "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [birthType, setBirthType] = useState("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    fetchProfile();
  }, []);

  // 프로필 정보 가져오기
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        router.push("/user/login");
        return;
      }

      // user-service의 /auth/me 엔드포인트 직접 호출
      const response = await fetch(`${USER_API_BASE}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 인증 실패 시 로그인 페이지로 이동
          router.push("/user/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const userData = result.data; // ApiResponse 구조에서 실제 데이터 추출

      // 주소 데이터 설정
      const addressValue = userData.roadAddress || userData.address || "";
      const detailAddressValue =
        userData.detailAddress || userData.detailedAddress || "";

      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        instagram: userData.instagramUsername || "",
        bio: userData.selfIntroduction || "",
        address: addressValue,
        detailAddress: detailAddressValue,
        birthDate: userData.birthDate ? userData.birthDate.toString() : "",
        profileImageUrl: userData.profileImageUrl || "",
        preferredPetType: userData.preferredPetType || "",
        petCount: userData.petCount || 0,
        isInfluencer: userData.isInfluencer || false,
        influencerCategory: userData.influencerCategory || "",
      });

      setError("");
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
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        router.push("/user/login");
        return;
      }

      console.log("프로필 수정 시작");
      console.log("요청 URL:", `${USER_API_BASE}/auth/profile`);

      // 프로필 업데이트 데이터 준비
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        instagramUsername: formData.instagram,
        selfIntroduction: formData.bio,
        roadAddress: formData.address,
        detailAddress: formData.detailAddress,
        // birthDate는 수정 불가능하므로 제외
        isInfluencer: formData.isInfluencer,
        influencerCategory: formData.influencerCategory,
      };

      console.log("요청 본문:", profileData);
      console.log("주소 데이터 확인:", {
        formDataAddress: formData.address,
        formDataDetailAddress: formData.detailAddress,
        profileDataRoadAddress: profileData.roadAddress,
        profileDataDetailAddress: profileData.detailAddress,
      });

      const response = await fetch(`${USER_API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      console.log(
        "프로필 수정 응답 상태:",
        response.status,
        response.statusText
      );

      let data = {};
      try {
        const responseText = await response.text();
        console.log("프로필 수정 응답 텍스트:", responseText);

        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("응답 파싱 오류:", parseError);
        throw new Error("서버 응답을 처리할 수 없습니다.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || `프로필 수정에 실패했습니다. (${response.status})`
        );
      }

      console.log("프로필 수정 성공:", data);

      // 성공 시 편집 모드 종료
      setIsEditable(false);
      setError("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setError(error.message || "프로필 수정에 실패했습니다.");
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

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

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

          {/* 편집 모드 알림 */}
          {isEditable && (
            <div className={styles.editModeAlert}>마이페이지를 수정입니다.</div>
          )}

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
                    readOnly={true}
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
                      placeholder={
                        isEditable
                          ? "주소를 입력하세요"
                          : formData.address
                          ? "주소를 입력하세요"
                          : "회원가입 시 입력한 주소가 없습니다"
                      }
                      readOnly={!isEditable}
                    />
                    <input
                      type="text"
                      name="detailAddress"
                      value={formData.detailAddress ?? ""}
                      onChange={handleInputChange}
                      className={styles.detailAddressInput}
                      placeholder={
                        isEditable
                          ? "상세 주소를 입력하세요"
                          : formData.detailAddress
                          ? "상세 주소를 입력하세요"
                          : "회원가입 시 입력한 상세주소가 없습니다"
                      }
                      readOnly={!isEditable}
                    />
                  </div>
                  <span className={styles.locationLabel}>거주지 위치</span>
                  {!formData.address &&
                    !formData.detailAddress &&
                    !isEditable && (
                      <div
                        style={{
                          color: "#f5a623",
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: '"Pretendard Variable", sans-serif',
                        }}
                      >
                        회원가입 시 입력한 주소 정보가 서버에 저장되지
                        않았습니다. 편집 버튼을 눌러 주소를 입력해주세요.
                      </div>
                    )}
                  {!formData.address &&
                    !formData.detailAddress &&
                    isEditable && (
                      <div
                        style={{
                          color: "#4CAF50",
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: '"Pretendard Variable", sans-serif',
                        }}
                      >
                        주소 정보를 입력해주세요.
                      </div>
                    )}
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

          {/* 성공 모달 */}
          {showSuccessModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>프로필 수정 완료</h3>
                </div>
                <div className={styles.modalBody}>
                  <p>프로필이 성공적으로 수정되었습니다.</p>
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={styles.modalButton}
                    onClick={closeSuccessModal}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyPage;
