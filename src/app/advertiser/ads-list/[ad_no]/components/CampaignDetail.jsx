"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../styles/CampaignDetail.module.css';
import PetstarList from './PetstarList';
import ApplicantList from './ApplicantList';
import { getImageByAdNo, getApplicants } from '@/api/advertisementApi';

export default function CampaignDetail({ campaignData, adNo }) {

  const router = useRouter(); 
  const [applicantPage, setApplicantPage] = useState(1);
  const [petstarPage, setPetstarPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const petstars = [
    {
      id: 1,
      name: '바다',
      sns_profile: '@seayousoon',
      image: '/influencer-2.jpg',
      description: '바다는 호기심이 많고 영리한 고양이로, 장난감과 퍼즐을 좋아합니다. 주인과의 교감도 깊어 함께 있을 때 행복해 합니다.',
      followers: '320K',
      price: '350,000',
      snsLink: '#',
      portfolioLink: '#'
    },
    {
      id: 2,
      name: '쿠키',
      sns_profile: '@cookieSweet',
      image: '/influencer-3.jpg',
      description: '쿠키는 공놀이나 장난감을 가지고 노는 것을 무척 좋아하며, 산책처럼 직접 야외에서의 경험도 즐깁니다. 밝고 명랑한 성격 덕분에 주위에 활력을 불어넣고, 쉽게 친해질 수 있는 친구이기도 합니다.',
      followers: '245K',
      price: '300,000',
      snsLink: '#',
      portfolioLink: '#'
    },
    {
      id: 3,
      name: '황금이',
      sns_profile: '@goldenbuddy',
      image: '/user/dog.png',
      description: '모험을 사랑하는 황금이는 해변 산책과 산악 하이킹 코스를 즐기며 자연 속에서 뛰노는 걸 가장 좋아합니다. 친구들과 어울려 뛰어노는 것을 즐기며, 특히 어린이와 다른 반려동물들과 따뜻한 교감을 나누는 모습을 자주 볼 수 있습니다. 신뢰감 있고 충성스러운 성향 덕분에 가족들의 든든한 친구이자 보호자로도 사랑받고 있습니다.',
      followers: '189K',
      price: '250,000',
      snsLink: '#',
      portfolioLink: '#'
    }
  ];

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
      />
    </div>
  );
}

