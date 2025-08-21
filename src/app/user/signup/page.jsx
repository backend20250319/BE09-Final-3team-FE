"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 환경변수로 게이트웨이/백엔드 베이스 URL 관리
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api/v1/user-service";
// 게이트웨이 쓰면 예: "http://localhost:8000/api/v1/user-service"

// 디버깅용 로그
console.log("API_BASE URL:", API_BASE);

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
  const [loading, setLoading] = useState({
    signup: false,
    sendCode: false,
    verifyCode: false,
  });

  // 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 이메일 입력 시 에러 메시지 초기화
    if (name === "email") {
      setEmailError("");
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

  // 모달 열기 함수
  const openModal = (message) => {
    setModal({ isOpen: true, message });
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModal({ isOpen: false, message: "" });

    // 회원가입 성공 메시지가 있었다면 로그인 페이지로 이동
    if (modal.message && modal.message.includes("회원가입")) {
      router.push("/user/login");
    }
  };

  // ✉️ 인증번호 발송: POST /auth/email/send
  const sendVerificationCode = async () => {
    if (!formData.email) {
      alert("이메일을 입력하세요");
      return;
    }

    console.log("인증번호 발송 시작:", formData.email);
    console.log("요청 URL:", `${API_BASE}/auth/email/send`);

    try {
      setLoading((p) => ({ ...p, sendCode: true }));

      const requestBody = { email: formData.email };
      console.log("요청 데이터:", requestBody);

      const res = await fetch(`${API_BASE}/auth/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(requestBody), // EmailVerificationRequest { email }
      });

      console.log("응답 상태:", res.status, res.statusText);
      console.log("응답 헤더:", Object.fromEntries(res.headers.entries()));

      // 응답 데이터 확인
      let data = {};
      try {
        const responseText = await res.text();
        console.log("응답 텍스트:", responseText);

        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("JSON 파싱 에러:", parseError);
        console.error("응답 텍스트:", responseText);
      }

      console.log("응답 데이터:", data);

      if (res.ok) {
        setVerificationStatus((prev) => ({
          ...prev,
          codeSent: true,
          verified: false,
        }));
        setEmailError(""); // 에러 메시지 초기화
        openModal(data.message || "인증번호가 발송되었습니다.");
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
        // 서버에서 명시적으로 에러 응답을 보낸 경우
        throw new Error(data.message || `서버 오류 (${res.status})`);
      }
    } catch (e) {
      console.error("인증번호 발송 에러:", e);
      console.error("에러 타입:", e.name);
      console.error("에러 메시지:", e.message);

      if (e.name === "TypeError" && e.message.includes("fetch")) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        alert(e.message || "인증번호 발송 실패");
      }
    } finally {
      setLoading((p) => ({ ...p, sendCode: false }));
    }
  };

  // ✅ 인증번호 확인: POST /auth/email/verify
  const verifyCode = async () => {
    if (!formData.email || !formData.verificationCode) {
      alert("이메일과 인증번호를 입력하세요");
      return;
    }
    try {
      setLoading((p) => ({ ...p, verifyCode: true }));
      const res = await fetch(`${API_BASE}/auth/email/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode, // EmailVerificationConfirmRequest { email, code }
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // 백엔드 응답 형식에 따라 처리
        const isVerified =
          data === true || data.verified === true || data.success === true;
        if (isVerified) {
          setVerificationStatus((prev) => ({ ...prev, verified: true }));
          openModal("이메일 인증이 완료되었습니다.");
        } else {
          setVerificationStatus((prev) => ({ ...prev, verified: false }));
          alert("인증번호가 올바르지 않습니다.");
        }
      } else {
        throw new Error(data.message || `인증 확인 실패 (${res.status})`);
      }
    } catch (e) {
      console.error("인증 확인 에러:", e);
      if (e.name === "TypeError" && e.message.includes("fetch")) {
        alert("네트워크 연결을 확인해주세요.");
      } else {
        alert(e.message || "인증 확인 실패");
      }
      setVerificationStatus((prev) => ({ ...prev, verified: false }));
    } finally {
      setLoading((p) => ({ ...p, verifyCode: false }));
    }
  };

  // 🧾 회원가입: POST /auth/signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: true }));
      return;
    }
    // (선택) 이메일 미인증 차단
    if (!verificationStatus.verified) {
      if (!confirm("이메일 인증을 완료하지 않았습니다. 계속 진행할까요?"))
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

    try {
      setLoading((p) => ({ ...p, signup: true }));
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(payload),
      });

      console.log("회원가입 응답 상태:", res.status, res.statusText);

      let data = {};
      try {
        const responseText = await res.text();
        console.log("회원가입 응답 텍스트:", responseText);

        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("회원가입 JSON 파싱 에러:", parseError);
      }

      console.log("회원가입 응답 데이터:", data);

      if (res.status === 201) {
        openModal(
          <>
            회원가입이 성공적으로 완료되었습니다.
            <br />
            로그인 후 이용해주세요.
          </>
        );
        // 모달 닫기 시 자동으로 로그인 페이지로 이동
      } else if (res.status === 409) {
        setEmailError(data.message ?? "이미 존재하는 이메일입니다.");
      } else {
        setEmailError(
          data.message ?? `회원가입 실패: ${data.message || res.statusText}`
        );
      }
    } catch (e) {
      console.error(e);
      alert("서버 오류");
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
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className={styles.input}
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
                    placeholder="비밀번호를 입력하세요"
                    className={styles.input}
                  />
                </div>
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
                  />
                </div>
                {errors.passwordMatch && formData.confirmPassword && (
                  <div className={styles.errorMessage}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>이름</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Nickname */}
              <div className={styles.formGroup}>
                <label className={styles.label}>닉네임</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="닉네임을 입력하세요"
                    className={styles.input}
                  />
                </div>
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
                    placeholder="010-1234-5678"
                    maxLength={13}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Address */}
              <div className={styles.formGroup}>
                <label className={styles.label}>주소</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="도로명 주소를 입력하세요"
                    className={styles.input}
                  />
                </div>
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
              <div className={styles.formGroup}>
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
