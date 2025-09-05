"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/ApplicantList.module.css';
import PortfolioModal from './PortfolioModal';
import ReportModal from './ReportModal';
import { getPortfolio, getUser } from '@/api/advertiserApi';

export default function ApplicantList({ applicants, currentPage, onPageChange }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [petPortfolios, setPetPortfolios] = useState({});
  
  // 페이지당 보여줄 신청자 수
  const ITEMS_PER_PAGE = 6;
  
  // 현재 페이지에 해당하는 신청자들만 필터링
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplicants = applicants.slice(startIndex, endIndex);
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(applicants.length / ITEMS_PER_PAGE);

  // 신청자 선택 시 사용자 정보 조회
  const handleApplicantSelect = async (applicant) => {
    setSelectedApplicant(applicant);
    setIsReportModalOpen(true);
    
    // 사용자 정보 조회
    if (applicant?.pet?.userNo) {
      try {
        const userData = await getUser(applicant.pet.userNo);
        setSelectedUserData(userData);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setSelectedUserData(null);
      }
    }
  };

  // 각 신청자의 펫 포트폴리오 조회
  useEffect(() => {
    const fetchPetPortfolios = async () => {
      if (currentApplicants && currentApplicants.length > 0) {
        try {
          const portfolios = {};
          for (const applicant of currentApplicants) {
            if (applicant.pet && applicant.pet.petNo) {
              const portfolio = await getPortfolio(applicant.pet.petNo);
              portfolios[applicant.pet.petNo] = portfolio;
            }
          }
          setPetPortfolios(portfolios);
        } catch (error) {
          console.error('펫 포트폴리오 조회 실패:', error);
        }
      }
    };

    fetchPetPortfolios();
  }, [applicants, currentPage]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>체험단 신청자 목록</h2>
        <span>총 {applicants.length} 마리</span>
      </div>

      {/* Applicant Grid */}
      <div className={styles.applicantGrid}>
        {currentApplicants.map((applicant, index) => (
          <div key={applicant.applicantNo} className={styles.applicantCard}>
            <div className={styles.applicantImage}>
              {applicant?.pet?.imageUrl && (<Image 
                src={applicant.pet.imageUrl} 
                alt={applicant.pet.name}
                width={333}
                height={128}
                className={styles.image}
              />)}
            </div>
            <div className={styles.applicantInfo}>
              <div className={styles.applicantDiv}>
                <h3 className={styles.applicantName}>{applicant?.pet?.name}</h3>
                <p className={styles.applicantUsername}>{applicant?.pet?.snsUrl}</p>
              </div>
              <p className={styles.applicantDescription}>
                {petPortfolios[applicant?.pet?.petNo]?.content}
              </p>
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.detailButton}
                  onClick={() => {
                    setSelectedPetData(applicant);
                    setIsPortfolioModalOpen(true);
                  }}
                >
                  포트폴리오
                </button>
                <button 
                  className={styles.sirenButton}
                  onClick={() => handleApplicantSelect(applicant)}
                >
                  <Image
                    src="/siren.png"
                    alt="siren.png"
                    width={30}
                    height={30} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - 페이지가 2개 이상일 때만 표시 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
        {/* 왼쪽 이동 버튼 */}
        <button
          className={styles.pageButton}
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}
          disabled={currentPage === 1} // 첫 페이지일 땐 비활성화
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
              d="M7 1L1 7L7 13"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 페이지 번호 버튼 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* 오른쪽 이동 버튼 */}
        <button
          className={styles.pageButton}
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
              d="M1 1L7 7L1 13"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        </div>
      )}

      {/* Portfolio Modal */}
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        petData={selectedPetData}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedPetName={selectedApplicant?.pet?.name}
        applicantName={selectedUserData?.name}
      />
    </div>
  );
}

