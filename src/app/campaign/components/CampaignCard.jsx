import Image from "next/image";
import styles from "../styles/CampaignCard.module.css";

export default function CampaignCard({ campaign }) {
  const getStatusButtonStyle = (status) => {
    const baseStyle = {
      padding: "4px 6px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "1.19",
      textAlign: "center",
      border: "none",
      cursor: "pointer",
    };

    switch (status) {
      case "recruiting":
        return { ...baseStyle, backgroundColor: "#FF8484", color: "#FFFFFF" };
      case "verification":
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
      case "url_submit":
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
      case "completed":
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
      case "ended":
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
      case "selection_failed":
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
      case "actions":
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
      default:
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
    }
  };

  return (
    <div
      className={styles.campaignCard}
      style={{ borderTopColor: campaign.borderColor }}
    >
      <div className={styles.imageContainer}>
        <Image
          src={campaign.image}
          alt={campaign.title}
          width={410}
          height={160}
          className={styles.campaignImage}
        />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.topInfo}>
            <span className={styles.applicants}>신청자 수 : {campaign.applicants}</span>
          </div>
          <div className={styles.periodInfo}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.calendarIcon}>
              <path
                d="M10 2H9V1C9 0.45 8.55 0 8 0C7.45 0 7 0.45 7 1V2H5V1C5 0.45 4.55 0 4 0C3.45 0 3 0.45 3 1V2H2C0.9 2 0 2.9 0 4V10C0 11.1 0.9 12 2 12H10C11.1 12 12 11.1 12 10V4C12 2.9 11.1 2 10 2ZM10 10H2V5H10V10Z"
                fill="#6B7280"
              />
            </svg>
            <span className={styles.period}>{campaign.period}</span>
          </div>
        </div>

        <div className={styles.brandSection}>
          <div className={styles.brandInfo}>
            <div className={styles.brandIcon}>
              <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
                <path
                  d="M5 8.5C7.76142 8.5 10 6.26142 10 3.5C10 0.738579 7.76142 -1.5 5 -1.5C2.23858 -1.5 0 0.738579 0 3.5C0 6.26142 2.23858 8.5 5 8.5Z"
                  fill="#8BC34A"
                />
                <path
                  d="M3.75 3.875L4.375 4.5L6.25 2.625"
                  stroke="white"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={styles.brandName}>{campaign.brand}</span>
          </div>
          <div className={styles.heartIcon}>
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
              <path
                d="M6 10.5C9 8.83333 11.5 6.9 11.5 4.25C11.5 1.95 9.8 0.5 8.25 0.5C7.15 0.5 6.25 1.25 6 1.75C5.75 1.25 4.85 0.5 3.75 0.5C2.2 0.5 0.5 1.95 0.5 4.25C0.5 6.9 3 8.83333 6 10.5Z"
                fill="#6B7280"
              />
            </svg>
          </div>
        </div>

        <h3 className={styles.title}>{campaign.title}</h3>
        <p className={styles.description}>{campaign.description}</p>

        <div className={styles.statusSection}>
          {campaign.status === "actions" ? (
            <div className={styles.actionButtons}>
              <button style={getStatusButtonStyle("actions")} className={styles.actionBtn}>
                수정
              </button>
              <button style={getStatusButtonStyle("actions")} className={styles.actionBtn}>
                삭제
              </button>
            </div>
          ) : (
            <button style={getStatusButtonStyle(campaign.status)} className={styles.statusButton}>
              {campaign.statusText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}