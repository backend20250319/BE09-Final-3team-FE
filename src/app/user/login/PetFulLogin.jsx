"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PetFulLogin.module.css";
import Image from "next/image";
import axios from "axios";

// 환경변수로 게이트웨이/백엔드 베이스 URL 관리
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL + "/user-service" ||
  "http://localhost:8000/api/v1/user-service";

// 디버깅용 로그
console.log("API_BASE URL:", API_BASE);

export default function PetFulLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setLoading(true);

    try {
      console.log("로그인 시도:", { email });

      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: email,
        password: password,
      });

      console.log("로그인 응답 상태:", response.status, response.statusText);
      console.log("로그인 응답 데이터:", response.data);

      const data = response.data;

      if (response.status === 200) {
        // 로그인 성공 - 토큰 저장
        const authData = data.data; // ApiResponse 구조에서 실제 데이터 추출

        if (authData && authData.accessToken) {
          localStorage.setItem("token", authData.accessToken);
          localStorage.setItem("refreshToken", authData.refreshToken);
          localStorage.setItem("userEmail", authData.email);
          localStorage.setItem("userNickname", authData.name || ""); // 닉네임 저장
          localStorage.setItem("userNo", authData.userNo || ""); // 사용자 번호 저장

          // 토큰 만료 시간 저장 (선택사항)
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

          // 사용자 타입 확인하여 Admin인 경우 관리자 페이지로 리다이렉트
          const userType =
            authData.userType ||
            authData.role ||
            authData.user_type ||
            data.userType ||
            data.role ||
            data.user_type ||
            authData.type ||
            data.type;

          if (
            userType === "Admin" ||
            userType === "ADMIN" ||
            userType === "admin"
          ) {
            window.location.href = "/admin";
          } else {
            // 일반 사용자인 경우 기존 로직 실행
            // 커스텀 이벤트 발생 (헤더 업데이트용)
            window.dispatchEvent(new Event("loginStatusChanged"));

            // 홈페이지로 이동
            router.replace("/");
          }
        } else {
          setError("로그인 응답에 토큰이 없습니다.");
        }
      } else {
        // 로그인 실패
        if (response.status === 401) {
          setPasswordError("비밀번호가 틀렸습니다.");
        } else if (response.status === 400) {
          setError(data.message || "로그인 요청이 올바르지 않습니다.");
        } else if (response.status === 500) {
          // 백엔드에서 BadCredentialsException이 500으로 반환되는 경우
          if (data.message && data.message.includes("Bad credentials")) {
            setPasswordError("비밀번호가 틀렸습니다.");
          } else {
            setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        } else {
          setError(data.message || "로그인에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      if (error.response) {
        // axios 에러 응답 처리
        const { status, data } = error.response;
        if (status === 401) {
          setPasswordError("비밀번호가 틀렸습니다.");
        } else if (status === 400) {
          setError(data.message || "로그인 요청이 올바르지 않습니다.");
        } else if (status === 500) {
          if (data.message && data.message.includes("Bad credentials")) {
            setPasswordError("비밀번호가 틀렸습니다.");
          } else {
            setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        } else {
          setError(data.message || "로그인에 실패했습니다. 다시 시도해주세요.");
        }
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        setError("네트워크 연결을 확인해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              disabled={loading}
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
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                disabled={loading}
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
            {/* Password Error Message */}
            {passwordError && (
              <div className={styles.passwordErrorMessage}>{passwordError}</div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Login Button */}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Footer Links */}
        <div className={styles.footer}>
          <div className={styles.linkGroup}>
            <Link href="/user/signup" className={styles.link}>
              회원가입
            </Link>
            <Link href="/user/passwordfind" className={styles.link}>
              비밀번호 찾기
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className={styles.terms}>
          로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}
