"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

// 환경변수로 게이트웨이/백엔드 베이스 URL 관리
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api/v1/advertiser-service";

// 모달 컴포넌트
const SuccessModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>알림</h3>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({ passwordMatch: false });
  const [verificationStatus, setVerificationStatus] = useState({
    codeSent: false,
    verified: false,
  });

  // 개별 에러 메시지 상태 관리
  const [emailError, setEmailError] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [loading, setLoading] = useState({
    signup: false,
    sendCode: false,
    verifyCode: false,
  });

  // 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    isSignupSuccess: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 각 필드 입력 시 해당 에러 메시지 초기화
    if (name === "email") {
      setEmailError("");
    } else if (name === "verificationCode") {
      setVerificationCodeError("");
    } else if (name === "password") {
      setPasswordError("");
    } else if (name === "confirmPassword") {
      setConfirmPasswordError("");
    } else if (name === "name") {
      setNameError("");
    } else if (name === "phone") {
      setPhoneError("");
    } else if (name === "address") {
      setAddressError("");
    }

    // 전화번호 입력 처리
    if (name === "phone") {
      // 숫자만 추출
      const numbers = value.replace(/[^0-9]/g, "");

      // 자리수 제한 (11자리)
      if (numbers.length <= 11) {
        let formattedPhone = "";

        // 하이픈 자동 추가
        if (numbers.length <= 3) {
          formattedPhone = numbers;
        } else if (numbers.length <= 7) {
          formattedPhone = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
          formattedPhone = `${numbers.slice(0, 3)}-${numbers.slice(
            3,
            7
          )}-${numbers.slice(7)}`;
        }

        setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setErrors((prev) => ({
        ...prev,
        passwordMatch: !!confirmPassword && password !== confirmPassword,
      }));
    }
  };

  // 모든 에러 메시지 초기화
  const clearAllErrors = () => {
    setEmailError("");
    setVerificationCodeError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
    setPhoneError("");
    setAddressError("");
  };

  // 모달 열기 함수
  const openModal = (message, isSignupSuccess = false) => {
    setModal({ isOpen: true, message, isSignupSuccess });
  };

  // 모달 닫기 함수
  const closeModal = () => {
    const wasSignupSuccess = modal.isSignupSuccess;
    setModal({ isOpen: false, message: "", isSignupSuccess: false });

    // 회원가입 성공이었다면 로그인 페이지로 이동
    if (wasSignupSuccess) {
      router.push("/advertiser/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError("비밀번호에 특수문자를 하나 이상 포함해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: true }));
      return;
    }

    // 이메일 미인증 차단 (선택사항)
    if (!verificationStatus.verified) {
      if (!confirm("이메일 인증을 완료하지 않았습니다. 계속 진행할까요?")) {
        return;
      }
    }

    try {
      setLoading((prev) => ({ ...prev, signup: true }));

      const signupData = {
        userId: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        businessNumber: formData.address
      };

      const res = await fetch(`${API_BASE}/advertiser/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(signupData),
      });

      let data = {};
      try {
        const responseText = await res.text();
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("회원가입 JSON 파싱 에러:", parseError);
      }

      if (res.status === 201) {
        clearAllErrors(); // 성공 시 모든 에러 초기화
        openModal(
          <>
            회원가입이 성공적으로 완료되었습니다.
            <br />
            로그인 후 이용해주세요.
          </>,
          true // 회원가입 성공 플래그
        );
      } else if (res.status === 409) {
        setEmailError(data.message ?? "이미 존재하는 이메일입니다.");
      } else if (res.status === 400 && data.data) {
        // 검증 에러 처리 - 기존 에러 초기화 후 새로운 에러 설정
        clearAllErrors();
        const validationErrors = data.data;

        // 각 필드별 에러 메시지 설정
        if (validationErrors.email) {
          setEmailError(validationErrors.email);
        }
        if (validationErrors.password) {
          setPasswordError(validationErrors.password);
        }
        if (validationErrors.confirmPassword) {
          setConfirmPasswordError(validationErrors.confirmPassword);
        }
        if (validationErrors.name) {
          setNameError(validationErrors.name);
        }
        if (validationErrors.phone) {
          setPhoneError(validationErrors.phone);
        }
        if (validationErrors.address) {
          setAddressError(validationErrors.address);
        }
      } else {
        // 일반적인 에러
        setEmailError(
          data.message ?? `회원가입 실패: ${data.message || res.statusText}`
        );
      }
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        alert(error.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, signup: false }));
    }
  };

  const sendVerificationCode = async () => {
    if (!formData.email) {
      alert("이메일을 입력하세요");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, sendCode: true }));

      const requestBody = { email: formData.email };

      // CORS 문제를 우회하기 위해 다른 방법 시도
      const res = await fetch(`${API_BASE}/advertiser/signup/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(requestBody),
      });

      let data = {};
      try {
        const responseText = await res.text();
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("JSON 파싱 에러:", parseError);
      }

      if (res.ok) {
        setVerificationStatus((prev) => ({
          ...prev,
          codeSent: true,
          verified: false,
        }));
        openModal("인증번호를 발송했습니다.");
      } else if (res.status === 409) {
        // 이미 존재하는 이메일인 경우
        setEmailError(
          data.message ||
            "이미 가입된 이메일입니다. 다른 이메일을 사용해주세요."
        );
        setVerificationStatus((prev) => ({
          ...prev,
          codeSent: false,
          verified: false,
        }));
      } else {
        setEmailError(data.message || `서버 오류 (${res.status})`);
      }
    } catch (error) {
      console.error("인증번호 발송 에러:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        setEmailError(error.message || "인증번호 발송 실패");
      }
    } finally {
      setLoading((prev) => ({ ...prev, sendCode: false }));
    }
  };

  const verifyCode = async () => {
    if (!formData.email || !formData.verificationCode) {
      alert("이메일과 인증번호를 입력하세요");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, verifyCode: true }));

      const res = await fetch(`${API_BASE}/advertiser/signup/email/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      });

      let data = {};
      try {
        const responseText = await res.text();
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("JSON 파싱 에러:", parseError);
      }

      if (res.ok) {
        // 백엔드에서 성공 응답이 오면 인증 성공으로 처리
        setVerificationStatus((prev) => ({ ...prev, verified: true }));
        openModal("이메일 인증이 완료되었습니다.");
      } else {
        setVerificationStatus((prev) => ({ ...prev, verified: false }));
        setVerificationCodeError(
          data.message || `인증 확인 실패 (${res.status})`
        );
      }
    } catch (error) {
      console.error("Code verification failed:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setVerificationCodeError("네트워크 연결을 확인해주세요.");
      } else {
        setVerificationCodeError(
          error.message || "인증번호가 올바르지 않습니다."
        );
      }
      setVerificationStatus((prev) => ({ ...prev, verified: false }));
    } finally {
      setLoading((prev) => ({ ...prev, verifyCode: false }));
    }
  };

  const handleFileSelect = (file) => {
    // 파일 업로드 로직을 여기에 추가할 수 있습니다
    console.log("Selected file:", file);
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <main className={styles.main}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h1 className={styles.title}>회원가입</h1>
              <p className={styles.subtitle}>광고주</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>이메일</label>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    disabled={loading.sendCode || !formData.email}
                    className={styles.verifyButton}
                  >
                    {loading.sendCode ? "발송중..." : "인증번호 발송"}
                  </button>
                </div>
                {verificationStatus.codeSent && (
                  <div className={styles.successMessage}>
                    인증번호를 발송했습니다.
                  </div>
                )}
                {emailError && (
                  <div className={styles.errorMessage}>{emailError}</div>
                )}
              </div>

              {/* Verification Code */}
              <div className={styles.formGroup}>
                <label className={styles.label}>인증번호</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    placeholder="인증번호를 입력하세요"
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                  <button
                    type="button"
                    onClick={verifyCode}
                    disabled={loading.verifyCode || !formData.verificationCode}
                    className={styles.verifyButton}
                  >
                    {loading.verifyCode ? "확인중..." : "인증번호 확인"}
                  </button>
                </div>
                {verificationStatus.verified && (
                  <div className={styles.successMessage}>이메일 인증 완료</div>
                )}
                {verificationCodeError && (
                  <div className={styles.errorMessage}>
                    {verificationCodeError}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>비밀번호</label>
                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요 (특수문자 포함)"
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                </div>
                {passwordError && (
                  <div className={styles.errorMessage}>{passwordError}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>비밀번호 확인</label>
                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                </div>
                {errors.passwordMatch && formData.confirmPassword && (
                  <div className={styles.errorMessage}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
                {confirmPasswordError && (
                  <div className={styles.errorMessage}>
                    {confirmPasswordError}
                  </div>
                )}
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>기업 이름</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="기업명을 입력하세요"
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                </div>
                {nameError && (
                  <div className={styles.errorMessage}>{nameError}</div>
                )}
              </div>

              {/* Phone */}
              <div className={styles.formGroup}>
                <label className={styles.label}>전화번호</label>
                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="전화번호를 입력하세요"
                    maxLength={13}
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                </div>
                {phoneError && (
                  <div className={styles.errorMessage}>{phoneError}</div>
                )}
              </div>

              {/* Address */}
              <div className={styles.formGroup}>
                <label className={styles.label}>사업자 등록번호</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="사업자 등록번호를 입력하세요"
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                </div>
                {addressError && (
                  <div className={styles.errorMessage}>{addressError}</div>
                )}
              </div>
              {/* 서류 제출 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>서류제출</label>
                <div
                  className={styles.dropzone}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                >
                  <img
                    src="/user/upload.svg" // 구름+화살표 아이콘
                    alt="Upload"
                    className={styles.uploadIcon}
                  />
                  <p className={styles.dropText}>
                    파일을 드래그 하거나 업로드 해주세요.
                  </p>
                  <label className={styles.browseButton}>
                    Browse Files
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files[0])
                          handleFileSelect(e.target.files[0]);
                      }}
                      className={styles.fileInput}
                    />
                  </label>
                </div>
              </div>
            </form>
            <div className={styles.loginLink}>
              이미 계정이 있으신가요?{" "}
              <Link href="/advertiser/login" className={styles.loginButton}>
                로그인
              </Link>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading.signup || errors.passwordMatch}
              className={styles.submitButton}
            >
              {loading.signup ? "처리중..." : "확인"}
            </button>
          </div>
        </main>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
}
