import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { deleteComment } from "../../lib/commentData";
import Toast from "./Toast";
import styles from "../../styles/comment/CommentCard.module.css";

export default function CommentCard({ comment, onCommentDeleted }) {
  const username = comment.username || comment.author || "사용자";
  const avatar = comment.avatar || comment.profile_image || null;
  const sentiment = comment.sentiment;
  const text = comment.content || comment.text || "내용 없음"; // content를 text로 매핑
  const timeAgo = comment.timestamp || comment.timeAgo || comment.created_at || "시간 정보 없음"; // timestamp를 timeAgo로 매핑

  // 삭제 상태 관리 - API 응답의 is_deleted 필드 사용 + 로컬 삭제 상태
  const [localIsDeleted, setLocalIsDeleted] = useState(comment.is_deleted || comment.isDeleted || false);
  const isDeleted = localIsDeleted;
  
  // 디버깅용 로그 (개발 완료 후 제거)
  // useEffect(() => {
  //   console.log("Comment data:", comment);
  //   console.log("isDeleted:", isDeleted);
  // }, [comment, isDeleted]);

  // 부정댓글 내용 표시 상태 관리
  const [isNegativeContentVisible, setIsNegativeContentVisible] =
    useState(false);

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast 상태 관리
  const [toast, setToast] = useState(null);

  // 감정을 한글로 변환
  const getSentimentDisplay = (sentiment) => {
    switch (sentiment?.toUpperCase()) {
      case "POSITIVE":
        return "긍정";
      case "NEGATIVE":
        return "부정";
      case "NEUTRAL":
        return "중립";
      default:
        return sentiment || "중립";
    }
  };

  const displaySentiment = getSentimentDisplay(sentiment);
  const isNegativeComment = displaySentiment === "부정";

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteComment(comment.id);
      
            if (result.success) {
        // 삭제 성공 시 즉시 로컬 상태 업데이트
        console.log("댓글 삭제 성공:", result.message);
        setToast({ message: result.message, type: "success" });
        setLocalIsDeleted(true); // 로컬에서 삭제 상태로 변경
        // 부모 컴포넌트에 삭제 완료 알림 (새로고침 대신 상태 업데이트)
        if (onCommentDeleted) {
          onCommentDeleted();
        }
        // 성공 시에만 모달 닫기
        setIsDeleteModalOpen(false);
      } else {
        // 삭제 실패 시 에러 메시지 표시
        console.error("댓글 삭제 실패:", result.message);
        setToast({ message: `삭제 실패: ${result.message}`, type: "error" });
        // 실패 시에는 모달 유지 (사용자가 다시 시도할 수 있도록)
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류:", error);
      setToast({ message: "삭제 중 오류가 발생했습니다.", type: "error" });
      // 에러 시에도 모달 유지
    } finally {
      setIsDeleting(false);
    }
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

  const getStatusBgColor = (isDeleted) => {
    if (isDeleted) {
      return "#FEE2E2"; // 연한 빨간색
    }
    return "#E5E7EB"; // 연한 회색
    return "#F3F4F6"; // 기본 연한 회색
  };
  const getStatusTextColor = (isDeleted) => {
    if (isDeleted) {
      return "#991B1B";
    }
    return "#4B5563";
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
               ) : avatar ? (
                 avatar
               ) : (
                 <FaInstagram 
                   size={18} 
                   style={{ color: "#E4405F" }} 
                 />
               )}
             </div>
            <span className={styles.username}>{username}</span>
            <span
              className={styles.sentimentTag}
              style={{
                backgroundColor: getSentimentBgColor(displaySentiment),
                color: getSentimentTextColor(displaySentiment),
              }}
            >
              {displaySentiment}
            </span>
            <span
              className={styles.statusTag}
              style={{
                backgroundColor: getStatusBgColor(isDeleted),
                color: getStatusTextColor(isDeleted),
              }}
            >
              {isDeleted ? "삭제됨" : "승인됨"}
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
                 disabled={isDeleting}
                 style={{
                   padding: "8px 16px",
                   borderRadius: "6px",
                   border: "none",
                   backgroundColor: isDeleting ? "#9CA3AF" : "#DC2626",
                   color: "white",
                   fontSize: "14px",
                   fontWeight: "500",
                   cursor: isDeleting ? "not-allowed" : "pointer",
                   transition: "background-color 0.2s ease",
                 }}
                 onMouseEnter={(e) => {
                   if (!isDeleting) {
                     e.target.style.backgroundColor = "#B91C1C";
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (!isDeleting) {
                     e.target.style.backgroundColor = "#DC2626";
                   }
                 }}
               >
                 {isDeleting ? "삭제 중..." : "삭제"}
               </button>
            </div>
          </div>
                 </div>
       )}
       
       {/* Toast 메시지 */}
       {toast && (
         <Toast
           message={toast.message}
           type={toast.type}
           onClose={() => setToast(null)}
         />
       )}
     </div>
   );
 }
