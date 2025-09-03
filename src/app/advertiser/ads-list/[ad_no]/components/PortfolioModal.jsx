"use client";

import React, { useState } from 'react';
import Image from "next/image";
import styles from "../styles/PortfolioModal.module.css";
import ActivityHistory from '@/app/campaign/application/[ad_no]/components/ActivityHistory';
import ActivityDetailModal from '@/app/user/portfolio/ActivityDetailModal';

export default function PortfolioModal({ isOpen, onClose, petData }) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

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
                <Image 
                  src={petData.image} 
                  alt={petData.name} 
                  width={128} 
                  height={128}
                  className={styles.petProfileImage}
                />
              </div>
              <div className={styles.petInfo}>
                <div className={styles.petDetail}>
                  <h3 className={styles.petName}>{petData.name}</h3>
                  <div className={styles.instagramSection}>
                    <Image
                      src="/campaign/instagram.png"
                      alt="instagram.png"
                      width={16}
                      height={16} />
                    <span className={styles.instagramHandle}>{petData.instagram}</span>
                  </div>
                </div>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>품종:</span>
                    <span className={styles.detailValue}>{petData.breed}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>나이:</span>
                    <span className={styles.detailValue}>{petData.age}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>무게:</span>
                    <span className={styles.detailValue}>{petData.weight}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>성별:</span>
                    <span className={styles.detailValue}>{petData.gender}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className={styles.activityContent}>
              <h4 className={styles.activityTitle}>활동 이력</h4>
              <ActivityHistory activityCards={activities} onCardClick={handleCardClick} />
              <ActivityDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                activityData={selectedActivity}/>
            </div>

            <div className={styles.petDescription}>
              <h4 className={styles.descriptionTitle}>간단한 소개</h4>
              <p className={styles.descriptionText}>{petData.introduction}</p>
            </div>

            <div className={styles.petPersonality}>
              <h4 className={styles.personalityTitle}>성격</h4>
              <p className={styles.personalityText}>{petData.personality}</p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#F5A623' }}>{petData.followers}</div>
                <div className={styles.statLabel}>팔로워 수</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#FF7675' }}>{petData.price}</div>
                <div className={styles.statLabel}>단가</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: '#8BC34A' }}>{petData.partcipation}</div>
                <div className={styles.statLabel}>체험단 참여 횟수</div>
              </div>
            </div>

            <div className={styles.addSection}>
              <h4 className={styles.addSectionTitle}>추가 내용</h4>
              <p className={styles.addSectionText}>{petData.addSection}</p>
            </div>

            <div className={styles.ownerInfo}>
              <h4 className={styles.ownerTitle}>반려인 정보</h4>
              <div className={styles.ownerProfile}>
                <Image src="/campaign/profile.png" alt="Owner" width={48} height={48} className={styles.ownerImage} />
                <div className={styles.ownerDetails}>
                  <h5 className={styles.ownerName}>정승원</h5>
                  <p className={styles.ownerIntro}>
                    안녕하세요!
                    골든 리트리버 '황금이', 샴 고양이 '루나', 푸른 마코 앵무 '찰리'와 함께하는 인플루언서 정승원입니다.
                    저는 반려동물과 함께하는 일상 속에서 다양한 상품과 서비스를 체험하고, 그 경험을 진솔하고 생생하게 전달하는 것을 주 컨텐츠로 삼고 있습니다.
                    특히 펫 전용 제품 리뷰, 체험단 활동, 반려동물과의 라이프스타일 콘텐츠를 통해 많은 분들이 반려동물과의 삶을 더 풍성하게 즐길 수 있도록 돕고 있습니다.
                  </p>
                </div>
              </div>
              <div className={styles.ownerContact}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>이메일:</span>
                  <span className={styles.contactValue}>petlover123@email.com</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>전화번호:</span>
                  <span className={styles.contactValue}>010-1234-5678</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>주소:</span>
                  <span className={styles.contactValue}>서울특별시 강남구</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
