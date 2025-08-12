"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/ApplicantList.module.css';
import PortfolioModal from './PortfolioModal';
import ReportModal from './ReportModal';

export default function ApplicantList({ applicants, currentPage, onPageChange }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>체험단 신청자 목록</h2>
        <span>총 45 마리</span>
      </div>

      {/* Applicant Grid */}
      <div className={styles.applicantGrid}>
        {applicants.map((applicant, index) => (
          <div key={applicant.id} className={styles.applicantCard}>
            <div className={styles.applicantImage}>
              <Image 
                src={applicant.image} 
                alt={applicant.name}
                width={333}
                height={128}
                className={styles.image}
              />
            </div>
            <div className={styles.applicantInfo}>
              <div className={styles.applicantDiv}>
                <h3 className={styles.applicantName}>{applicant.name}</h3>
                <p className={styles.applicantUsername}>{applicant.sns_profile}</p>
              </div>
              <p className={styles.applicantDescription}>{applicant.description}</p>
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.detailButton}
                  onClick={() => {
                    if (applicant.name === "황금이") {
                      const petData = {
                        name: '황금이',
                        breed: '골든 리트리버',
                        age: '3살',
                        weight: '28 kg',
                        gender: 'M',
                        personality: '황금이는 매우 친근하고 사교적인 성격으로, 사람뿐 아니라 다른 반려동물과도 쉽게 친해집니다. 긍정적인 에너지와 활발한 호기심으로 언제나 주변 분위기를 밝게 만드는 친구입니다. 상황에 따라 차분함과 활동성을 유연하게 조절하는 균형 잡힌 성격을 가지고 있어 다양한 환경에 잘 적응합니다.',
                        introduction: '모험을 사랑하는 황금이는 해변 산책과 산악 하이킹 코스를 즐기며 자연 속에서 뛰노는 걸 가장 좋아합니다. 친구들과 어울려 뛰어노는 것을 즐기며, 특히 어린이와 다른 반려동물들과 따뜻한 교감을 나누는 모습을 자주 볼 수 있습니다. 신뢰감 있고 충성스러운 성향 덕분에 가족들의 든든한 친구이자 보호자로도 사랑받고 있습니다.',
                        addSection: '황금이는 민감성 피부와 소화기를 가지고 있어, 화학 첨가물이 없는 유기농 사료를 꾸준히 찾아왔습니다. 다양한 프리미엄 사료를 체험하며 비교·리뷰한 경험이 있어, 이번 제품의 장점을 정확히 전달할 자신이 있습니다. 특히 활동량이 많아 균형 잡힌 단백질과 오메가 지방산 공급이 큰 도움이 될 것이라 기대합니다.',
                        image: '/user/dog.png',
                        instagram: '@goldenbuddy',
                        followers: '189K',
                        price: '250,000',
                        partcipation: 10
                      };
                      setSelectedPetData(petData);
                      setIsPortfolioModalOpen(true);
                    }
                  }}
                >
                  포트폴리오
                </button>
                <button 
                  className={styles.sirenButton}
                  onClick={() => {
                    setSelectedApplicant(applicant);
                    setIsReportModalOpen(true);
                  }}
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

      {/* Pagination */}
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
        {[1, 2, 3, 4].map((page) => (
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
            if (currentPage < 4) { // 마지막 페이지 번호에 맞게 변경
              onPageChange(currentPage + 1);
            }
          }}
          disabled={currentPage === 4} // 마지막 페이지일 땐 비활성화
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
        applicantName={selectedApplicant?.name}
      />
    </div>
  );
}

