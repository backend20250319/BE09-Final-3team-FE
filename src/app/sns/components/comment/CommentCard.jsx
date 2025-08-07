import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/comment/CommentCard.module.css";

export default function CommentCard({ comment }) {
  const username = comment.username;
  const avatar = comment.avatar;
  const sentiment = comment.sentiment;
  const status = comment.status;
  const text = comment.content; // content를 text로 매핑
  const timeAgo = comment.timestamp || comment.timeAgo; // timestamp를 timeAgo로 매핑
  const isDeleted = comment.isDeleted || false; // 기본값 false

  // 부정댓글 내용 표시 상태 관리
  const [isNegativeContentVisible, setIsNegativeContentVisible] =
    useState(false);

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isNegativeComment = sentiment === "부정";

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // 실제 구현에서는 API 호출 등의 삭제 로직이 들어갑니다
    alert("댓글이 삭제되었습니다.");
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const getSentimentBgColor = (sentiment) => {
    switch (sentiment) {
      case "긍정":
        return "#D1FAE5"; // 연한 초록색
      case "중립":
        return "#F3F4F6"; // 연한 회색
      case "부정":
        return "#FEE2E2"; // 연한 빨간색
      default:
        return "#FFFFFF"; // 기본 흰색
    }
  };

  const getSentimentTextColor = (sentiment) => {
    switch (sentiment) {
      case "긍정":
        return "#166534";
      case "중립":
        return "#1F2937";
      case "부정":
        return "#991B1B";
      default:
        return "#4B5563";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "승인됨":
        return "#E5E7EB"; // 연한 회색
      case "삭제됨":
        return "#FEE2E2"; // 연한 빨간색
      default:
        return "#F3F4F6"; // 기본 연한 회색
    }
  };
  const getStatusTextColor = (status) => {
    switch (status) {
      case "승인됨":
        return "#4B5563";
      case "삭제됨":
        return "#991B1B";
      default:
        return "#4B5563";
    }
  };

  return (
    <div
      className={`${styles.commentCard} ${isDeleted ? styles.deleted : ""}`}
      style={{
        backgroundColor: isDeleted ? "#FECACA" : "#FFFFFF",
        borderColor: isDeleted ? "#991B1B" : "#e5e7eb",
      }}
    >
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {avatar && avatar.startsWith("/") ? (
                <img
                  src={avatar}
                  alt={username}
                  style={{ width: "18px", height: "18px", borderRadius: "50%" }}
                />
              ) : (
                avatar || username.charAt(0).toUpperCase()
              )}
            </div>
            <span className={styles.username}>{username}</span>
            <span
              className={styles.sentimentTag}
              style={{
                backgroundColor: getSentimentBgColor(sentiment),
                color: getSentimentTextColor(sentiment),
              }}
            >
              {sentiment}
            </span>
            <span
              className={styles.statusTag}
              style={{
                backgroundColor: getStatusBgColor(status),
                color: getStatusTextColor(status),
              }}
            >
              {status}
            </span>
          </div>
        </div>

        <div className={styles.commentText}>
          {isNegativeComment && !isNegativeContentVisible ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
              }}
            >
              <span>부정적인 내용으로 인해 숨겨진 댓글입니다.</span>
              <button
                onClick={() => setIsNegativeContentVisible(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  color: "#374151",
                  fontSize: "20px",
                  fontWeight: "bold",
                  transition: "color 0.2s ease",
                }}
                title="댓글 내용 보기"
                onMouseEnter={(e) => (e.target.style.color = "#111827")}
                onMouseLeave={(e) => (e.target.style.color = "#374151")}
              >
                <AiOutlineEye />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{text}</span>
              {isNegativeComment && isNegativeContentVisible && (
                <button
                  onClick={() => setIsNegativeContentVisible(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    color: "#374151",
                    fontSize: "20px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    transition: "color 0.2s ease",
                  }}
                  title="댓글 내용 숨기기"
                  onMouseEnter={(e) => (e.target.style.color = "#111827")}
                  onMouseLeave={(e) => (e.target.style.color = "#374151")}
                >
                  <AiOutlineEyeInvisible />
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.commentFooter}>
          <span
            className={styles.timeAgo}
            style={{ color: isDeleted ? "#DC2626" : "#6B7280" }}
          >
            {timeAgo}
          </span>
        </div>
      </div>

      {!isDeleted && (
        <button className={styles.deleteButton} onClick={handleDelete}>
          <div className={styles.deleteIcon}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path
                d="M1 3V13C1 13.55 1.45 14 2 14H10C10.55 14 11 13.55 11 13V3H1ZM2.5 4.5H3.5V12.5H2.5V4.5ZM5.5 4.5H6.5V12.5H5.5V4.5ZM8.5 4.5H9.5V12.5H8.5V4.5ZM1.5 1.5V0C1.5 0 1.5 0 1.5 0H10.5C10.5 0 10.5 0 10.5 0V1.5H12V2.5H0V1.5H1.5Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          Delete
        </button>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={cancelDelete}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              minWidth: "320px",
              maxWidth: "400px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "16px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1F2937",
                }}
              >
                댓글 삭제 확인
              </h3>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#6B7280",
                  lineHeight: "1.5",
                }}
              >
                {username}의 댓글을 삭제하시겠습니까?
                <br />
                삭제된 댓글은 복구할 수 없습니다.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelDelete}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F9FAFB";
                  e.target.style.borderColor = "#9CA3AF";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.borderColor = "#D1D5DB";
                }}
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#DC2626",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#B91C1C";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#DC2626";
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
