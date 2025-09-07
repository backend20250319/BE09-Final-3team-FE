"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/ApplicantList.module.css';
import PortfolioModal from './PortfolioModal';
import ReportModal from './ReportModal';
import SelectionModal from '../../components/SelectionModal';
import ReviewUrlModal from './ReviewUrlModal';
import { getPortfolio, getUser, getPersonalReview } from '@/api/advertisementApi';

export default function ApplicantList({ applicants, currentPage, onPageChange, campaign }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [petPortfolios, setPetPortfolios] = useState({});
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isReviewUrlModalOpen, setIsReviewUrlModalOpen] = useState(false);
  const [selectedApplicantForReview, setSelectedApplicantForReview] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [reviews, setReviews] = useState({});
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    reviewing: 0,
    rejected: 0,
    approved: 0
  });
  
  // 페이지당 보여줄 신청자 수
  const ITEMS_PER_PAGE = 6;
  
  // 상태별 신청자 필터링
  const baseFilteredApplicants = (() => {
    if (campaign?.adStatus === 'TRIAL') {
      // TRIAL 상태일 때 SELECTED 신청자만 필터링
      return applicants.filter(applicant => applicant.status === 'SELECTED');
    } else if (campaign?.adStatus === 'ENDED') {
      // ENDED 상태일 때 COMPLETED 신청자만 필터링
      return applicants.filter(applicant => applicant.status === 'COMPLETED');
    }
    return applicants;
  })();

  // 탭별 필터링
  const getFilteredApplicantsByTab = () => {
    // ENDED 상태이거나 TRIAL이 아닌 경우 탭 필터링 없이 전체 반환
    if (campaign?.adStatus === 'ENDED' || campaign?.adStatus !== 'TRIAL' || activeTab === 'all') {
      return baseFilteredApplicants;
    }

    return baseFilteredApplicants.filter(applicant => {
      const review = reviews[applicant.applicantNo];
      
      // 리뷰 데이터가 없는 경우 기본적으로 PENDING 상태로 처리
      const reviewStatus = review ? review.isApproved : 'PENDING';

      switch (activeTab) {
        case 'pending':
          return reviewStatus === 'PENDING';
        case 'reviewing':
          return reviewStatus === 'REVIEWING';
        case 'rejected':
          return reviewStatus === 'REJECTED';
        case 'approved':
          return reviewStatus === 'APPROVED';
        default:
          return true;
      }
    });
  };

  const filteredApplicants = getFilteredApplicantsByTab();
  
  // 현재 페이지에 해당하는 신청자들만 필터링
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredApplicants.length / ITEMS_PER_PAGE);

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

  // TRIAL 또는 ENDED 상태일 때 각 신청자의 리뷰 상태 조회 및 탭 카운트 계산
  useEffect(() => {
    const fetchReviewsAndCalculateCounts = async () => {
      if ((campaign?.adStatus === 'TRIAL' || campaign?.adStatus === 'ENDED') && applicants.length > 0 && Object.keys(reviews).length === 0) {
        setIsLoadingReviews(true);
        try {
          const reviewsData = {};
          const targetApplicants = (() => {
            if (campaign?.adStatus === 'TRIAL') {
              return applicants.filter(applicant => applicant.status === 'SELECTED');
            } else if (campaign?.adStatus === 'ENDED') {
              return applicants.filter(applicant => applicant.status === 'COMPLETED');
            }
            return applicants;
          })();
            
          // 리뷰 데이터 조회
          for (const applicant of targetApplicants) {
            try {
              const review = await getPersonalReview(applicant.applicantNo);
              reviewsData[applicant.applicantNo] = review;
            } catch (error) {
              // 리뷰가 없는 경우 기본값 설정
              reviewsData[applicant.applicantNo] = { isApproved: 'PENDING' };
            }
          }
          
          // 탭 카운트 계산 (리뷰 데이터 조회와 동시에)
          const counts = {
            all: targetApplicants.length,
            pending: 0,
            reviewing: 0,
            rejected: 0,
            approved: 0
          };
          
          targetApplicants.forEach(applicant => {
            const review = reviewsData[applicant.applicantNo];
            const reviewStatus = review ? review.isApproved : 'PENDING';
            
            switch (reviewStatus) {
              case 'PENDING':
                counts.pending++;
                break;
              case 'REVIEWING':
                counts.reviewing++;
                break;
              case 'REJECTED':
                counts.rejected++;
                break;
              case 'APPROVED':
                counts.approved++;
                break;
            }
          });
          
          // 한번에 상태 업데이트
          setReviews(reviewsData);
          setTabCounts(counts);
        } catch (error) {
          console.error('리뷰 데이터 조회 실패:', error);
        } finally {
          setIsLoadingReviews(false);
        }
      }
    };

    fetchReviewsAndCalculateCounts();
  }, [campaign?.adStatus, applicants]);

  // Instagram URL을 핸들 형식으로 변환하는 함수
  const formatInstagramHandle = (snsUsername) => {
    if (!snsUsername) return '';
    
    // 이미 @가 포함되어 있으면 그대로 반환, 없으면 @ 추가
    return snsUsername.startsWith('@') ? snsUsername : `@${snsUsername}`;
  };

  // 게시물 URL 관리 모달 열기
  const handleReviewUrlClick = (applicant) => {
    setSelectedApplicantForReview(applicant);
    setIsReviewUrlModalOpen(true);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onPageChange(1); // 탭 변경 시 첫 페이지로 이동
  };

  // 리뷰 업데이트 핸들러
  const handleReviewUpdate = async (applicantNo) => {
    if (campaign?.adStatus === 'TRIAL' && applicantNo) {
      try {
        const review = await getPersonalReview(applicantNo);
        setReviews(prev => ({
          ...prev,
          [applicantNo]: review
        }));
        
        // 탭 카운트 재계산
        const targetApplicants = campaign?.adStatus === 'TRIAL' 
          ? applicants.filter(applicant => applicant.status === 'SELECTED')
          : applicants;
          
        const counts = {
          all: targetApplicants.length,
          pending: 0,
          reviewing: 0,
          rejected: 0,
          approved: 0
        };
        
        targetApplicants.forEach(applicant => {
          const reviewData = applicant.applicantNo === applicantNo ? review : reviews[applicant.applicantNo];
          const reviewStatus = reviewData ? reviewData.isApproved : 'PENDING';
          
          switch (reviewStatus) {
            case 'PENDING':
              counts.pending++;
              break;
            case 'REVIEWING':
              counts.reviewing++;
              break;
            case 'REJECTED':
              counts.rejected++;
              break;
            case 'APPROVED':
              counts.approved++;
              break;
          }
        });
        
        setTabCounts(counts);
      } catch (error) {
        console.error('리뷰 데이터 조회 실패:', error);
        setReviews(prev => ({
          ...prev,
          [applicantNo]: { isApproved: 'PENDING' }
        }));
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>
            {campaign?.adStatus === 'TRIAL' ? '체험단 목록' : 
             campaign?.adStatus === 'ENDED' ? '완료된 체험단 목록' : '체험단 신청자 목록'}
          </h2>
          <span>총 {baseFilteredApplicants.length} 마리</span>
        </div>
        {campaign?.adStatus === 'CLOSED' && (
          <button 
            className={styles.selectionButton}
            onClick={() => setIsSelectionModalOpen(true)}
          >
            체험단 선정
          </button>
        )}
      </div>

      {/* Tabs - TRIAL 상태일 때만 표시 */}
      {campaign?.adStatus === 'TRIAL' && (
        <div className={styles.tabContainer}>
          {isLoadingReviews && (
            <div className={styles.loadingIndicator}>
              리뷰 데이터를 불러오는 중
            </div>
          )}
          <div>
            <button 
              className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('all')}
            >
              전체 ({tabCounts.all})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('pending')}
            >
              미제출 ({tabCounts.pending})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'reviewing' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('reviewing')}
            >
              검토 요망 ({tabCounts.reviewing})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('rejected')}
            >
              반려됨 ({tabCounts.rejected})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'approved' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('approved')}
            >
              승인됨 ({tabCounts.approved})
            </button>
          </div>
        </div>
      )}

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
                <p className={styles.applicantUsername}>{formatInstagramHandle(applicant?.pet?.snsUsername)}</p>
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
                {campaign?.adStatus === 'TRIAL' && (
                  <button 
                    className={styles.reviewUrlButton}
                    onClick={() => handleReviewUrlClick(applicant)}
                  >
                    게시물 URL 관리
                  </button>
                )}
                {campaign?.adStatus === 'ENDED' && (
                  <button 
                    className={styles.reviewUrlButton}
                    onClick={() => handleReviewUrlClick(applicant)}
                  >
                    게시물 URL 확인
                  </button>
                )}
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

      {/* Selection Modal */}
      <SelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        campaign={campaign}
      />

      {/* Review URL Modal */}
      <ReviewUrlModal
        isOpen={isReviewUrlModalOpen}
        onClose={() => setIsReviewUrlModalOpen(false)}
        applicant={selectedApplicantForReview}
        onReviewUpdate={handleReviewUpdate}
        campaign={campaign}
      />
    </div>
  );
}