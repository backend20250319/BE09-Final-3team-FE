"use client";

import { useRouter } from "next/navigation";
import Image from 'next/image';
import styles from "../styles/CampaignSideBar.module.css"

export default function CampaignSidebar({ campaignData }) {

  const router = useRouter();

  const handleClick = () => {
    router.push(`/campaign/application/${campaignData.ad_no}`);
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

  return (
    <div className={styles.campaignSidebar}>
      {/* 게시물 세부 정보 */}
      <div className={`${styles.sidebarSection} ${styles.detailsSection}`}>
        <h3 className={styles.sectionTitle}>게시물 세부 정보</h3>
        <div className={styles.detailsContent}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>신청자 수</span>
            <span className={styles.detailValue}>{campaignData.applicants}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>모집 종료일</span>
            <span className={styles.detailValue}>{calculateDaysLeft()}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>체험단 선정일</span>
            <span className={styles.detailValue}>{campaignData.campaign_select}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>체험단 활동 기간</span>
            <span className={styles.detailValue}>{campaignData.campaign_start}~{campaignData.campaign_end}</span>
          </div>
        </div>
      </div>

      {/* 상품 링크 */}
      <div className={`${styles.sidebarSection} ${styles.linkSection}`}>
        <h3 className={styles.sectionTitle}>상품 링크</h3>
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

      {/* 기업 정보 */}
      <div className={`${styles.sidebarSection} ${styles.companySection}`}>
        <h3 className={styles.sectionTitle}>기업 정보</h3>
        <div className={styles.companyContent}>
          <div className={styles.companyProfile}>
            <div className={styles.companyLogo}>
              <Image
                src={campaignData.brand_url}
                alt={campaignData.brand}
                width={48}
                height={48}
                className={styles.logoImage}
              />
            </div>
            <div className={styles.companyDetails}>
              <h4 className={styles.companyName}>{campaignData.brand}</h4>
            </div>
          </div>
          <p className={styles.companyIntro}>
            {campaignData.description}
          </p>
        </div>
      </div>

      {/* 신청 버튼 */}
      <div className={`${styles.sidebarSection} ${styles.applySection}`}>
        <button className={styles.applyButton} onClick={handleClick}>
            <Image 
              src="/campaign/airplane.png"
              alt="airplane.png"
              width={16}
              height={16}/>
          <span>체험단 신청하기</span>
        </button>
      </div>
    </div>
  );
} 