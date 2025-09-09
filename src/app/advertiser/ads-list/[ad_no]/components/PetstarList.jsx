"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/PetstarList.module.css';
import PortfolioModal from './PortfolioModal';
import Pagination from '../../components/Pagination';

export default function PetstarList({ petstars, currentPage, onPageChange, sortBy, onSortChange, loading }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  // 정렬된 펫스타 목록
  const sortedPetstars = useMemo(() => {
    let sorted = [...petstars];
    
    if (sortBy === "followers") {
      sorted.sort((a, b) => (b.snsProfile?.follows_count || 0) - (a.snsProfile?.follows_count || 0)); // 내림차순
    } else if (sortBy === "costLow") {
      sorted.sort((a, b) => (a.portfolioData?.cost || 0) - (b.portfolioData?.cost || 0)); // 낮은순 오름차순
    } else if (sortBy === "costHigh") {
      sorted.sort((a, b) => (b.portfolioData?.cost || 0) - (a.portfolioData?.cost || 0)); // 높은순 내림차순
    }

    return sorted;
  }, [petstars, sortBy]);

  // 페이지네이션을 위한 데이터 분할
  const paginatedPetstars = useMemo(() => {
    const startIndex = (internalCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPetstars.slice(startIndex, endIndex);
  }, [sortedPetstars, internalCurrentPage, itemsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(sortedPetstars.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setInternalCurrentPage(page);
  };

  // 정렬이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setInternalCurrentPage(1);
  }, [sortBy]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>펫스타 추천 목록</h2>
        <div className={styles.controls}>
          <select 
            className={styles.sortSelect} 
            value={sortBy} 
            onChange={handleSortChange}
          >
            <option value="followers">팔로워 수</option>
            <option value="costLow">단가 낮은순</option>
            <option value="costHigh">단가 높은순</option>
          </select>
          <div className={styles.totalCount}>
            <span>총 {sortedPetstars.length} 마리</span>
          </div>
        </div>
      </div>

      {/* Petstar Grid */}
      <div className={styles.petstarGrid}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>추천 펫스타 선별중입니다</p>
          </div>
        ) : (
          paginatedPetstars.map((petstar) => (
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
                <p className={styles.petstarUsername}>@{petstar.snsUsername}</p>
              </div>
              <p className={styles.petstarDescription}>{petstar.portfolioData?.content}</p>
              <div className={styles.followerInfo}>
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M10 8C12.21 8 14 6.21 14 4C14 1.79 12.21 0 10 0C7.79 0 6 1.79 6 4C6 6.21 7.79 8 10 8ZM10 10C7.33 10 2 11.34 2 14V16H18V14C18 11.34 12.67 10 10 10Z" fill="#6B7280"/>
                </svg>
                <span>팔로워 수: {petstar.snsProfile?.follows_count || '미연결'}</span>
              </div>

              <div className={styles.priceInfo}>
                <Image 
                  src="/advertiser/won.png"
                  alt="won.png"
                  width={16}
                  height={16}/>
                <span>{(petstar.portfolioData?.cost || 0).toLocaleString()}/건</span>
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
        ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={internalCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Portfolio Modal */}
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        petData={selectedPetData}
        hideAdditionalContent={true}
      />
   </div>
  );
}

