"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../styles/CampaignInfo.module.css"

export default function CampaignInfo({ campaignData }) {

  const router = useRouter();

  const handleClick = () => {
    alert('신청서가 정상적으로 제출되었습니다.');
    router.push('/campaign');
  };

  const calculateDaysLeft = () => {
    const endDate = new Date(campaignData.announce_end);
    const now = new Date();

    const diffMs = endDate - now; // 남은 밀리초
    if (diffMs <= 0) {
      return '마감됨';
    }

    // 남은 시간 계산
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 일
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 시간

    return `${diffDays}일 ${diffHours}시간 남음`;
  };

  return(
    <div className={styles.campaignSection}>
      <div className={styles.campaignCard}>
        <div className={styles.campaignImage}>
          <Image 
            src={campaignData.image}
            alt="Campaign"
            width={346} 
            height={194}
            className={styles.image}
          />
        </div>
        
        <div className={styles.campaignInfo}>
          <div className={styles.brandSection}>
            <div className={styles.brandBadge}>
              <Image 
                src={campaignData.brand_url}
                alt={campaignData.brand}
                width={32}
                height={32}
                className={styles.brandLogo}
              />
            </div>
            <span className={styles.brandName}>{campaignData.brand}</span>
          </div>
          
          <h2 className={styles.campaignTitle}>{campaignData.title}</h2>
          <p className={styles.campaignDescription}>
            {campaignData.objective}
          </p>
          
          <div className={styles.campaignDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>신청자 수</span>
              <span className={styles.detailValue}>{campaignData.applicants}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>체험단 선정일</span>
              <span className={styles.detailValue}>{campaignData.campaign_select}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>체험단 활동 기간</span>
              <span className={styles.detailValue}>{campaignData.campaign_start}~{campaignData.campaign_end}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>상품 링크</span>
              <div className={styles.linkContent}>
                <a href="#" className={styles.storeLink}>
                  <Image 
                    src="/campaign/link.png"
                    alt="link.png"
                    width={16}
                    height={16}/>
                  Visit {campaignData.brand} Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.requirementsSection}>
        <h3 className={styles.requirementsTitle}>필수 요건</h3>
          <ul className={styles.requirementsList}>
            {campaignData.requirement.map((requirement, index) => (
              <li key={index} className={styles.requirementItem}>
                <div className={styles.requirementIcon}>
                  <Image
                    src="/campaign/info.png"
                    alt="info.png"
                    width={16}
                    height={16} />
                </div>
                <span className={styles.requirementText}>{requirement}</span>
              </li>
            ))}
          </ul>
      </div>

      <div className={styles.deadlineSection}>
        <div className={styles.deadlineContent}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="#EF4444"/>
            <path d="M8 4V8L11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.deadlineText}>{calculateDaysLeft()}</span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.submitButton} onClick={handleClick}>신청서 제출하기</button>
        <button className={styles.saveButton}>임시 저장</button>
      </div>
    </div>
  );
}