"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "../styles/PetProfile.module.css"
import AdditinalSection from './AdditionalSection';
import ActivityHistory from './ActivityHistory';
import ActivityDetailModal from '@/app/user/portfolio/ActivityDetailModal';
import activities from '../data/ActivityData';
import { getApplicantsByPetNo, getPets, getPortfolio, getUser } from '@/api/campaignApi';

export default function PetProfile() {

  const [selectedPet, setSelectedPet] = useState(null);
  const [activityCards, setActivityCards] = useState(activities);
  const [petData, setPetData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        setIsLoading(true);
        const data = await getPets();
        setPetData(data || []);
        if (data && data.length > 0) {
          setSelectedPet(0);
        }
        const user = await getUser();
        setUserData(user);
      } catch (error) {
        setPetData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPets();
  }, []);

  // 선택된 펫이 변경될 때마다 포트폴리오 조회
  useEffect(() => {
    async function fetchPortfolio() {
      if (selectedPet !== null && petData[selectedPet]?.petNo) {
        try{
          const portfolioData = await getPortfolio(petData[selectedPet].petNo);
          setPortfolio(portfolioData || []);

          const historyData = await getApplicantsByPetNo(petData[selectedPet].petNo);
          setHistory(historyData);
        } catch (error) {
          if (error.response && error.response.status === 404) {
          setPortfolio([]);
          } else {
            setPortfolio([]);
          }
        }
      }
    }
    fetchPortfolio();
  }, [selectedPet, petData]);

  const selectedPetInfo = petData[selectedPet] || petData[0];

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleCardClick = (card) => {
    setSelectedActivity(card);
    setIsDetailModalOpen(true);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.profileSection}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>펫 정보를 불러오는 중</p>
        </div>
      </div>
    );
  }

  console.log(portfolio);
  return(
    <div className={styles.profileSection}>
      {/* Pet Selector */}
      <div className={styles.petSelector}>
          {petData.map((pet, index) => (
          <button
             key={index}
             className={`${styles.petTab} ${selectedPet === index ? styles.active : ''}`}
             onClick={() => setSelectedPet(index)}
          >
             {pet.imageUrl ? (
               <Image src={pet.imageUrl} alt={pet.name} width={24} height={24} className={styles.petImage} />
             ) : (
               <div className={styles.petAvatarPlaceholder} style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                 <span>?</span>
               </div>
             )}
             <span>{pet.name}</span>
           </button>
         ))}
      </div>
      {/* Pet Profile Card */}
      <div className={styles.petProfileCard}>
        <div className={styles.petHeader}>
          <div className={styles.petImageContainer}>
            {selectedPetInfo?.imageUrl ? (
              <Image 
                src={selectedPetInfo.imageUrl} 
                alt={selectedPetInfo?.name} 
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
              <h3 className={styles.petName}>{selectedPetInfo.name}</h3>
              <div className={styles.instagramSection}>
                <Image
                  src="/campaign/instagram.png"
                  alt="instagram.png"
                  width={16}
                  height={16} />
                <span className={styles.instagramHandle}>{selectedPetInfo.instagram}</span>
              </div>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>품종:</span>
                <span className={styles.detailValue}>{selectedPetInfo?.type}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>나이:</span>
                <span className={styles.detailValue}>{selectedPetInfo.age}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>무게:</span>
                <span className={styles.detailValue}>{selectedPetInfo.weight}kg</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>성별:</span>
                <span className={styles.detailValue}>{selectedPetInfo.gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className={styles.activityContent}>
          <h4 className={styles.activityTitle}>활동 이력</h4>
          <ActivityHistory activityCards={activityCards} onCardClick={handleCardClick} />
          <ActivityDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            activityData={selectedActivity}/>
        </div>

        <div className={styles.petDescription}>
          <h4 className={styles.descriptionTitle}>간단한 소개</h4>
          <p className={styles.descriptionText}>{portfolio.content || "작성된 소개가 없습니다."}</p>
        </div>

        <div className={styles.petPersonality}>
          <h4 className={styles.personalityTitle}>성격</h4>
          <p className={styles.personalityText}>{portfolio.personality || "작성된 성격이 없습니다."}</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#F5A623' }}>미연결</div>
            <div className={styles.statLabel}>팔로워 수</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#FF7675' }}>{portfolio.cost ? Number(portfolio.cost).toLocaleString() : '0'}원</div>
            <div className={styles.statLabel}>단가</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#8BC34A' }}>{history?.applicants?.length || 0}</div>
            <div className={styles.statLabel}>체험단 참여 횟수</div>
          </div>
        </div>

        <div className={styles.ownerInfo}>
          <h4 className={styles.ownerTitle}>반려인 정보</h4>
          <div className={styles.ownerProfile}>
            <Image src={userData.profileImageUrl} alt="Owner" width={48} height={48} className={styles.ownerImage} />
            <div className={styles.ownerDetails}>
              <h5 className={styles.ownerName}>{}</h5>
              <p className={styles.ownerIntro}>{userData.selfIntroduction}</p>
            </div>
          </div>
          <div className={styles.ownerContact}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>이메일:</span>
              <span className={styles.contactValue}>{userData.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>전화번호:</span>
              <span className={styles.contactValue}>{userData.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>주소:</span>
              <span className={styles.contactValue}>{userData.roadAddress}, {userData.detailAddress}</span>
            </div>
          </div>
        </div>
      </div>

      <AdditinalSection 
        selectedPetNo={selectedPetInfo?.petNo}
        onSuccess={(response) => {
          console.log('체험단 신청 완료:', response);
        }}
      />
    </div>
  );
}