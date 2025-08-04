import styles from "../styles/CommentCard.module.css";

export default function CommentCard({
  username,
  avatar,
  sentiment,
  sentimentColor,
  status,
  statusColor,
  text,
  timeAgo,
  bgColor,
  isDeleted = false,
}) {
  const handleDelete = () => {
    if (window.confirm(`${username}의 댓글을 삭제하시겠습니까?`)) {
      // 실제 구현에서는 API 호출 등의 삭제 로직이 들어갑니다
      alert("댓글이 삭제되었습니다.");
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

  const getStatusTextColor = (status) => {
    switch (status) {
      case "Active":
        return "#4B5563";
      case "Auto-deleted":
        return "#991B1B";
      default:
        return "#4B5563";
    }
  };

  return (
    <div
      className={`${styles.commentCard} ${isDeleted ? styles.deleted : ""}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{avatar}</div>
            <span className={styles.username}>{username}</span>
            <span
              className={styles.sentimentTag}
              style={{
                backgroundColor: sentimentColor,
                color: getSentimentTextColor(sentiment),
              }}
            >
              {sentiment}
            </span>
            <span
              className={styles.statusTag}
              style={{
                backgroundColor: statusColor,
                color: getStatusTextColor(status),
              }}
            >
              {status}
            </span>
          </div>
        </div>

        <div className={styles.commentText}>{text}</div>

        <div className={styles.commentFooter}>
          <span className={styles.timeAgo} style={{ color: isDeleted ? "#DC2626" : "#6B7280" }}>
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
    </div>
  );
}
