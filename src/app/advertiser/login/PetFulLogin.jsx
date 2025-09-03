"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PetFulLogin.module.css";
import Image from "next/image";

// 환경변수로 게이트웨이/백엔드 베이스 URL 관리
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api/v1/advertiser-service";

export default function PetFulLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    isSuccess: false,
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/advertiser/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          userId: email, // 백엔드에서는 userId로 받음
          password: password,
        }),
      });

      let data = {};
      try {
        const responseText = await response.text();
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("로그인 JSON 파싱 에러:", parseError);
      }

      if (response.ok) {
        // 백엔드 응답 구조 디버깅
        console.log("백엔드 응답 전체:", data);
        console.log("data.data 내용:", data.data);

        // 로그인 성공 - 토큰 저장
        // 백엔드 응답 구조에 따라 토큰 위치 확인
        let token = null;

        if (data.data && data.data.token) {
          // ApiResponse 구조: { data: { token: "..." } }
          token = data.data.token;
        } else if (data.data && data.data.accessToken) {
          // ApiResponse 구조: { data: { accessToken: "..." } }
          token = data.data.accessToken;
        } else if (data.data && data.data.access_token) {
          // ApiResponse 구조: { data: { access_token: "..." } }
          token = data.data.access_token;
        } else if (data.data && data.data.jwt) {
          // ApiResponse 구조: { data: { jwt: "..." } }
          token = data.data.jwt;
        } else if (data.token) {
          // 직접 토큰 구조: { token: "..." }
          token = data.token;
        } else if (data.accessToken) {
          // accessToken 구조: { accessToken: "..." }
          token = data.accessToken;
        } else if (data.access_token) {
          // access_token 구조: { access_token: "..." }
          token = data.access_token;
        }

        if (token) {
          // JWT 토큰 디코딩하여 payload 확인
          try {
            const tokenParts = token.split(".");
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log("JWT 토큰 payload:", payload);
            }
          } catch (decodeError) {
            console.error("JWT 토큰 디코딩 실패:", decodeError);
          }

          // 토큰들을 localStorage에 저장
          localStorage.setItem("advertiserToken", token);
          localStorage.setItem(
            "advertiserRefreshToken",
            data.data.refreshToken
          );
          localStorage.setItem("advertiserEmail", email);
          localStorage.setItem("advertiserNo", data.data.advertiserNo);
          localStorage.setItem("userType", data.data.userType);

          console.log("토큰 저장 완료:", {
            accessToken: token,
            refreshToken: data.data.refreshToken,
            advertiserNo: data.data.advertiserNo,
            userType: data.data.userType,
          });

          // 헤더 상태 업데이트를 위한 커스텀 이벤트 발생
          window.dispatchEvent(new Event("loginStatusChanged"));

          // 로그인 성공 모달 표시
          setModal({
            isOpen: true,
            message:
              "로그인에 성공했습니다! 확인 버튼을 클릭하면 광고주 대시보드로 이동합니다.",
            isSuccess: true,
          });
        } else {
          console.error("토큰을 찾을 수 없습니다. 응답 구조:", data);
          setError("로그인 응답에 토큰이 없습니다.");
        }
      } else {
        // 로그인 실패
        if (response.status === 401) {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (response.status === 400) {
          setError(data.message || "잘못된 요청입니다.");
        } else {
          setError(data.message || "로그인에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError("네트워크 연결을 확인해주세요.");
      } else {
        setError(
          error.message ||
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    const wasSuccess = modal.isSuccess;
    setModal({ isOpen: false, message: "", isSuccess: false });

    // 로그인 성공이었다면 광고주 대시보드로 이동
    if (wasSuccess) {
      // 토큰이 제대로 저장되었는지 확인
      const token = localStorage.getItem("advertiserToken");
      if (token) {
        console.log("페이지 이동 전 토큰 확인:", token);
        // 토큰 저장 후 페이지 새로고침으로 토큰 적용 보장
        setTimeout(() => {
          window.location.href = "/advertiser/ads-list";
        }, 100);
      } else {
        console.error("토큰이 저장되지 않았습니다.");
        setError("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 모달 컴포넌트
  const SuccessModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
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

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="PetFul 로고"
              width={128}
              height={128}
              className={styles.logo}
            />
          </div>
          <h1 className={styles.title}>반려동물과 함께하는 디지털 여정</h1>
        </div>

        {/* Login Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              className={styles.input}
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>비밀번호</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                <Image
                  src={showPassword ? "/user/eye.svg" : "/user/eye-closed.svg"}
                  alt="비밀번호 보기/숨기기"
                  width={18}
                  height={14}
                  className={styles.eyeIcon}
                />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Login Button */}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Footer Links */}
        <div className={styles.footer}>
          <div className={styles.linkGroup}>
            <Link href="/advertiser/signup" className={styles.link}>
              회원가입
            </Link>
            <Link href="/advertiser/passwordfind" className={styles.link}>
              비밀번호 찾기
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className={styles.terms}>
          로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
        </div>
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
