"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/PetStarGrid.module.css';
import PortfolioModal from '../../ads-list/[ad_no]/components/PortfolioModal';
import { getPetstar, getPortfolio } from '@/api/advertisementApi';

export default function PetstarGrid({ searchQuery, sortBy }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [petstars, setPetstars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API에서 펫스타 데이터 가져오기
  useEffect(() => {
    const fetchPetstars = async () => {
      try {
        setLoading(true);
        const data = await getPetstar();
        
        // 각 펫의 포트폴리오 정보를 병렬로 가져오기
        const petstarsWithPortfolio = await Promise.all(
          data.map(async (petstar) => {
            try {
              const portfolioData = await getPortfolio(petstar.petNo);
              return {
                ...petstar,
                portfolioData: portfolioData,
              };
            } catch (portfolioErr) {
              console.warn(`펫 ${petstar.petNo}의 포트폴리오를 가져오는데 실패했습니다:`, portfolioErr);
              return {
                ...petstar,
                description: '소개 정보를 불러올 수 없습니다.',
                cost: '비용 정보를 불러올 수 없습니다.',
                portfolioData: null
              };
            }
          })
        );
        console.log(petstarsWithPortfolio);
        setPetstars(petstarsWithPortfolio);
        setError(null);
      } catch (err) {
        console.error('펫스타 데이터를 가져오는데 실패했습니다:', err);
        setError('펫스타 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPetstars();
  }, []);

  const sortedPetstars = useMemo(() => {
    let filtered = petstars;

    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    }

    let sorted = [...filtered];
    if (sortBy === "followers") {
      sorted.sort((a, b) => b.followers - a.followers); // 내림차순
    } else if (sortBy === "costLow") {
      sorted.sort((a, b) => a.price - b.price); // 낮은순 오름차순
    } else if (sortBy === "costHigh") {
      sorted.sort((a, b) => b.price - a.price); // 높은순 내림차순
    }

    return sorted;
  }, [searchQuery, sortBy, petstars]);

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>펫스타 정보를 불러오는 중</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className={styles.container}>
      <div className={styles.petstarGrid}>
        {sortedPetstars.map((petstar) => (
          <div key={petstar.petNo} className={styles.petstarCard}>
            <div className={styles.petstarImage}>
              <Image 
                src={petstar.imageUrl} 
                alt={petstar.name}
                width={262}
                height={256}
                className={styles.image}
              />
            </div>
            <div className={styles.petstarInfo}>
              <div className={styles.petstarDiv}>
                <h3 className={styles.petstarName}>{petstar.name}</h3>
                <p className={styles.petstarUsername}>{formatInstagramHandle(petstar.snsUrl)}</p>
              </div>
              <p className={styles.petstarDescription}>{petstar.portfolioData?.content}</p>
              <div className={styles.followerInfo}>
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M10 8C12.21 8 14 6.21 14 4C14 1.79 12.21 0 10 0C7.79 0 6 1.79 6 4C6 6.21 7.79 8 10 8ZM10 10C7.33 10 2 11.34 2 14V16H18V14C18 11.34 12.67 10 10 10Z" fill="#6B7280"/>
                </svg>
                <span>팔로워 수: {petstar.followers || '미연결'}</span>
              </div>

              <div className={styles.priceInfo}>
                <Image 
                  src="/advertiser/won.png"
                  alt="won.png"
                  width={16}
                  height={16}/>
                <span>{petstar.portfolioData?.cost}/건</span>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.snsButton}
                  onClick={() => {
                    if (petstar.snsUrl) {
                      const url = petstar.snsUrl.match(/^https?:\/\//) ? petstar.snsUrl : `https://${petstar.snsUrl}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <Image 
                    src="/advertiser/sns.png"
                    alt="sns.png"
                    width={16}
                    height={16}/>
                  SNS
                </button>
                  <button 
                    className={styles.portfolioButton}
                    onClick={() => {
                      const petData = {
                        pet: petstar
                      };
                      setSelectedPetData(petData);
                      setIsPortfolioModalOpen(true);
                    }}
                >
                  <Image 
                    src="/advertiser/folder.png"
                    alt="folder.png"
                    width={16}
                    height={16}/>
                  포트폴리오
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        petData={selectedPetData}
      />
   </div>
  );
}

