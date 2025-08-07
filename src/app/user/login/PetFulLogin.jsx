"use client";

import { useState } from "react";
import styles from "./PetFulLogin.module.css";
import Image from "next/image";

export default function PetFulLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
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

          {/* Login Button */}
          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>

        {/* Footer Links */}
        <div className={styles.footer}>
          <div className={styles.linkGroup}>
            <a href="#" className={styles.link}>
              회원가입
            </a>
            <a href="#" className={styles.link}>
              비밀번호 찾기
            </a>
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
