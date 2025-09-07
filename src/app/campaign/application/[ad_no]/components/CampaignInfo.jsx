"use client";

import Image from "next/image";
import styles from "../styles/CampaignInfo.module.css"

export default function CampaignInfo({ campaignData, adImage, advImage }) {

  const calculateDaysLeft = () => {    
    const koreaOffset = 9 * 60;
    const nowUtc = new Date();
    const nowKorea = new Date(nowUtc.getTime() + koreaOffset * 60 * 1000);
    
    const endDate = new Date(campaignData.announceEnd);

    const diffMs = endDate - nowKorea; 
    if (diffMs <= 0) {
      return '마감됨';
    }

    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 일
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 시간

    return `${diffDays}일 ${diffHours}시간 남음`;
  };

  return(
    <div className={styles.campaignSection}>
      <div className={styles.campaignCard}>
        <div className={styles.campaignImage}>
          <Image 
            src={adImage.filePath}
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
                src={advImage.filePath}
                alt={campaignData.advertiser.name}
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
              <span className={styles.detailValue}>{campaignData.campaignSelect}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>체험단 활동 기간</span>
              <span className={styles.detailValue}>{campaignData.campaignStart}~{campaignData.campaignEnd}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>상품 링크</span>
              <div className={styles.linkContent}>
                <a href={campaignData.adUrl} className={styles.storeLink}>
                  <Image 
                    src="/campaign/link.png"
                    alt="link.png"
                    width={16}
                    height={16}/>
                  Visit {campaignData.advertiser.name} Store
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
              <li key={requirement.reqNo || index} className={styles.requirementItem}>
                <div className={styles.requirementIcon}>
                  <Image
                    src="/campaign/info.png"
                    alt="info.png"
                    width={16}
                    height={16} />
                </div>
                <span className={styles.requirementText}>{requirement.content}</span>
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
    </div>
  );
}