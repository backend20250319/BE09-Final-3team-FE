"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Mypage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  withdraw,
} from "../../../api/userApi";

const MyPage = () => {
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
  const [connectedProfiles, setConnectedProfiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWithdrawConfirmModal, setShowWithdrawConfirmModal] =
    useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Facebook SDK 초기화
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 1691923471518629, // 환경변수에서 Facebook App ID 가져오기
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
    };

    // Facebook SDK 스크립트 동적 로드
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/ko_KR/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    fetchProfile();
    fetchConnectedProfiles();
  }, []);

  // 토큰 갱신 함수
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    try {
      const response = await axios.post(`${USER_API_BASE}/auth/refresh`, {
        refreshToken,
      });

      const data = response.data;
      if (data.code === "2000" && data.data) {
        const authData = data.data;
        localStorage.setItem("token", authData.accessToken);
        if (authData.refreshToken) {
          localStorage.setItem("refreshToken", authData.refreshToken);
        }
        if (authData.accessExpiresAt) {
          localStorage.setItem(
            "accessTokenExpiresAt",
            authData.accessExpiresAt
          );
        }
        if (authData.refreshExpiresAt) {
          localStorage.setItem(
            "refreshTokenExpiresAt",
            authData.refreshExpiresAt
          );
        }
        return authData.accessToken;
      } else {
        throw new Error(data.message || "토큰 갱신 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      throw new Error("토큰 갱신에 실패했습니다.");
    }
  };

  // API 호출 함수 (토큰 갱신 포함)
  const apiCall = async (url, options = {}) => {
    let token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (!token) {
      router.push("/user/login");
      return null;
    }

    const makeRequest = async (authToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      };

      if (options.method === "GET") {
        return axios.get(url, config);
      } else if (options.method === "POST") {
        return axios.post(url, options.data, config);
      } else if (options.method === "PATCH") {
        return axios.patch(url, options.data, config);
      } else if (options.method === "PUT") {
        return axios.put(url, options.data, config);
      } else if (options.method === "DELETE") {
        return axios.delete(url, { ...config, data: options.data });
      } else {
        return axios.get(url, config);
      }
    };

    try {
      let response = await makeRequest(token);
      return response;
    } catch (error) {
      // 401 에러가 발생하면 토큰 갱신 시도
      if (error.response && error.response.status === 401) {
        try {
          const newToken = await refreshToken();
          response = await makeRequest(newToken);
          return response;
        } catch (refreshError) {
          console.error("토큰 갱신 실패:", refreshError);
          localStorage.clear();
          router.push("/user/login");
          return null;
        }
      }
      throw error;
    }
  };

  // 프로필 정보 가져오기
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await getProfile();

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
      if (error.response && error.response.status === 401) {
        // 인증 실패 시 로그인 페이지로 이동
        router.push("/user/login");
        return;
      }
      setError("프로필 정보를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 연결된 인스타그램 프로필 가져오기
  const fetchConnectedProfiles = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      if (!token) {
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/v1/sns-service/instagram/profiles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === "2000") {
        setConnectedProfiles(response.data.data || []);
      }
    } catch (error) {}
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

      await updateProfile(profileData);

      // 성공 시 편집 모드 종료
      setIsEditable(false);
      setError("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setError(error.response?.data?.message || "프로필 수정에 실패했습니다.");
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
    setIsLoading(true);

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          const userId = response.authResponse.userID;

          console.log("Login successful!");
          console.log("Access Token:", token);
          console.log("User ID:", userId);

          connectInstagramToServer(token);
        } else {
          console.log("User cancelled login or did not fully authorize.");
          setIsLoading(false);
          setError("Instagram 계정 연결이 취소되었습니다.");
        }
      },
      {
        scope: "email,pages_read_engagement,pages_show_list", // 필요한 권한 설정
      }
    );
  };

  // Instagram 연결 API 호출 함수
  const connectInstagramToServer = async (accessToken) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        setError("사용자 인증 토큰이 없습니다.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/sns-service/instagram/auth/connect",
        {
          access_token: accessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Instagram 연결 API 응답:", response.data);
      setSuccess("Instagram 계정이 성공적으로 연결되었습니다!");
      setIsLoading(false);

      // 연결된 프로필 목록 새로고침
      await fetchConnectedProfiles();
    } catch (error) {
      console.error("Instagram 연결 API 호출 실패:", error);
      setError(
        error.response?.data?.message || "Instagram 계정 연결에 실패했습니다."
      );
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 지원하는 이미지 파일 확장자
    const supportedExtensions = ["jpg", "jpeg", "png"];

    // 파일 확장자 검증
    const extension = file.name.split(".").pop().toLowerCase();
    if (!supportedExtensions.includes(extension)) {
      setError(
        `지원하지 않는 파일확장자입니다. (지원하는 파일확장자: ${supportedExtensions.join(
          ", "
        )})`
      );
      return;
    }

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
  };

  const uploadImageToFTP = async (file) => {
    try {
      // 프로필 이미지 업로드 API 호출
      const response = await uploadProfileImage(file);

      // 업로드된 이미지 URL로 미리보기 설정
      const imageUrl = response?.data?.imageUrl || response?.imageUrl;
      if (imageUrl) {
        setProfileImage(imageUrl);
        setFormData((prev) => ({ ...prev, profileImageUrl: imageUrl }));
        setImageLoadError(false); // 이미지 로드 에러 상태 초기화
      } else {
        console.warn("이미지 URL을 찾을 수 없습니다:", response);
      }

      setError("");
    } catch (error) {
      console.error("FTP 업로드 실패:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "이미지 업로드에 실패했습니다.";
      throw new Error(errorMessage);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // 성공 모달 닫기 시 페이지 새로고침
    window.location.reload();
  };

  // 회원탈퇴 확인 모달 열기
  const openWithdrawConfirmModal = () => {
    setShowWithdrawConfirmModal(true);
  };

  // 회원탈퇴 확인 모달 닫기
  const closeWithdrawConfirmModal = () => {
    setShowWithdrawConfirmModal(false);
  };

  // 회원탈퇴 모달 열기
  const openWithdrawModal = () => {
    setShowWithdrawModal(true);
    setWithdrawPassword("");
    setWithdrawReason("");
  };

  // 회원탈퇴 모달 닫기
  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawPassword("");
    setWithdrawReason("");
  };

  // 회원탈퇴 처리
  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await withdraw(withdrawPassword, withdrawReason || "사용자 요청");

      // 회원탈퇴 성공 시 로컬스토리지 클리어
      localStorage.clear();

      // 모달 닫기
      closeWithdrawModal();

      // 로그인 페이지로 리다이렉트
      router.push("/user/login");
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      setError(error.response?.data?.message || "회원탈퇴에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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
              {/* 인스타그램 계정 연결 */}
              <div className={styles.instagramContainer}>
                <div className={styles.instagramIcon}>
                  <Image
                    src="/user/instagram.svg"
                    alt="Instagram"
                    width={35}
                    height={31}
                  />
                </div>
                <div className={styles.instagramInfo}>
                  <span className={styles.instagramLabel}>인스타그램</span>
                  <span className={styles.instagramValue}>
                    {formData.instagram || ""}
                  </span>
                </div>
                <button
                  className={styles.connectButton}
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  <div className={styles.connectIcon}>
                    <Image
                      src="/user/instagram.svg"
                      alt="연결"
                      width={23}
                      height={21}
                    />
                  </div>
                  <span>
                    {isLoading
                      ? "연결 중..."
                      : userInfo
                      ? "연결 해제"
                      : "연결 하기"}
                  </span>
                </button>
              </div>
            </div>

            {/* 연결된 Instagram 계정 정보 */}
            {userInfo && (
              <div className={styles.connectedProfilesContainer}>
                <h4 className={styles.connectedProfilesTitle}>
                  연결된 Instagram 계정
                </h4>
                <div className={styles.connectedProfilesList}>
                  <div className={styles.connectedProfileItem}>
                    <div className={styles.profileAvatar}>
                      <Image
                        src="/user/instagram.svg"
                        alt="Instagram"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className={styles.profileInfo}>
                      <div className={styles.profileName}>{userInfo.name}</div>
                      <div className={styles.profileUsername}>
                        {userInfo.email || "이메일 정보 없음"}
                      </div>
                      <div className={styles.profileStats}>
                        <span>
                          Access Token: {accessToken.substring(0, 20)}...
                        </span>
                      </div>
                    </div>
                    <div className={styles.profileStatus}>
                      <span className={styles.connectedBadge}>연결됨</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 연결된 인스타그램 계정 리스트 */}
            {connectedProfiles.length > 0 && (
              <div className={styles.connectedProfilesContainer}>
                <h4 className={styles.connectedProfilesTitle}>
                  연결된 인스타그램 계정
                </h4>
                <div className={styles.connectedProfilesList}>
                  {connectedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={styles.connectedProfileItem}
                    >
                      <div className={styles.profileAvatar}>
                        <Image
                          src={profile.profile_picture_url || "/user-1.jpg"}
                          alt={profile.username}
                          width={40}
                          height={40}
                          className={styles.avatarImage}
                        />
                      </div>
                      <div className={styles.profileInfo}>
                        <div className={styles.profileName}>
                          {profile.name || profile.username}
                        </div>
                        <div className={styles.profileUsername}>
                          @{profile.username}
                        </div>
                        <div className={styles.profileStats}>
                          <span>팔로워 {profile.followers_count || 0}</span>
                          <span>팔로잉 {profile.follows_count || 0}</span>
                          <span>게시물 {profile.media_count || 0}</span>
                        </div>
                      </div>
                      <div className={styles.profileStatus}>
                        <span className={styles.connectedBadge}>연결됨</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 에러 및 성공 메시지 표시 */}
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className={styles.successMessage}>
              <p>{success}</p>
            </div>
          )}

          {/* 회원탈퇴 버튼 - 소셜미디어 섹션 바깥 우측하단 */}
          <div className={styles.withdrawButtonContainer}>
            <button
              className={styles.withdrawButton}
              onClick={openWithdrawConfirmModal}
              title="회원탈퇴"
            >
              회원탈퇴
            </button>
          </div>

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

          {/* 회원탈퇴 확인 모달 */}
          {showWithdrawConfirmModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>회원탈퇴 확인</h3>
                </div>
                <div className={styles.modalBody}>
                  <p>회원탈퇴를 하시겠습니까?</p>
                  <p
                    style={{
                      color: "#e74c3c",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    ⚠️ 회원탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수
                    없습니다.
                  </p>
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={styles.modalButton}
                    onClick={() => {
                      closeWithdrawConfirmModal();
                      openWithdrawModal();
                    }}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      marginRight: "10px",
                    }}
                  >
                    확인
                  </button>
                  <button
                    className={styles.modalButton}
                    onClick={closeWithdrawConfirmModal}
                    style={{
                      backgroundColor: "#95a5a6",
                      color: "white",
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 회원탈퇴 모달 */}
          {showWithdrawModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>회원탈퇴</h3>
                </div>
                <div className={styles.modalBody}>
                  <p style={{ color: "#e74c3c", marginBottom: "20px" }}>
                    ⚠️ 회원탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수
                    없습니다.
                  </p>
                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      비밀번호 확인 *
                    </label>
                    <input
                      type="password"
                      value={withdrawPassword}
                      onChange={(e) => setWithdrawPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      탈퇴 사유 (선택)
                    </label>
                    <textarea
                      value={withdrawReason}
                      onChange={(e) => setWithdrawReason(e.target.value)}
                      placeholder="탈퇴 사유를 입력하세요 (선택사항)"
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={styles.modalButton}
                    onClick={handleWithdraw}
                    disabled={loading}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      marginRight: "10px",
                    }}
                  >
                    {loading ? "처리 중..." : "회원탈퇴"}
                  </button>
                  <button
                    className={styles.modalButton}
                    onClick={closeWithdrawModal}
                    disabled={loading}
                    style={{
                      backgroundColor: "#95a5a6",
                      color: "white",
                    }}
                  >
                    취소
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
