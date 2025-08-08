"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image"; // ✅ 이미지 사용 시 필수
import styles from "./PasswordResetForm.module.css";

export default function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email verification, 2: password reset

  const handleSendVerificationCode = () => {
    console.log("Sending verification code to:", email);
  };

  const handleVerifyCode = () => {
    console.log("Verifying code:", verificationCode);
    setStep(2);
  };

  const handleResetPassword = () => {
    console.log("Resetting password:", { newPassword, confirmPassword });
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <i className={styles.icon}>
            <Image
              src="/user/key.svg"
              alt="비밀번호 찾기"
              width={128}
              height={128}
              className={styles.logo}
            />
          </i>
        </div>
        <h1 className={styles.title}>비밀번호 찾기</h1>
        <p className={styles.subtitle}>
          이메일 인증을 통해 비밀번호를 재설정하세요
        </p>
      </div>

      {/* Form Section */}
      <div className={styles.formSection}>
        {/* Step 1: Email Verification */}
        <div className={styles.stepContainer}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>
              <span>1</span>
            </div>
            <h2 className={styles.stepTitle}>이메일 인증</h2>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일 주소</label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <div className={styles.inputIcon}></div>
            </div>
          </div>

          <button
            onClick={handleSendVerificationCode}
            className={styles.primaryButton}
          >
            인증번호 발송
          </button>

          <div className={styles.verificationSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>인증번호</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="6자리 인증번호 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`${styles.input} ${styles.disabledInput}`}
                  maxLength={6}
                />
                <div className={styles.inputIcon}></div>
              </div>
            </div>
            <p className={styles.helpText}>
              이메일로 전송된 6자리 숫자를 입력하세요
            </p>
            <button
              onClick={handleVerifyCode}
              className={styles.secondaryButton}
            >
              인증번호 확인
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Step 2: Password Reset */}
        <div className={`${styles.stepContainer} ${styles.disabledStep}`}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumberDisabled}>
              <span>2</span>
            </div>
            <h2 className={styles.stepTitleDisabled}>새 비밀번호 설정</h2>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.labelDisabled}>새 비밀번호</label>
            <div className={styles.inputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${styles.input} ${styles.disabledInput}`}
                disabled
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              ></button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.labelDisabled}>비밀번호 확인</label>
            <div className={styles.inputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${styles.disabledInput}`}
                disabled
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></button>
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            className={styles.secondaryButton}
            disabled
          >
            확인
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          계정이 기억나셨나요?{" "}
          <Link href="/user/login" className={styles.loginButton}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
