"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  sendVerificationCode,
  verifyCode,
  signup,
} from "../../../api/userAuthApi";

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

  // 각 필드에 대한 ref 생성
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const nicknameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const birthRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    phone: "",
    address: "",
    detailAddress: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });

  const [errors, setErrors] = useState({ passwordMatch: false });
  const [verificationStatus, setVerificationStatus] = useState({
    codeSent: false,
    verified: false,
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [birthError, setBirthError] = useState("");
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
    } else if (name === "password") {
      setPasswordError("");
    } else if (name === "confirmPassword") {
      setConfirmPasswordError("");
    } else if (name === "name") {
      setNameError("");
    } else if (name === "nickname") {
      setNicknameError("");
    } else if (name === "phone") {
      setPhoneError("");
    } else if (name === "address") {
      setAddressError("");
    } else if (
      name === "birthYear" ||
      name === "birthMonth" ||
      name === "birthDay"
    ) {
      setBirthError("");
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
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
    setNicknameError("");
    setPhoneError("");
    setAddressError("");
    setBirthError("");
  };

  // 특정 필드로 스크롤하는 함수
  const scrollToField = (fieldName) => {
    let targetRef = null;

    switch (fieldName) {
      case "email":
        targetRef = emailRef;
        break;
      case "password":
        targetRef = passwordRef;
        break;
      case "confirmPassword":
        targetRef = confirmPasswordRef;
        break;
      case "name":
        targetRef = nameRef;
        break;
      case "nickname":
        targetRef = nicknameRef;
        break;
      case "phone":
        targetRef = phoneRef;
        break;
      case "address":
        targetRef = addressRef;
        break;
      case "birth":
        targetRef = birthRef;
        break;
      default:
        return;
    }

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // 포커스도 함께 이동
      setTimeout(() => {
        targetRef.current.focus();
      }, 500);
    }
  };

  // 모달 열기 함수
  const openModal = (message, isSignupSuccess = false, fieldName = null) => {
    setModal({ isOpen: true, message, isSignupSuccess });

    // 필드명이 지정된 경우 해당 필드로 스크롤
    if (fieldName) {
      setTimeout(() => {
        scrollToField(fieldName);
      }, 100);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    const wasSignupSuccess = modal.isSignupSuccess;
    setModal({ isOpen: false, message: "", isSignupSuccess: false });

    // 회원가입 성공이었다면 로그인 페이지로 이동
    if (wasSignupSuccess) {
      router.push("/user/login");
    }
  };

  // ✉️ 인증번호 발송: POST /auth/email/send
  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      alert("이메일을 입력하세요");
      return;
    }

    console.log("인증번호 발송 시작:", formData.email);

    try {
      setLoading((p) => ({ ...p, sendCode: true }));

      const data = await sendVerificationCode(formData.email);

      console.log("응답 데이터:", data);

      // API 함수가 성공적으로 실행되면 인증번호 발송 성공
      setVerificationStatus((prev) => ({
        ...prev,
        codeSent: true,
        verified: false,
      }));
      setEmailError(""); // 에러 메시지 초기화
      openModal(data?.message || "인증번호가 발송되었습니다.");
    } catch (e) {
      console.error("인증번호 발송 에러:", e);
      console.error("에러 타입:", e?.name);
      console.error("에러 메시지:", e?.message);

      if (e?.response) {
        // axios 에러 응답 처리
        const { status, data } = e.response;
        if (status === 409) {
          setEmailError(
            data?.message ||
              "이미 가입된 이메일입니다. 다른 이메일을 사용해주세요."
          );
          setVerificationStatus((prev) => ({
            ...prev,
            codeSent: false,
            verified: false,
          }));
        } else {
          alert(data?.message || "인증번호 발송 실패");
        }
      } else if (e?.name === "TypeError" && e?.message?.includes("fetch")) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        alert(e?.message || "인증번호 발송 실패");
      }
    } finally {
      setLoading((p) => ({ ...p, sendCode: false }));
    }
  };

  // ✅ 인증번호 확인: POST /auth/email/verify
  const handleVerifyCode = async () => {
    if (!formData.email || !formData.verificationCode) {
      alert("이메일과 인증번호를 입력하세요");
      return;
    }
    try {
      setLoading((p) => ({ ...p, verifyCode: true }));
      await verifyCode(formData.email, formData.verificationCode);

      // API 함수가 성공적으로 실행되면 인증 성공
      setVerificationStatus((prev) => ({ ...prev, verified: true }));
      openModal("이메일 인증이 완료되었습니다.");
    } catch (e) {
      console.error("인증 확인 에러:", e);
      if (e?.response) {
        // axios 에러 응답 처리
        const { status, data } = e.response;
        alert(data?.message || "인증 확인 실패");
      } else if (e?.name === "TypeError" && e?.message?.includes("fetch")) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        alert(e?.message || "인증 확인 실패");
      }
      setVerificationStatus((prev) => ({ ...prev, verified: false }));
    } finally {
      setLoading((p) => ({ ...p, verifyCode: false }));
    }
  };

  // 🧾 회원가입: POST /auth/signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.email) {
      openModal("이메일을 입력해주세요.", false, "email");
      return;
    }
    if (!formData.password) {
      openModal("비밀번호를 입력해주세요.", false, "password");
      return;
    }
    if (!formData.confirmPassword) {
      openModal("비밀번호 확인을 입력해주세요.", false, "confirmPassword");
      return;
    }
    if (!formData.name) {
      openModal("이름을 입력해주세요.", false, "name");
      return;
    }
    if (!formData.nickname) {
      openModal("닉네임을 입력해주세요.", false, "nickname");
      return;
    }
    if (!formData.phone) {
      openModal("전화번호를 입력해주세요.", false, "phone");
      return;
    }
    if (!formData.address) {
      openModal("주소를 입력해주세요.", false, "address");
      return;
    }
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      openModal("생년월일을 선택해주세요.", false, "birth");
      return;
    }

    // 비밀번호 유효성 검사 - 특수문자 1자 이상 포함
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!passwordRegex.test(formData.password)) {
      openModal("비밀번호에서 특수문자를 입력해주세요.", false, "password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: true }));
      return;
    }
    // 이메일 인증 필수
    if (!verificationStatus.verified) {
      openModal("이메일 인증을 완료해주세요.", false, "email");
      return;
    }

    const birthDate =
      formData.birthYear && formData.birthMonth && formData.birthDay
        ? `${formData.birthYear}-${String(formData.birthMonth).padStart(
            2,
            "0"
          )}-${String(formData.birthDay).padStart(2, "0")}`
        : null;

    // ⚙️ 백엔드 SignupRequest에 맞춘 페이로드
    const payload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      nickname: formData.nickname,
      phone: formData.phone,
      userType: "User", // Role enum 값 (User, Admin, Advertiser)
      birthDate, // LocalDate (yyyy-MM-dd)
      description: "",
      roadAddress: formData.address,
      detailAddress: formData.detailAddress,

      // 하위 호환(백엔드에서 @JsonAlias 안 붙였다면 함께 보내줘도 무해)
      address: formData.address,
      detailedAddress: formData.detailAddress,
      birthYear: formData.birthYear ? Number(formData.birthYear) : null,
      birthMonth: formData.birthMonth ? Number(formData.birthMonth) : null,
      birthDay: formData.birthDay ? Number(formData.birthDay) : null,
    };

    console.log("회원가입 요청 데이터:", payload);
    console.log("주소 데이터 확인:", {
      address: formData.address,
      detailAddress: formData.detailAddress,
      roadAddress: payload.roadAddress,
      detailAddressPayload: payload.detailAddress,
    });

    try {
      setLoading((p) => ({ ...p, signup: true }));
      const data = await signup(payload);

      console.log("회원가입 응답 데이터:", data);
      clearAllErrors(); // 성공 시 모든 에러 초기화
      openModal(
        <>
          회원가입이 성공적으로 완료되었습니다.
          <br />
          로그인 후 이용해주세요.
        </>,
        true // 회원가입 성공 플래그
      );
      // 모달 닫기 시 자동으로 로그인 페이지로 이동
    } catch (e) {
      console.error("회원가입 에러:", e);
      if (e?.response) {
        // axios 에러 응답 처리
        const { status, data } = e.response;
        if (status === 409) {
          setEmailError(data?.message ?? "이미 존재하는 이메일입니다.");
        } else if (status === 400 && data?.data) {
          // 검증 에러 처리
          clearAllErrors();
          const validationErrors = data.data;

          if (validationErrors?.email) {
            setEmailError(validationErrors.email);
          }
          if (validationErrors?.password) {
            setPasswordError(validationErrors.password);
          }
          if (validationErrors?.confirmPassword) {
            setConfirmPasswordError(validationErrors.confirmPassword);
          }
          if (validationErrors?.name) {
            setNameError(validationErrors.name);
          }
          if (validationErrors?.nickname) {
            setNicknameError(validationErrors.nickname);
          }
          if (validationErrors?.phone) {
            setPhoneError(validationErrors.phone);
          }
          if (validationErrors?.address) {
            setAddressError(validationErrors.address);
          }
          if (
            validationErrors?.birthYear ||
            validationErrors?.birthMonth ||
            validationErrors?.birthDay
          ) {
            setBirthError(
              validationErrors.birthYear ||
                validationErrors.birthMonth ||
                validationErrors.birthDay
            );
          }
        } else {
          setEmailError(data?.message ?? "회원가입 실패");
        }
      } else {
        alert(e?.message ?? "서버 오류");
      }
    } finally {
      setLoading((p) => ({ ...p, signup: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <main className={styles.main}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h1 className={styles.title}>회원가입</h1>
              <p className={styles.subtitle}>
                펫풀 커뮤니티에 가입하여 반려동물의 영향력을 키워보세요
              </p>
            </div>

            {/* form 안쪽으로 submit 버튼 이동 */}
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>이메일</label>
                <div className={styles.inputGroup}>
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={loading.sendCode || !formData.email}
                    className={styles.verifyButton}
                  >
                    {loading.sendCode ? "발송중..." : "인증번호 발송"}
                  </button>
                </div>
                {verificationStatus.codeSent && (
                  <div className={styles.successMessage}>
                    인증번호가 발송되었습니다.
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
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={loading.verifyCode || !formData.verificationCode}
                    className={styles.verifyButton}
                  >
                    {loading.verifyCode ? "확인중..." : "인증번호 확인"}
                  </button>
                </div>
                {verificationStatus.verified && (
                  <div className={styles.successMessage}>이메일 인증 완료</div>
                )}
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>비밀번호</label>
                <div className={styles.inputGroup}>
                  <input
                    ref={passwordRef}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요 (특수문자 포함)"
                    className={styles.input}
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
                    ref={confirmPasswordRef}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    className={styles.input}
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
                <label className={styles.label}>이름</label>
                <div className={styles.inputGroup}>
                  <input
                    ref={nameRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                    className={styles.input}
                  />
                </div>
                {nameError && (
                  <div className={styles.errorMessage}>{nameError}</div>
                )}
              </div>

              {/* Nickname */}
              <div className={styles.formGroup}>
                <label className={styles.label}>닉네임</label>
                <div className={styles.inputGroup}>
                  <input
                    ref={nicknameRef}
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="닉네임을 입력하세요"
                    className={styles.input}
                  />
                </div>
                {nicknameError && (
                  <div className={styles.errorMessage}>{nicknameError}</div>
                )}
              </div>

              {/* Phone */}
              <div className={styles.formGroup}>
                <label className={styles.label}>전화번호</label>
                <div className={styles.inputGroup}>
                  <input
                    ref={phoneRef}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    className={styles.input}
                  />
                </div>
                {phoneError && (
                  <div className={styles.errorMessage}>{phoneError}</div>
                )}
              </div>

              {/* Address */}
              <div className={styles.formGroup}>
                <label className={styles.label}>주소</label>
                <div className={styles.inputGroup}>
                  <input
                    ref={addressRef}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="도로명 주소를 입력하세요"
                    className={styles.input}
                  />
                </div>
                {addressError && (
                  <div className={styles.errorMessage}>{addressError}</div>
                )}
              </div>

              {/* Detail Address */}
              <div className={styles.formGroup}>
                <label className={styles.label}>상세 주소</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    placeholder="상세 주소를 입력하세요"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className={styles.formGroup} ref={birthRef}>
                <div className={styles.birthLabel}>
                  <label className={styles.label}>생년월일</label>
                </div>
                <div className={styles.birthInputs}>
                  {/* 년 */}
                  <div className={styles.birthInputGroup}>
                    <select
                      name="birthYear"
                      value={formData.birthYear}
                      onChange={handleInputChange}
                      className={styles.birthInput}
                    >
                      <option value="">년</option>
                      {Array.from({ length: 50 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    <div className={styles.dropdownIcon}></div>
                  </div>

                  {/* 월 */}
                  <div className={styles.birthInputGroup}>
                    <select
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleInputChange}
                      className={styles.birthInput}
                    >
                      <option value="">월</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className={styles.dropdownIcon}></div>
                  </div>

                  {/* 일 */}
                  <div className={styles.birthInputGroup}>
                    <select
                      name="birthDay"
                      value={formData.birthDay}
                      onChange={handleInputChange}
                      className={styles.birthInput}
                    >
                      <option value="">일</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className={styles.dropdownIcon}></div>
                  </div>
                </div>
                {birthError && (
                  <div className={styles.errorMessage}>{birthError}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading.signup || errors.passwordMatch}
                className={styles.submitButton}
              >
                {loading.signup ? "처리중..." : "확인"}
              </button>
            </form>

            <div className={styles.loginLink}>
              <Link href="/user/login" className={styles.loginButton}>
                이미 계정이 있으신가요? 로그인
              </Link>
            </div>
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
