import Image from "next/image";
import styles from "../styles/CampaignCard.module.css";
import { useCampaign } from "../context/CampaignContext";

export default function CampaignCard({ campaign }) {

  const { activeTab } = useCampaign();

  const COLORS = {
    recruiting: "#FF8484",  
    ended: "#6B7280", 
    applied: "#8BC34A",
    default: "#000000"
  };

  const STATUSTEXT = {
    approved: "모집중",
    pending: "확인 절차중",
    selected: "게시물 URL 등록",
    rejected: "선발 완료(X)",
    completed: "광고 완료",
    ended: "모집 종료"
  };

  const showRecruitingButton = activeTab === "recruiting" && campaign.ad_status === "approved";
  const showEndedButton = activeTab === "ended" && campaign.ad_status === "ended";

  const getStatusButtonStyle = (status) => {
    const baseStyle = { 
      padding: "4px 16px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "1.19",
      textAlign: "center",
      border: "none",
      cursor: "pointer",
    };

    switch (status) {
      case "approved":
        return { ...baseStyle, backgroundColor: "#FF8484", color: "#FFFFFF" };
      case "ended":
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
      case "rejected":
        return { ...baseStyle, backgroundColor: "#9CA3AF", color: "#FFFFFF" };
      case "completed":
        return { ...baseStyle, backgroundColor: "#9CA3AF", color: "#FFFFFF" };
      default:
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
    }
  };

  return (
    <div
      className={styles.campaignCard}
      style={{ borderTopColor: COLORS[activeTab] || COLORS.default }}
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
        <h3 className={styles.title}>{campaign.title}</h3>
        <p className={styles.description}>{campaign.objective}</p>
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
          {showRecruitingButton ? (
            <button
              style={getStatusButtonStyle("approved")}
              className={styles.statusButton}
            >
              {STATUSTEXT["approved"]}
            </button>
          ) : showEndedButton ? (
            <button
              style={getStatusButtonStyle("ended")}
              className={styles.statusButton}
            >
              {STATUSTEXT["ended"]}
            </button>
          ) : campaign.applicant_status === "applied" ? (
            <div className={styles.actionButtons}>
              <button style={getStatusButtonStyle("applied")} className={styles.actionBtn}>
                수정
              </button>
              <button style={getStatusButtonStyle("applied")} className={styles.actionBtn}>
                삭제
              </button>
            </div>
          ) : (
            <button
              style={getStatusButtonStyle(campaign.applicant_status)}
              className={styles.statusButton}
            >
              {STATUSTEXT[campaign.applicant_status]}
            </button>
          )} 
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.periodInfo}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.calendarIcon}>
              <path
                d="M10 2H9V1C9 0.45 8.55 0 8 0C7.45 0 7 0.45 7 1V2H5V1C5 0.45 4.55 0 4 0C3.45 0 3 0.45 3 1V2H2C0.9 2 0 2.9 0 4V10C0 11.1 0.9 12 2 12H10C11.1 12 12 11.1 12 10V4C12 2.9 11.1 2 10 2ZM10 10H2V5H10V10Z"
                fill="#6B7280"
              />
            </svg>
            <span className={styles.period}>{campaign.announce_start}~{campaign.announce_end}</span>
          </div>
          <span className={styles.applicants}>신청자 수 : {campaign.applicants}</span>
        </div>
      </div>
    </div>
  );
}