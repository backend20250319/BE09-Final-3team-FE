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
    nickname: "",
    phone: "",
    email: "",
    instagram: "",
    bio: "",
    address: "",
    detailAddress: "",
    birthDate: "",
    profileImageUrl: "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
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
        nickname: userData.nickname || "",
        phone: userData.phone || "",
        email: userData.email || "",
        instagram: userData.instagramUsername || "",
        bio: userData.selfIntroduction || "",
        address: addressValue,
        detailAddress: detailAddressValue,
        birthDate: userData.birthDate ? userData.birthDate.toString() : "",
        profileImageUrl: userData.profileImageUrl || "",
      });

      // 프로필 이미지 URL이 있으면 profileImage state도 설정
      if (userData.profileImageUrl) {
        setProfileImage(userData.profileImageUrl);
        setImageLoadError(false); // 이미지 로드 에러 상태 초기화
      }

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

      // 프로필 업데이트 데이터 준비
      const profileData = {
        name: formData.name,
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        instagramUsername: formData.instagram,
        selfIntroduction: formData.bio,
        roadAddress: formData.address,
        detailAddress: formData.detailAddress,
        // birthDate는 수정 불가능하므로 제외
      };

      const response = await fetch(`${USER_API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      let data = {};
      try {
        const responseText = await response.text();
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

  const handleConnect = () => {
    // 인스타그램 연결 기능 (향후 구현 예정)
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      try {
        setLoading(true);
        setError(""); // 이전 에러 메시지 초기화

        // 실제 이미지 업로드 실행
        await uploadImageToFTP(file);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        setError(error.message || "이미지 업로드에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadImageToFTP = async (file) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        router.push("/user/login");
        return;
      }

      // FormData 생성
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userNo", localStorage.getItem("userNo") || "");

      // FTP 업로드 API 호출
      const response = await fetch(`${USER_API_BASE}/auth/profile/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type은 FormData가 자동으로 설정하므로 제거
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `이미지 업로드 실패 (${response.status})`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      // 업로드된 이미지 URL로 미리보기 설정
      const imageUrl = result.data.imageUrl;
      setProfileImage(imageUrl);
      setFormData((prev) => ({ ...prev, profileImageUrl: imageUrl }));
      setImageLoadError(false); // 이미지 로드 에러 상태 초기화

      setError("");
    } catch (error) {
      console.error("FTP 업로드 실패:", error);
      throw error;
    }
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
                  onClick={isEditable ? triggerFileSelect : undefined}
                  style={{ cursor: isEditable ? "pointer" : "default" }}
                >
                  {loading ? (
                    <div className={styles.imageLoading}>
                      <div className={styles.loadingSpinner}></div>
                      <span>업로드 중...</span>
                    </div>
                  ) : (profileImage || formData.profileImageUrl) &&
                    !imageLoadError ? (
                    <Image
                      src={profileImage || formData.profileImageUrl}
                      alt="프로필 이미지"
                      fill
                      unoptimized
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                      onError={(e) => {
                        console.log("이미지 로드 실패, 기본 아이콘으로 대체");
                        setImageLoadError(true);
                      }}
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
                  {isEditable && !loading && (
                    <div className={styles.imageOverlay}>
                      <span>클릭하여 이미지 변경</span>
                    </div>
                  )}
                </div>

                {/* 편집 모드에서만 이미지 업로드 버튼 표시 */}
                {isEditable && (
                  <div className={styles.uploadButtonContainer}>
                    <button
                      className={styles.uploadButton}
                      onClick={triggerFileSelect}
                      disabled={loading}
                    >
                      <Image
                        src="/user/upload.svg"
                        alt="업로드"
                        width={16}
                        height={16}
                      />
                      <span>이미지 업로드</span>
                    </button>
                  </div>
                )}
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

                {/* 닉네임 */}
                <div className={styles.nameContainer}>
                  <label className={styles.nameLabel}>닉네임</label>
                  <div className={styles.nameInputWrapper}>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname ?? ""}
                      onChange={handleInputChange}
                      className={styles.nameInput}
                      placeholder="닉네임을 입력하세요"
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
                    type="text"
                    name="birthDate"
                    value={formData.birthDate ?? ""}
                    className={styles.birthInput}
                    placeholder="생년월일"
                    readOnly={true}
                  />
                </div>

                {/* 주소 */}
                <div className={styles.addressContainer}>
                  <label className={styles.addressLabel}>거주지 위치</label>
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
