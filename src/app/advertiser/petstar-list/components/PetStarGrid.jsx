"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/PetStarGrid.module.css';
import PortfolioModal from '../../ads-list/[ad_no]/components/PortfolioModal';
import Pagination from '../../ads-list/components/Pagination';
import { getPetstar, getPortfolio } from '@/api/advertisementApi';

export default function PetstarGrid({ searchQuery, sortBy }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [petstars, setPetstars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // 페이지네이션을 위한 데이터 분할
  const paginatedPetstars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPetstars.slice(startIndex, endIndex);
  }, [sortedPetstars, currentPage, itemsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(sortedPetstars.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 검색이나 정렬이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

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
  const formatInstagramHandle = (snsUsername) => {
    if (!snsUsername) return '';
    
    // 이미 @가 포함되어 있으면 그대로 반환, 없으면 @ 추가
    return snsUsername.startsWith('@') ? snsUsername : `@${snsUsername}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.petstarGrid}>
        {paginatedPetstars.map((petstar) => (
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
                <p className={styles.petstarUsername}>{formatInstagramHandle(petstar.snsUsername)}</p>
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
                    if (petstar.snsUsername) {
                      const url = `https://www.instagram.com/${petstar.snsUsername.replace('@', '')}`;
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        petData={selectedPetData}
      />
   </div>
  );
}

