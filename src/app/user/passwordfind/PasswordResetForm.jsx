"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image"; // ✅ 이미지 사용 시 필수
import { useRouter } from "next/navigation";
import styles from "./PasswordResetForm.module.css";
import {
  requestPasswordReset,
  verifyPasswordResetCode,
  changePassword,
} from "../../../api/userAuthApi";

export default function PasswordResetForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email verification, 2: password reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);

  const handleSendVerificationCode = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("비밀번호 재설정 요청 시작");

      const data = await requestPasswordReset(email);

      console.log("비밀번호 재설정 요청 응답 데이터:", data);
      console.log("비밀번호 재설정 요청 성공:", data);

      // 인증번호 발송 성공 시 모달 표시
      setShowEmailSentModal(true);

      // 2초 후 모달 닫기
      setTimeout(() => {
        setShowEmailSentModal(false);
      }, 2000);
    } catch (error) {
      console.error("비밀번호 재설정 요청 실패:", error);
      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        setError(data.message || "비밀번호 재설정 요청에 실패했습니다.");
      } else {
        setError(error.message || "비밀번호 재설정 요청에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError("인증번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("인증번호 확인 시작");
      console.log("요청 데이터:", { email, verificationCode });

      // 비밀번호 재설정 인증번호 확인
      const data = await verifyPasswordResetCode(email, verificationCode);

      console.log("인증번호 확인 응답 데이터:", data);
      console.log("응답 상태:", data?.code || "unknown");

      // 응답 확인 - 백엔드에서 성공 응답이 왔는지 확인
      // 성공 조건: code가 "2000"이거나, code가 없고 message가 성공 관련이거나, HTTP 200 응답
      const isSuccess =
        data &&
        (data.code === "2000" ||
          data.code === 2000 ||
          (data.code === undefined && !data.message?.includes("실패")) ||
          data.message?.includes("성공") ||
          data.message?.includes("완료"));

      if (isSuccess) {
        console.log("인증번호 확인 성공:", data);

        // 인증 성공 시 모달 표시
        setShowVerificationModal(true);

        // 2초 후 모달 닫고 다음 단계로 진행
        setTimeout(() => {
          setShowVerificationModal(false);
          setStep(2);
        }, 2000);
      } else {
        // 백엔드에서 실패 응답이 온 경우
        const errorMessage = data?.message || "인증번호가 일치하지 않습니다.";
        console.error("인증 실패:", errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("인증번호 확인 실패:", error);
      console.error("에러 응답:", error?.response?.data);
      console.error("에러 상태:", error?.response?.status);

      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        const errorMessage = data.message || "인증번호가 올바르지 않습니다.";
        setError(errorMessage);
        // 모달 대신 에러 상태로 표시 (비밀번호 찾기 페이지는 모달이 없음)
        setError(errorMessage);
        console.error("백엔드 에러 메시지:", errorMessage);
      } else {
        const errorMessage = error.message || "인증번호 확인에 실패했습니다.";
        setError(errorMessage);
        // 모달 대신 에러 상태로 표시 (비밀번호 찾기 페이지는 모달이 없음)
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("비밀번호 변경 시작");

      const data = await changePassword(
        email,
        verificationCode,
        newPassword,
        confirmPassword
      );

      console.log("비밀번호 변경 응답 데이터:", data);

      console.log("비밀번호 변경 성공:", data);

      // 비밀번호 변경 성공 시 모달 표시
      setShowPasswordResetModal(true);

      // 3초 후 모달 닫고 로그인 페이지로 이동
      setTimeout(() => {
        setShowPasswordResetModal(false);
        router.push("/user/login");
      }, 3000);
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        setError(data.message || "비밀번호 변경에 실패했습니다.");
      } else {
        setError(error.message || "비밀번호 변경에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
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
        {/* Error Message */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Success Message */}
        {success && <div className={styles.successMessage}>{success}</div>}
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
            disabled={loading}
          >
            {loading ? "발송 중..." : "인증번호 발송"}
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
                  className={styles.input}
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
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? "확인 중..." : "인증번호 확인"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Step 2: Password Reset */}
        <div
          className={`${styles.stepContainer} ${
            step !== 2 ? styles.disabledStep : ""
          }`}
          style={{ pointerEvents: step !== 2 ? "none" : "auto" }}
        >
          <div className={styles.stepHeader}>
            <div
              className={
                step === 2 ? styles.stepNumber : styles.stepNumberDisabled
              }
            >
              <span>2</span>
            </div>
            <h2
              className={
                step === 2 ? styles.stepTitle : styles.stepTitleDisabled
              }
            >
              새 비밀번호 설정
            </h2>
          </div>

          <div className={styles.inputGroup}>
            <label className={step === 2 ? styles.label : styles.labelDisabled}>
              새 비밀번호
            </label>
            <div className={styles.inputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${styles.input} ${
                  step !== 2 ? styles.disabledInput : ""
                }`}
                disabled={step !== 2}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              ></button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={step === 2 ? styles.label : styles.labelDisabled}>
              비밀번호 확인
            </label>
            <div className={styles.inputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${
                  step !== 2 ? styles.disabledInput : ""
                }`}
                disabled={step !== 2}
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
            disabled={step !== 2 || loading}
          >
            {loading ? "변경 중..." : "확인"}
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

      {/* 인증 성공 모달 */}
      {showVerificationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>인증 완료</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.successIcon}>✓</div>
              <p>인증번호가 확인되었습니다!</p>
            </div>
          </div>
        </div>
      )}

      {/* 인증번호 발송 완료 모달 */}
      {showEmailSentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>인증번호 발송 완료</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.successIcon}>✓</div>
              <p>인증번호를 발송하였습니다!</p>
              <p className={styles.modalSubText}>이메일을 확인해주세요.</p>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 완료 모달 */}
      {showPasswordResetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>비밀번호 변경 완료</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.successIcon}>✓</div>
              <p>비밀번호가 수정되었습니다!</p>
              <p className={styles.modalSubText}>로그인 페이지로 이동합니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
