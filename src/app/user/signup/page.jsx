"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
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
              <p className={styles.subtitle}>
                펫풀 커뮤니티에 가입하여 반려동물의 영향력을 키워보세요
              </p>
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
                    placeholder="전화번호를 입력하세요"
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
            </form>

            <div className={styles.loginLink}>
              <Link href="/user/login" className={styles.loginButton}>
                이미 계정이 있으신가요? 로그인
              </Link>
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
