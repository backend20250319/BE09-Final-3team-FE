import { useState, useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // 애니메이션 완료 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyle = () => {
    const baseStyle = {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "16px 20px",
      borderRadius: "8px",
      color: "white",
      fontSize: "14px",
      fontWeight: "500",
      zIndex: 10000,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
      transform: isVisible ? "translateX(0)" : "translateX(100%)",
      opacity: isVisible ? 1 : 0,
    };

    switch (type) {
      case "success":
        return { ...baseStyle, backgroundColor: "#10B981" };
      case "error":
        return { ...baseStyle, backgroundColor: "#EF4444" };
      case "warning":
        return { ...baseStyle, backgroundColor: "#F59E0B" };
      default:
        return { ...baseStyle, backgroundColor: "#6B7280" };
    }
  };

  return (
    <div style={getToastStyle()}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {type === "success" && (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {type === "error" && (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "2px",
            marginLeft: "8px",
            opacity: 0.8,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
