"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/CampaignCard.module.css";
import { useCampaign } from "../context/CampaignContext";
import { getAdvertiserFile, getImageByAdNo, getApplicantsByAd, deleteApplicant } from '@/api/campaignApi';
import { deleteAdByAdvertiser } from '@/api/advertisementApi';
import EditApplicationModal from './EditApplicationModal';
import PostUrlModal from './PostUrlModal';
import CompletedUrlsModal from './CompletedUrlsModal';
import AlertModal from '@/app/advertiser/components/AlertModal';

export default function CampaignCard({ campaign, openModal }) {

  const { activeTab } = useCampaign();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostUrlModalOpen, setIsPostUrlModalOpen] = useState(false);
  const [isCompletedUrlsModalOpen, setIsCompletedUrlsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showRecruitingButton = activeTab === "recruiting" && 
    campaign.adStatus === "APPROVED" && new Date() >= new Date(campaign.announceStart);
  const showEndedButton = activeTab === "ended" && 
    ["ENDED", "CLOSED", "TRIAL"].includes(campaign.adStatus);

  const COLORS = {
    recruiting: "#FF8484",  
    ended: "#6B7280", 
    applied: "#8BC34A",
    default: "#000000"
  };

  // 신청자 status
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
      fontSize: "16px",
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
          const applicantsData = await getApplicantsByAd(campaign.adNo);
          setApplicants(applicantsData);
          const userStatus = determineUserStatus(applicantsData);
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
    console.log('Applicant statuses:', statuses); // 디버깅용
    
    // selected: 하나라도 selected인 경우
    if (statuses.some(status => status === 'SELECTED') && applicants.every(applicant => applicant.isSaved === true)) {
      return 'selected';
    }
    
    // rejected: 모든 펫이 rejected인 경우
    if (statuses.every(status => status === 'REJECTED')) {
      return 'rejected';
    }
    
    // completed: 모든 펫이 APPLIED인 경우 (게시물 URL이 승인된 상태)
    if (statuses.every(status => status === 'COMPLETED') && campaign.adStatus === 'ENDED') {
      return 'completed';
    }
    
    // pending: 그 외의 경우
    return 'pending';
  };

  // 신청 취소 모달 열기
  const handleCancelApplication = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!applicants || applicants.length === 0) {
      setAlertModal({
        isOpen: true,
        title: '알림',
        message: '취소할 신청이 없습니다.',
        type: 'warning'
      });
      return;
    }

    // 선택된 신청자 초기화
    setSelectedApplicants([]);
    setIsCancelModalOpen(true);
  };

  // 신청자 선택/해제
  const handleApplicantSelect = (applicantNo) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantNo)) {
        return prev.filter(id => id !== applicantNo);
      } else {
        return [...prev, applicantNo];
      }
    });
  };

  // 선택된 신청자 삭제 실행
  const handleConfirmCancel = async () => {
    if (selectedApplicants.length === 0) {
      setAlertModal({
        isOpen: true,
        title: '알림',
        message: '삭제할 신청을 선택해주세요.',
        type: 'warning'
      });
      return;
    }

    const confirmed = window.confirm(`선택한 ${selectedApplicants.length}개의 신청을 정말로 취소하시겠습니까?`);
    if (!confirmed) return;

    try {
      // 선택된 신청자에 대해서만 삭제 API 호출
      const deletePromises = selectedApplicants.map(applicantNo => 
        deleteApplicant(applicantNo)
      );
      
      await Promise.all(deletePromises);
      
      setAlertModal({
        isOpen: true,
        title: '신청 취소 완료',
        message: '선택한 신청이 성공적으로 취소되었습니다.',
        type: 'success'
      });
      
      // 모달 닫기 및 페이지 새로고침
      setIsCancelModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('신청 취소 실패:', error);
      setAlertModal({
        isOpen: true,
        title: '신청 취소 실패',
        message: '신청 취소에 실패했습니다. 다시 시도해주세요.',
        type: 'error'
      });
    }
  };

  // 광고 삭제 핸들러
  const handleDeleteAd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  // 광고 삭제 확인 실행
  const handleConfirmDelete = async () => {
    try {
      await deleteAdByAdvertiser(campaign.adNo, true);
      
      setAlertModal({
        isOpen: true,
        title: '삭제 완료',
        message: '광고가 성공적으로 삭제되었습니다.',
        type: 'success'
      });
      
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('광고 삭제 실패:', error);
      setAlertModal({
        isOpen: true,
        title: '삭제 실패',
        message: '광고 삭제에 실패했습니다. 다시 시도해주세요.',
        type: 'error'
      });
    }
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
              <button 
                style={getStatusStyle("applied")} 
                className={styles.actionBtn}
                onClick={handleCancelApplication}
              >
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
          ) : userStatus === "completed" ? (
            <div className={styles.actionButtons}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCompletedUrlsModalOpen(true);
                }}
                style={getStatusStyle(userStatus)}
                className={styles.statusButton}
              >
                {STATUSTEXT[userStatus]}
              </button>
              <button 
                style={{...getStatusStyle("rejected")}} 
                className={styles.actionBtn}
                onClick={handleDeleteAd}
              >
                삭제
              </button>
            </div>
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
      
      <CompletedUrlsModal
        isOpen={isCompletedUrlsModalOpen}
        onClose={() => setIsCompletedUrlsModalOpen(false)}
        adNo={campaign.adNo}
      />

      {/* 신청 취소 모달 */}
      {isCancelModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCancelModalOpen(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>신청 취소</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsCancelModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                체험단 신청을 취소할 반려 동물을 선택해주세요
              </p>
              
              <div className={styles.applicantList}>
                {applicants.map((applicant) => (
                  <div key={applicant.applicantNo} className={styles.applicantItem}>
                    <label className={styles.applicantLabel}>
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(applicant.applicantNo)}
                        onChange={() => handleApplicantSelect(applicant.applicantNo)}
                        className={styles.checkbox}
                      />
                      <span className={styles.petName}>
                        {applicant.pet?.name || `펫 ${applicant.applicantNo}`}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmCancel}
                disabled={selectedApplicants.length === 0}
              >
                체험단 신청 취소 ({selectedApplicants.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 광고 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>광고 삭제</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                정말로 해당 광고를 삭제하시겠습니까?
                <br />
                삭제된 광고는 복구할 수 없습니다
              </p>
            </div>
            
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmDelete}
                style={{ backgroundColor: "#DC2626" }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}