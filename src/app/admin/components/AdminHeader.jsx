import styles from "@/app/admin/styles/ProductManagement.module.css";
import mainstyles from "@/app/styles/Header.module.css";
import React from "react";
import { useRouter } from "next/navigation";
import { adminLogout } from "@/api/api";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // localStorage에서 refreshToken 가져오기
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        // 백엔드 로그아웃 API 호출
        await adminLogout(refreshToken);
        console.log("관리자 로그아웃 성공");
      }

      // 로컬 스토리지 정리
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminType");

      // 메인 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      // 에러가 발생해도 로컬 스토리지는 정리하고 메인 페이지로 이동
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminType");
      router.push("/");
    }
  };

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>PetFulAdmin</h1>
          </div>
          <div className={styles.headerActions}>
            <div
              className={mainstyles.signupButton}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              로그아웃
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
