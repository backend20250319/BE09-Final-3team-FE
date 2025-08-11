"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function SignupPage() {
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

  const [errors, setErrors] = useState({
    passwordMatch: false,
  });

  const [verificationStatus, setVerificationStatus] = useState({
    codeSent: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 비밀번호 확인 검증
    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      if (confirmPassword && password !== confirmPassword) {
        setErrors((prev) => ({ ...prev, passwordMatch: true }));
      } else {
        setErrors((prev) => ({ ...prev, passwordMatch: false }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 비밀번호 일치 확인
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: true }));
      return;
    }

    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const sendVerificationCode = () => {
    console.log("Sending verification code to:", formData.email);
    // Add verification code sending logic here
    setVerificationStatus((prev) => ({ ...prev, codeSent: true }));
  };

  const verifyCode = () => {
    console.log("Verifying code:", formData.verificationCode);
    // Add code verification logic here
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
                  />
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    className={styles.verifyButton}
                  >
                    인증번호 발송
                  </button>
                </div>
                {verificationStatus.codeSent && (
                  <div className={styles.successMessage}>
                    인증번호가 발송되었습니다.
                  </div>
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
                    className={styles.verifyButton}
                  >
                    인증번호 확인
                  </button>
                </div>
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
                  <div className={styles.errorMessage}>일치하지 않습니다.</div>
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
                    placeholder="전화번호를 입력하세요"
                    className={styles.input}
                  />
                </div>
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
                  />
                </div>
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
              이미 계정이 있으신가요? <span>로그인</span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className={styles.submitButton}
            >
              확인
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
