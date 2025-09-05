"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/CampaignCard.module.css";
import { useCampaign } from "../context/CampaignContext";
import { getAdvertiserFile, getImageByAdNo, getApplicantsByAd } from '@/api/campaignApi';
import EditApplicationModal from './EditApplicationModal';
import PostUrlModal from './PostUrlModal';

export default function CampaignCard({ campaign, openModal }) {

  const { activeTab } = useCampaign();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostUrlModalOpen, setIsPostUrlModalOpen] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const showRecruitingButton = activeTab === "recruiting" && campaign.adStatus === "APPROVED";
  const showEndedButton = activeTab === "ended" && 
    ["ENDED", "CLOSED", "TRIAL"].includes(campaign.adStatus);

  const COLORS = {
    recruiting: "#FF8484",  
    ended: "#6B7280", 
    applied: "#8BC34A",
    default: "#000000"
  };

  const STATUSTEXT = {
    approved: "모집중",
    pending: "선정 절차중",
    selected: "게시물 URL 등록",
    rejected: "선발 완료(X)",
    completed: "광고 완료",
    ended: "모집 종료"
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
      case "rejected":
        return { ...baseStyle, backgroundColor: "#9CA3AF", color: "#FFFFFF" };
      case "completed":
        return { ...baseStyle, backgroundColor: "#9CA3AF", color: "#FFFFFF" };
      case "ended":
        return { ...baseStyle, backgroundColor: "#6B7280", color: "#FFFFFF" };
      default:
        return { ...baseStyle, backgroundColor: "#8BC34A", color: "#FFFFFF" };
    }
  };

  const [advImage, setAdvImage] = useState(null);
  const [adImage, setAdImage] = useState(null);


  useEffect(() => {
    const fetchData = async () => {

      const advImageData = await getAdvertiserFile(campaign.advertiser.advertiserNo);
      setAdvImage(advImageData[0]);

      const adImageData = await getImageByAdNo(campaign.adNo);
      setAdImage(adImageData);

    };

    fetchData();
  }, [campaign.adNo]);

  // 사용자 상태 확인
  useEffect(() => {
    const fetchUserStatus = async () => {
      if (activeTab === "applied" && campaign.adNo) {
        try {
          const applicants = await getApplicantsByAd(campaign.adNo);
          const userStatus = determineUserStatus(applicants);
          setUserStatus(userStatus);
        } catch (error) {
          console.error('사용자 상태 조회 실패:', error);
        }
      }
    };

    fetchUserStatus();
  }, [activeTab, campaign.adNo]);

  // 사용자 상태 결정 함수
  const determineUserStatus = (applicants) => {
    if (!applicants || applicants.length === 0) return null;

    const statuses = applicants.map(applicant => applicant.status);
    
    // selected: 하나라도 selected인 경우
    if (statuses.some(status => status === 'SELECTED')) {
      return 'selected';
    }
    
    // rejected: 모든 펫이 rejected인 경우
    if (statuses.every(status => status === 'REJECTED')) {
      return 'rejected';
    }
    
    // completed: 모든 펫이 completed인 경우
    if (statuses.every(status => status === 'COMPLETED')) {
      return 'completed';
    }
    
    // pending: 그 외의 경우
    return 'pending';
  };
  
  const cardContent = (
    <div
      className={styles.campaignCard}
      style={{ borderTopColor: COLORS[activeTab] || COLORS.default }}>
      <div className={styles.imageContainer}>
        {adImage && (<Image  
          src={adImage.filePath}
          alt={campaign.title}
          width={410}
          height={160}
          className={styles.campaignImage}
        />)}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.title}>{campaign.title}</h3>
        <p className={styles.description}>{campaign.objective}</p>
        <div className={styles.brandSection}>
          <div className={styles.brandInfo}>
            <div className={styles.brandIcon}>
              {advImage && (<Image  
                src={advImage.filePath}
                alt={campaign.advertiser.name}
                width={32}
                height={32}
                className={styles.brandImage}
              />)}
            </div>
            <span className={styles.brandName}>{campaign?.advertiser?.name}</span>
          </div>
          {showRecruitingButton ? (
            <span
              style={getStatusStyle("approved")}
              className={styles.statusSpan}
            >
              {STATUSTEXT["approved"]}
            </span>
          ) : showEndedButton ? (
            <span
              style={getStatusStyle("ended")}
              className={styles.statusSpan}
            >
              {STATUSTEXT["ended"]}
            </span>
          ) : campaign.adStatus === "APPROVED" && activeTab === "applied" ? (
            <div className={styles.actionButtons}>
              <button style={getStatusStyle("applied")} className={styles.actionBtn}
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}>
                수정
              </button>
              <button style={getStatusStyle("applied")} className={styles.actionBtn}>
                취소
              </button>
            </div>
          ) : userStatus === "selected" ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPostUrlModalOpen(true);
              }}
              style={getStatusStyle("selected")}
              className={styles.statusButton}
            >
              {STATUSTEXT["selected"]}
            </button>
          ) : userStatus ? (
            <span 
              style={getStatusStyle(userStatus)}
              className={styles.statusSpan}>
              {STATUSTEXT[userStatus]}
            </span>
          ) : null}
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.periodInfo}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.calendarIcon}>
              <path
                d="M10 2H9V1C9 0.45 8.55 0 8 0C7.45 0 7 0.45 7 1V2H5V1C5 0.45 4.55 0 4 0C3.45 0 3 0.45 3 1V2H2C0.9 2 0 2.9 0 4V10C0 11.1 0.9 12 2 12H10C11.1 12 12 11.1 12 10V4C12 2.9 11.1 2 10 2ZM10 10H2V5H10V10Z"
                fill="#6B7280"
              />
            </svg>
            <span className={styles.period}>{campaign.announceStart}~{campaign.announceEnd}</span>
          </div>
          <span className={styles.applicants}>신청자 수 : {campaign.applicants}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Link href={`/campaign/info/${campaign.adNo}`} className={styles.campaignCardLink}>
        {cardContent}
      </Link>
      
      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        adNo={campaign.adNo}
      />
      
      <PostUrlModal
        isOpen={isPostUrlModalOpen}
        onClose={() => setIsPostUrlModalOpen(false)}
        adNo={campaign.adNo}
      />
    </>
  );
}