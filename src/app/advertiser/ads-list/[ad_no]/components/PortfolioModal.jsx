"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "../styles/PortfolioModal.module.css";
import ActivityHistory from '@/app/campaign/application/[ad_no]/components/ActivityHistory';
import CampaignActivityDetailModal from '@/app/campaign/application/[ad_no]/components/CampaignActivityDetailModal';
import { getPortfolio, getUser, getHistory, getInstagramProfile } from '@/api/advertisementApi';

export default function PortfolioModal({ isOpen, onClose, petData }) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState(null);
  const [activityCards, setActivityCards] = useState([]);
  const [instagramProfile, setInstagramProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // petData가 변경될 때마다 포트폴리오 정보 조회
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (petData?.pet?.petNo) {
        try {
          setIsLoading(true);
          const portfolioData = await getPortfolio(petData.pet.petNo);
          setPortfolio(portfolioData);
          const user = await getUser(petData.pet.userNo);
          setUserData(user);
          
          // 인스타그램 프로필 조회
          try {
            const instagramData = await getInstagramProfile(petData.pet.userNo);
            setInstagramProfile(instagramData[0]);
          } catch (error) {
            console.error('인스타그램 프로필 조회 실패:', error);
            setInstagramProfile(null);
          }
          
          const historyData = await getHistory(petData.pet.petNo);
          setHistory(historyData);
          
          // 활동이력 데이터를 activityCards 형식으로 변환
          const combinedActivities = historyData.map(historyItem => {
            return {
              id: historyItem.historyNo,
              title: historyItem.title || '활동 기록',
              content: historyItem.content || '활동 내용',
              historyStart: historyItem.historyStart ? new Date(historyItem.historyStart).toLocaleDateString() : '날짜 없음',
              historyEnd: historyItem.historyEnd ? new Date(historyItem.historyEnd).toLocaleDateString() : '날짜 없음',
              imageUrls: historyItem.imageUrls || [],
              category: historyItem.category || '일반',
              ...historyItem
            };
          });
          
          setActivityCards(combinedActivities);
        } catch (error) {
          console.error('포트폴리오 조회 실패:', error);
          setPortfolio(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isOpen && petData) {
      fetchPortfolio();
    }
  }, [isOpen, petData]);

  // Instagram URL을 핸들 형식으로 변환하는 함수
  const formatInstagramHandle = (snsUrl) => {
    if (!snsUrl) return '';
    
    // www.instagram.com/broccoli 형식을 @broccoli로 변환
    const match = snsUrl.match(/instagram\.com\/([^\/\?]+)/);
    if (match) {
      return `@${match[1]}`;
    }
    
    // 그 외의 경우 원본 반환
    return snsUrl;
  };

  const handleCardClick = (card) => {
    setSelectedActivity(card);
    setIsDetailModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>포트폴리오</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {/* Pet Profile Card */}
          <div className={styles.petProfileCard}>
            <div className={styles.petHeader}>
              <div className={styles.petImageContainer}>
                {petData?.pet?.imageUrl ? (
                  <Image 
                    src={petData.pet.imageUrl} 
                    alt={petData.pet.name} 
                    width={128} 
                    height={128}
                    className={styles.petProfileImage}
                  />
                ) : (
                  <div className={styles.petAvatarPlaceholder}>
                    <span>?</span>
                  </div>
                )}
              </div>
              <div className={styles.petInfo}>
                <div className={styles.petDetail}>
                  <h3 className={styles.petName}>{petData?.pet?.name}</h3>
                  <div className={styles.instagramSection}>
                    <Image
                      src="/campaign/instagram.png"
                      alt="instagram.png"
                      width={16} 
                      height={16} />
                    <span className={styles.instagramHandle}>{formatInstagramHandle(petData?.pet?.snsUrl) || 'SNS 정보 없음'}</span>
                  </div>
                </div>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>품종:</span>
                    <span className={styles.detailValue}>{petData?.pet?.type || '정보 없음'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>나이:</span>
                    <span className={styles.detailValue}>{petData?.pet?.age || '정보 없음'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>무게:</span>
                    <span className={styles.detailValue}>{petData?.pet?.weight ? `${petData.pet.weight}kg` : '정보 없음'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>성별:</span>
                    <span className={styles.detailValue}>{petData?.pet?.gender || '정보 없음'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className={styles.activityContent}>
              <h4 className={styles.activityTitle}>활동 이력</h4>
              {isLoading ? (
                <div className={styles.loadingHistoryMessage}>
                  <p>활동이력 조회중</p>
                </div>
              ) : activityCards.length > 0 ? (
                <ActivityHistory activityCards={activityCards} onCardClick={handleCardClick} />
              ) : (
                <div className={styles.noActivityMessage}>
                  <p>조회된 활동 이력이 없습니다.</p>
                </div>
              )}
            </div>

            <div className={styles.petDescription}>
              <h4 className={styles.descriptionTitle}>간단한 소개</h4>
              <p className={styles.descriptionText}>
                {portfolio?.content || petData?.description || "작성된 소개가 없습니다."}
              </p>
            </div>

            <div className={styles.petPersonality}>
              <h4 className={styles.personalityTitle}>성격</h4>
              <p className={styles.personalityText}>
                {portfolio?.personality || "작성된 성격이 없습니다."}
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#F5A623' }}>
                  {instagramProfile?.followers_count ? Number(instagramProfile.followers_count).toLocaleString() : '미연결'}
                </div>
                <div className={styles.statLabel}>팔로워 수</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#FF7675' }}>
                  {portfolio?.cost ? Number(portfolio.cost).toLocaleString() + '원' : '정보 없음'}
                </div>
                <div className={styles.statLabel}>단가</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#8BC34A' }}>
                  {history?.applicants?.filter(applicant => applicant.status === 'completed')?.length || 0}
                </div>
                <div className={styles.statLabel}>체험단 참여 횟수</div>
              </div>
            </div>

            <div className={styles.addSection}>
              <h4 className={styles.addSectionTitle}>추가 내용</h4>
              <p className={styles.addSectionText}>
                {petData?.content || "작성된 추가 내용이 없습니다."}
              </p>
            </div>

            <div className={styles.ownerInfo}>
              <h4 className={styles.ownerTitle}>반려인 정보</h4>
              <div className={styles.ownerProfile}>
                {userData?.profileImageUrl ? (
                  <Image 
                    src={userData.profileImageUrl} 
                    alt="Owner" 
                    width={48} 
                    height={48} 
                    className={styles.ownerImage} 
                  />
                ) : (
                  <div className={styles.petAvatarPlaceholder}>
                    <span>?</span>
                  </div>
                )}
                <div className={styles.ownerDetails}>
                  <h5 className={styles.ownerName}>{userData?.name || '이름 정보 없음'}</h5>
                  <p className={styles.ownerIntro}>
                    {userData?.selfIntroduction || "반려인 소개 정보가 없습니다."}
                  </p>
                </div>
              </div>
              <div className={styles.ownerContact}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>이메일:</span>
                  <span className={styles.contactValue}>{userData?.email || '정보 없음'}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>전화번호:</span>
                  <span className={styles.contactValue}>{userData?.phone || '정보 없음'}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>주소:</span>
                  <span className={styles.contactValue}>
                    {userData?.roadAddress ? `${userData.roadAddress}, ${userData.detailAddress || ''}` : '정보 없음'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CampaignActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activityData={selectedActivity}
      />
    </div>
  );
}
