/**
 * 토큰 상태 디버그 컴포넌트
 * 개발 환경에서 현재 토큰 상태를 확인할 수 있습니다.
 */

"use client";

import { useState, useEffect } from "react";
import { getTokenStatus } from "@/utils/tokenManager";

export default function TokenDebugger() {
  const [tokenStatus, setTokenStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 개발 환경에서만 동작
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const updateTokenStatus = () => {
      setTokenStatus(getTokenStatus());
    };

    updateTokenStatus();
    const interval = setInterval(updateTokenStatus, 5000); // 5초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 개발 환경이 아니면 렌더링하지 않음
  if (process.env.NODE_ENV !== "development" || !tokenStatus) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 9999,
        backgroundColor: isVisible
          ? "rgba(0, 0, 0, 0.9)"
          : "rgba(0, 0, 0, 0.6)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "monospace",
        fontSize: "12px",
        maxWidth: "300px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
        🔒 토큰 상태 ({tokenStatus.userType || "NONE"}) {isVisible ? "▼" : "▶"}
      </div>

      {isVisible && (
        <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
          <div
            style={{ color: tokenStatus.isLoggedIn ? "#4ade80" : "#f87171" }}
          >
            로그인 상태:{" "}
            {tokenStatus.isLoggedIn ? "✅ 로그인됨" : "❌ 로그아웃"}
          </div>

          {tokenStatus.userType && (
            <div style={{ color: "#a78bfa" }}>
              사용자 타입: {tokenStatus.userType}
            </div>
          )}

          <div
            style={{ color: tokenStatus.hasValidToken ? "#4ade80" : "#f87171" }}
          >
            토큰 유효성: {tokenStatus.hasValidToken ? "✅ 유효" : "❌ 무효"}
          </div>

          {tokenStatus.needsRefresh && (
            <div style={{ color: "#fbbf24" }}>⚠️ 토큰 갱신 필요</div>
          )}

          <div style={{ marginTop: "5px", fontSize: "10px", opacity: 0.8 }}>
            액세스 토큰:{" "}
            {tokenStatus.accessTokenExpired ? "❌ 만료" : "✅ 유효"}
            <br />
            리프레시 토큰:{" "}
            {tokenStatus.refreshTokenExpired ? "❌ 만료" : "✅ 유효"}
          </div>

          <div style={{ marginTop: "5px", fontSize: "10px", color: "#9ca3af" }}>
            클릭하여 접기/펼치기
          </div>
        </div>
      )}
    </div>
  );
}
