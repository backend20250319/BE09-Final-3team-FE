"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import {
  sendAdvertiserVerificationCode,
  verifyAdvertiserCode,
  advertiserSignup,
  advertiserLogin,
  uploadFileByAdvertiserNo,
} from "@/api/advertiserAuthApi";

// 모달 컴포넌트
const SuccessModal = ({ isOpen, message, onClose }) => {
  console.log("SuccessModal 렌더링:", { isOpen, message });

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
    businessNumber: "",
  });

  // 파일 업로드 상태 관리
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

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
  const [businessNumberError, setBusinessNumberError] = useState("");

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

  // 사업자등록번호 검증 함수
  const validateBusinessNumber = (businessNumber) => {
    // 숫자만 추출
    const numbers = businessNumber.replace(/[^0-9]/g, "");

    // 10자리가 아닌 경우
    if (numbers.length !== 10) {
      return "사업자등록번호는 10자리 숫자여야 합니다.";
    }

    // 앞 3자리: 세무서 코드 (001~999)
    const taxOfficeCode = parseInt(numbers.substring(0, 3));
    if (taxOfficeCode < 1 || taxOfficeCode > 999) {
      return "세무서 코드가 올바르지 않습니다.";
    }

    // 4-5번째 자리: 개인/법인 구분코드 (01~99)
    const businessTypeCode = parseInt(numbers.substring(3, 5));
    if (businessTypeCode < 1 || businessTypeCode > 99) {
      return "개인/법인 구분코드가 올바르지 않습니다.";
    }

    // 뒤 5자리: 일련번호와 검증코드 (00001~99999)
    const serialNumber = parseInt(numbers.substring(5));
    if (serialNumber < 1 || serialNumber > 99999) {
      return "일련번호가 올바르지 않습니다.";
    }

    return null; // 검증 통과
  };

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
    } else if (name === "businessNumber") {
      setBusinessNumberError("");
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

    // 사업자등록번호 입력 처리
    if (name === "businessNumber") {
      // 숫자만 추출
      const numbers = value.replace(/[^0-9]/g, "");

      // 10자리 제한
      if (numbers.length <= 10) {
        let formattedBusinessNumber = "";

        // 하이픈 자동 추가 (123-45-67890 형식)
        if (numbers.length <= 3) {
          formattedBusinessNumber = numbers;
        } else if (numbers.length <= 5) {
          formattedBusinessNumber = `${numbers.slice(0, 3)}-${numbers.slice(
            3
          )}`;
        } else {
          formattedBusinessNumber = `${numbers.slice(0, 3)}-${numbers.slice(
            3,
            5
          )}-${numbers.slice(5)}`;
        }

        setFormData((prev) => ({ ...prev, [name]: formattedBusinessNumber }));

        // 실시간 검증
        const validationError = validateBusinessNumber(formattedBusinessNumber);
        if (validationError) {
          setBusinessNumberError(validationError);
        } else {
          setBusinessNumberError("");
        }
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
    setBusinessNumberError("");
    setFileError("");
  };

  // 모달 열기 함수
  const openModal = (message, isSignupSuccess = false) => {
    console.log("openModal 함수 호출됨");
    console.log("message:", message);
    console.log("isSignupSuccess:", isSignupSuccess);

    setModal({ isOpen: true, message, isSignupSuccess });

    console.log("setModal 호출됨");
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

    // 모든 필수 항목 검증
    let hasError = false;

    // 이메일 검증
    if (!formData.email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      hasError = true;
    }

    // 이메일 인증 검증
    if (!verificationStatus.verified) {
      setVerificationCodeError("이메일 인증을 완료해주세요.");
      hasError = true;
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])/;
      if (!passwordRegex.test(formData.password)) {
        setPasswordError("비밀번호에 특수문자를 하나 이상 포함해주세요.");
        hasError = true;
      }
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword.trim()) {
      setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: true }));
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    }

    // 기업명 검증
    if (!formData.name.trim()) {
      setNameError("기업명을 입력해주세요.");
      hasError = true;
    }

    // 전화번호 검증
    if (!formData.phone.trim()) {
      setPhoneError("전화번호를 입력해주세요.");
      hasError = true;
    }

    // 사업자등록번호 검증
    if (!formData.businessNumber.trim()) {
      setBusinessNumberError("사업자등록번호를 입력해주세요.");
      hasError = true;
    } else {
      const businessNumberValidation = validateBusinessNumber(
        formData.businessNumber
      );
      if (businessNumberValidation) {
        setBusinessNumberError(businessNumberValidation);
        hasError = true;
      }
    }

    // 서류 제출 검증
    if (!selectedFile) {
      setFileError("서류 제출은 필수입니다.");
      hasError = true;
    }

    // 에러가 있으면 제출 중단
    if (hasError) {
      return;
    }

    try {
      console.log("회원가입 시도 시작...");
      console.log("formData:", formData);
      console.log("selectedFile:", selectedFile);

      setLoading((prev) => ({ ...prev, signup: true }));

      const signupData = {
        userId: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        businessNumber: formData.businessNumber,
      };

      console.log("전송할 데이터:", signupData);

      const data = await advertiserSignup(signupData);

      console.log("회원가입 응답 데이터:", data);

      if (data && data.code === "2000") {
        // 회원가입 성공 후 파일 업로드
        try {
          console.log("회원가입 성공! 파일 업로드 시작...");
          const advertiserNo =
            data.data?.advertiserNo || data.data?.advertiser?.advertiserNo;

          if (advertiserNo) {
            // 회원가입 후 잠시 대기 후 자동 로그인하여 토큰 획득
            console.log("3초 후 자동 로그인 시도...");

            // 3초 대기 후 로그인 시도
            setTimeout(async () => {
              try {
                const loginData = await advertiserLogin(
                  formData.email,
                  formData.password
                );

                // 토큰을 localStorage에 저장
                if (loginData.data?.accessToken) {
                  localStorage.setItem(
                    "advertiserToken",
                    loginData.data.accessToken
                  );
                  localStorage.setItem("advertiserNo", advertiserNo);
                  localStorage.setItem("userType", "ADVERTISER");

                  // 이제 토큰과 함께 파일 업로드
                  console.log("파일 업로드 시작...");
                  const uploadedFileData = await uploadFileByAdvertiserNo(
                    selectedFile,
                    advertiserNo
                  );
                  console.log("파일 업로드 완료:", uploadedFileData);
                } else {
                  console.warn("로그인 응답에 토큰이 없습니다:", loginData);
                }
              } catch (loginError) {
                // 로그인 실패해도 파일 업로드 시도 (토큰 없이)
                console.log("토큰 없이 파일 업로드 시도...");
                try {
                  const uploadedFileData = await uploadFileByAdvertiserNo(
                    selectedFile,
                    advertiserNo
                  );
                  console.log("파일 업로드 완료:", uploadedFileData);
                } catch (uploadError) {
                  console.error("토큰 없이 파일 업로드도 실패:", uploadError);
                }
              }
            }, 3000); // 3초 대기
          } else {
            console.warn("advertiserNo를 찾을 수 없습니다:", data);
          }
        } catch (fileError) {
          console.error("파일 업로드 실패:", fileError);
          // 파일 업로드 실패해도 회원가입은 성공으로 처리
        }

        clearAllErrors(); // 성공 시 모든 에러 초기화
        console.log("회원가입 성공! 모달 열기 시도...");

        openModal(
          <>
            회원가입이 진행되었습니다.
            <br />
            관리자 승인을 기다려주세요.
          </>,
          true // 회원가입 성공 플래그
        );
      } else {
        // 일반적인 에러
        setEmailError(data?.message ?? "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        if (status === 409) {
          setEmailError(
            data.message ??
              "이미 회원가입이 되어있는 이메일입니다. 다른 이메일을 사용해주세요."
          );
        } else if (status === 400 && data.data) {
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
          if (validationErrors.businessNumber) {
            setBusinessNumberError(validationErrors.businessNumber);
          }
          if (validationErrors.fileNo) {
            setFileError(validationErrors.fileNo);
          }
        } else {
          setEmailError(data.message ?? "회원가입에 실패했습니다.");
        }
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        // 파일 업로드 에러인지 확인
        if (error.message && error.message.includes("file")) {
          setFileError("파일 업로드에 실패했습니다. 다시 시도해주세요.");
        } else {
          alert(error.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
        }
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

      const data = await sendAdvertiserVerificationCode(formData.email);

      setVerificationStatus((prev) => ({
        ...prev,
        codeSent: true,
        verified: false,
      }));
      openModal("인증번호를 발송했습니다.");
    } catch (error) {
      console.error("인증번호 발송 에러:", error);
      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        if (status === 409) {
          // 이미 존재하는 이메일인 경우
          setEmailError(
            data.message ||
              "이미 회원가입이 되어있는 이메일입니다. 다른 이메일을 사용해주세요."
          );
          setVerificationStatus((prev) => ({
            ...prev,
            codeSent: false,
            verified: false,
          }));
        } else {
          setEmailError(data.message || `서버 오류 (${status})`);
        }
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
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

      // 인증 상태를 먼저 false로 초기화
      setVerificationStatus((prev) => ({ ...prev, verified: false }));
      setVerificationCodeError(""); // 에러 메시지 초기화

      const data = await verifyAdvertiserCode(
        formData.email,
        formData.verificationCode
      );

      console.log("인증 응답 데이터:", data);

      // 백엔드 응답 검증 - 성공 응답 확인
      // 성공 조건: code가 "2000"이거나, code가 없고 message가 성공 관련이거나, HTTP 200 응답
      const isSuccess =
        data &&
        (data.code === "2000" ||
          data.code === 2000 ||
          (data.code === undefined && !data.message?.includes("실패")) ||
          data.message?.includes("성공") ||
          data.message?.includes("완료"));

      if (isSuccess) {
        // 인증 성공
        setVerificationStatus((prev) => ({ ...prev, verified: true }));
        openModal("이메일 인증이 완료되었습니다.");
      } else {
        // 백엔드에서 실패 응답이 온 경우
        const errorMessage = data?.message || "인증번호가 올바르지 않습니다.";
        console.error("인증 실패:", errorMessage);
        setVerificationStatus((prev) => ({ ...prev, verified: false }));
        setVerificationCodeError(errorMessage);
        openModal(errorMessage);
      }
    } catch (error) {
      console.error("Code verification failed:", error);

      // 인증 실패 시 상태를 명확히 false로 설정
      setVerificationStatus((prev) => ({ ...prev, verified: false }));

      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        const errorMessage = data.message || "인증번호가 올바르지 않습니다.";
        setVerificationCodeError(errorMessage);
        openModal(errorMessage);
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        const errorMessage = "네트워크 연결을 확인해주세요.";
        setVerificationCodeError(errorMessage);
        openModal(errorMessage);
      } else {
        const errorMessage = error.message || "인증번호가 올바르지 않습니다.";
        setVerificationCodeError(errorMessage);
        openModal(errorMessage);
      }
    } finally {
      setLoading((prev) => ({ ...prev, verifyCode: false }));
    }
  };

  const handleFileSelect = (file) => {
    // 파일 유효성 검사
    if (!file) {
      setFileError("파일을 선택해주세요.");
      return;
    }

    // 파일 크기 검사 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 파일 타입 검사
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("JPG, PNG, PDF 파일만 업로드 가능합니다.");
      return;
    }

    setSelectedFile(file);
    setFileError("");
    console.log("Selected file:", file);
  };

  // 파일 제거 함수
  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileError("");
    // input 요소의 value 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

              {/* Business Number */}
              <div className={styles.formGroup}>
                <label className={styles.label}>사업자 등록번호</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleInputChange}
                    placeholder="123-45-67890 (하이픈 자동 추가)"
                    maxLength={12}
                    className={styles.input}
                    disabled={
                      loading.sendCode || loading.verifyCode || loading.signup
                    }
                  />
                </div>
                {businessNumberError && (
                  <div className={styles.errorMessage}>
                    {businessNumberError}
                  </div>
                )}
              </div>
              {/* 서류 제출 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  서류제출 <span style={{ color: "red" }}>*</span>
                </label>
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
                    <br />
                    <small style={{ color: "#666" }}>
                      (JPG, PNG, PDF 파일만 가능, 최대 10MB, 1개 파일만 업로드
                      가능)
                    </small>
                  </p>
                  <label className={styles.browseButton}>
                    Browse Files
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files[0])
                          handleFileSelect(e.target.files[0]);
                      }}
                      className={styles.fileInput}
                      disabled={
                        loading.sendCode || loading.verifyCode || loading.signup
                      }
                    />
                  </label>
                </div>
                {selectedFile && (
                  <div className={styles.successMessage}>
                    선택된 파일: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                    <button
                      type="button"
                      onClick={handleFileRemove}
                      style={{
                        marginLeft: "10px",
                        background: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      제거
                    </button>
                  </div>
                )}
                {fileError && (
                  <div className={styles.errorMessage}>{fileError}</div>
                )}
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
              disabled={
                loading.signup ||
                errors.passwordMatch ||
                !selectedFile ||
                !formData.email.trim() ||
                !verificationStatus.verified ||
                !formData.password.trim() ||
                !formData.confirmPassword.trim() ||
                !formData.name.trim() ||
                !formData.phone.trim() ||
                !formData.businessNumber.trim()
              }
              className={styles.submitButton}
            >
              {loading.signup ? "처리중..." : "확인"}
            </button>
          </div>
        </main>
      </div>

      {/* 성공 모달 */}
      {console.log("모달 렌더링 부분 - modal 상태:", modal)}
      <SuccessModal
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
}
