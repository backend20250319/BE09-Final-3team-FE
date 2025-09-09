"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../styles/CampaignDetail.module.css';
import PetstarList from './PetstarList';
import ApplicantList from './ApplicantList';
import { getImageByAdNo, getApplicants, getPetstarRecommend, getPet, getPortfolio, getInstagramProfileBySnSId } from '@/api/advertisementApi';

export default function CampaignDetail({ campaignData, adNo }) {

  const router = useRouter(); 
  const [applicantPage, setApplicantPage] = useState(1);
  const [petstarPage, setPetstarPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [petstars, setPetstars] = useState([]);
  const [petstarLoading, setPetstarLoading] = useState(false);


  console.log("petstars");
  const handleApplicantPageChange = (page) => {
    setApplicantPage(page);
  };

  const handlePetstarPageChange = (page) => {
    setPetstarPage(page);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const [adImage, setAdImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [adImageData, applicantsData] = await Promise.all([
          getImageByAdNo(campaignData.adNo),
          getApplicants(campaignData.adNo)
        ]);
        
        setAdImage(adImageData);
        setApplicants(applicantsData.applicants || []);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignData.adNo]);

  // 펫스타 추천 API 호출
  useEffect(() => {
    const fetchPetstarRecommendations = async () => {
      try {
        setPetstarLoading(true);
        const recommendationData = await getPetstarRecommend(campaignData.adNo);
        console.log(recommendationData);
        
        // 추천된 펫스타들의 상세 정보를 가져오기 (PetStarGrid와 동일한 방식)
        const petstarDetails = await Promise.all(
          recommendationData.top_petstars.map(async (recommendation) => {
            try {
              const petData = await getPet(recommendation.pet_no);
              
              // 포트폴리오 정보 가져오기
              let portfolioData = null;
              try {
                portfolioData = await getPortfolio(recommendation.pet_no);
              } catch (portfolioErr) {
                console.warn(`펫 ${recommendation.pet_no}의 포트폴리오를 가져오는데 실패했습니다:`, portfolioErr);
              }
              
              // SNS 프로필 정보 가져오기
              let snsProfile = null;
              if (petData.snsId) {
                try {
                  snsProfile = await getInstagramProfileBySnSId(petData.snsId);
                  console.log(`펫 ${recommendation.pet_no}의 SNS 프로필:`, snsProfile);
                } catch (snsErr) {
                  console.warn(`펫 ${recommendation.pet_no}의 SNS 프로필을 가져오는데 실패했습니다:`, snsErr);
                }
              }
              
              return {
                ...petData,
                portfolioData: portfolioData,
                snsProfile: snsProfile,
              };
            } catch (error) {
              console.error(`펫스타 ${recommendation.pet_no} 정보를 가져오는 중 오류:`, error);
              return null;
            }
          })
        );
        
        // null 값 제거
        const validPetstars = petstarDetails.filter(petstar => petstar !== null);
        setPetstars(validPetstars);
      } catch (error) {
        console.error('펫스타 추천을 가져오는 중 오류가 발생했습니다:', error);
        setPetstars([]);
      } finally {
        setPetstarLoading(false);
      }
    };

    if (campaignData.adNo) {
      fetchPetstarRecommendations();
    }
  }, [campaignData.adNo]);

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.breadcrumb}>
          <button className={styles.backButton} onClick={() => router.push('/advertiser/ads-list')}>
            <Image 
              src="/campaign/arrow.png"
              alt="arrow.png"
              width={16}
              height={16}/>
              체험단 광고 목록으로 이동
          </button>
          <div className={styles.breadcrumbRight}>
            <span className={styles.breadcrumbText} style={{color : "#6B7280"}}>체험단 광고 목록</span>
            <Image 
              src="/advertiser/arrow-2.png"
              alt="arrow-2.png"
              width={6}
              height={6}/>
            <span className={styles.breadcrumbText}>{campaignData.title}</span>
          </div>
        </div>
      </nav>

      <div className={styles.campaignContainer}>
        {/* Campaign Header */}
        <div className={styles.campaignHeader}>
          <h1 className={styles.campaignTitle}>{campaignData.title}</h1>
          <button className={styles.editButton} onClick={() => router.push(`/advertiser/ads-list/edit/${adNo}`)}>
            <Image 
              src="/advertiser/mod_icon.png"
              alt="mod_icon.png"
              width={16}
              height={16}/>
            수정하기
          </button>
        </div>

        {/* Campaign Content */}
        <div className={styles.campaignContent}>
          {/* Campaign Image */}
          <div className={styles.campaignImageSection}>
            {adImage && (<Image 
              src={adImage.filePath} 
              alt={campaignData.title}
              width={500}
              height={500}
              className={styles.campaignImage}
            />)}

            
            {/* Campaign Stats */}
            <div className={styles.statsSection}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{campaignData.announceStart} ~ {campaignData.announceEnd}</div>
                <div className={styles.statLabel}>체험단 모집 기간</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{campaignData.campaignStart} ~ {campaignData.campaignEnd}</div>
                <div className={styles.statLabel}>체험단 참여 기간</div>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{campaignData.campaignSelect}</div>
                  <div className={styles.statLabel}>체험단 선정일</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{campaignData.applicants}</div>
                  <div className={styles.statLabel}>참여자 수</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{campaignData.members}</div>
                  <div className={styles.statLabel}>모집 인원수</div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className={styles.campaignDetails}>
            {/* Product Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>상품 상세 정보</h3>
              <p className={styles.productDescription}>{campaignData.content}</p>
            </div>

            {/* Mission */}
            <div className={styles.section}>
              <div className={styles.missionHeader}>
                <h3 className={styles.missionTitle}>체험단 미션</h3>
              </div>
              <div className={styles.objective}>
                <Image 
                  src="/campaign/target.png"
                  alt="target.png"
                  width={16}
                  height={16} />
                <p className={styles.missionTitle} style={{ fontSize : 16}}>주요 목표</p>
              </div>
              <p className={styles.missionDescription}>{campaignData.objective}</p>
              <div className={styles.tasksList}>
                {campaignData.mission.map((task, index) => (
                  <div key={task.missionNo || index} className={styles.taskItem}>
                    <Image 
                      src="/campaign/check.png"
                      alt="check.png"
                      width={16}
                      height={16} />
                    <span>{task.content}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>필수 키워드</h3>
              <div className={styles.keywordsList}>
                {campaignData.keyword.map((keyword, index) => (
                  <span key={keyword.keywordNo || index} className={styles.keyword}>{keyword.content}</span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>필수 요건</h3>
              <div className={styles.requirementsList}>
                {campaignData.requirement.map((requirement, index) => (
                  <div key={requirement.reqNo || index} className={styles.requirementItem}>
                    <Image 
                      src="/campaign/info.png"
                      alt="info.png"
                      width={16}
                      height={16} />
                    <span>{requirement.content}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Link */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>상품 링크</h3>
              <div className={styles.productLink}>  
                <a href={campaignData.adUrl} className={styles.storeLink}>
                  <Image 
                    src="/campaign/link.png"
                    alt="link.png"
                    width={16}
                    height={16}/>
                  Visit {campaignData.advertiser?.name} Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant List */}
      <ApplicantList 
        applicants={applicants}
        currentPage={applicantPage}
        onPageChange={handleApplicantPageChange}
        campaign={campaignData}
      />
      
      {/* Petstar List */}
      <PetstarList 
        petstars={petstars}
        currentPage={petstarPage}
        onPageChange={handlePetstarPageChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        loading={petstarLoading}
      />
    </div>
  );
}

