"use client"

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/CampaignCard.module.css";
import { useCampaign } from "../context/CampaignContext";
import RejectionModal from "./RejectionModal";

export default function CampaignCard({ campaign }) {

  const { activeTab } = useCampaign();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showRejectedButton = campaign.ad_status === "rejected";

  const COLORS = {
    approved: "#FF8484",  
    pending: "#8BC34A",
    rejected: "#9CA3AF",
    ended: "#6B7280", 
    default: "#000000"
  };

  const STATUSTEXT = {
    approved: "삭제",
    pending: "취소",
    ended: "삭제"
  };

  const getStatusStyle = (status) => {
    const baseStyle = { 
      padding: "4px 16px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "1.19",
      textAlign: "center",
      border: "none"
    };

    switch (status) {
      case "approved":
        return { ...baseStyle, backgroundColor: "#FF8484", color: "#FFFFFF" };
      case "pending":
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
      case "rejected":
        return { ...baseStyle, backgroundColor: "#9CA3AF", color: "#FFFFFF" };
      case "ended":
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
      default:
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
    }
  };

  const handleRejectionClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const cardContent = (
    <div
      className={styles.campaignCard}
      style={{ borderTopColor: COLORS[activeTab] || COLORS.default }}>
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
            <Image  
              src={campaign.brand_url}
              alt={campaign.brand}
              width={25}
              height={25}
              className={styles.brandIcon}
            />
            <span className={styles.brandName}>{campaign.brand}</span>
          </div>
          {showRejectedButton ? (
            <div className={styles.actionButtons}>
              <button 
                style={getStatusStyle("rejected")} 
                className={styles.actionBtn}
                onClick={handleRejectionClick}
              >
                반려 사유
              </button>
              <button style={getStatusStyle("rejected")} className={styles.actionBtn}>
                삭제
              </button>
            </div>
          ) : (
            <button
              style={getStatusStyle(campaign.ad_status)}
              className={styles.statusButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {STATUSTEXT[campaign.ad_status]}
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

  const rejectionData = {
    reason: "광고 필수 요소(체험단 선정일) 누락됨",
    campaignTitle: campaign.title
  };

  if (campaign.ad_no === 1) {
    return (
      <>
        <Link href={`/advertiser/ads-list/${campaign.ad_no}`} className={styles.campaignCardLink}>
          {cardContent}
        </Link>
      </>
    );
  }

  return (
    <>
      <div className={styles.campaignCardLink}>{cardContent}</div>
      <RejectionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rejectionData={rejectionData}
      />
    </>
  );
}