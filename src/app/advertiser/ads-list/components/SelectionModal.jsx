"use client"

import React, { useState, useEffect } from 'react';
import styles from "../styles/SelectionModal.module.css";
import { getApplicants, updateApplicant, getInstagramProfile, getUser } from '@/api/advertisementApi';

export default function SelectionModal({ isOpen, onClose, campaign }) {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDataMap, setUserDataMap] = useState({});
  const [instagramProfiles, setInstagramProfiles] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen && campaign?.adNo) {
      fetchApplicants();
    }
  }, [isOpen, campaign?.adNo]);

  // 검색어에 따른 지원자 필터링
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter(applicant => 
        applicant.pet?.name?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredApplicants(filtered);
    }
  }, [applicants, searchKeyword]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const applicantsData = await getApplicants(campaign.adNo);
      // 모든 상태의 지원자들을 가져옴 (PENDING, SELECTED, REJECTED)
      const availableApplicants = applicantsData.applicants.filter(applicant => 
        applicant.status === 'PENDING' || applicant.status === 'SELECTED' || applicant.status === 'REJECTED'
      );
      setApplicants(availableApplicants);
      setFilteredApplicants(availableApplicants);
      
      // SELECTED 상태인 지원자들을 선택된 상태로 복원
      const selectedApplicantNos = availableApplicants
        .filter(applicant => applicant.status === 'SELECTED')
        .map(applicant => applicant.applicantNo);
      setSelectedApplicants(selectedApplicantNos);
      
      // 각 지원자의 사용자 정보 조회
      const userDataPromises = availableApplicants.map(async (applicant) => {
        if (applicant?.pet?.userNo) {
          try {
            const userData = await getUser(applicant.pet.userNo);
            return { applicantNo: applicant.applicantNo, userData };
          } catch (error) {
            console.error('사용자 정보 조회 실패:', error);
            return { applicantNo: applicant.applicantNo, userData: null };
          }
        }
        return { applicantNo: applicant.applicantNo, userData: null };
      });
      
      const userDataResults = await Promise.all(userDataPromises);
      const userDataMap = {};
      userDataResults.forEach(({ applicantNo, userData }) => {
        userDataMap[applicantNo] = userData;
      });
      setUserDataMap(userDataMap);

      // 각 지원자의 인스타그램 프로필 조회
      const instagramProfilePromises = availableApplicants.map(async (applicant) => {
        if (applicant?.pet?.userNo) {
          try {
            const instagramData = await getInstagramProfile(applicant.pet.userNo);
            return { applicantNo: applicant.applicantNo, instagramData: instagramData[0] };
          } catch (error) {
            console.error('인스타그램 프로필 조회 실패:', error);
            return { applicantNo: applicant.applicantNo, instagramData: null };
          }
        }
        return { applicantNo: applicant.applicantNo, instagramData: null };
      });

      const instagramResults = await Promise.all(instagramProfilePromises);
      const instagramProfilesMap = {};
      instagramResults.forEach(({ applicantNo, instagramData }) => {
        instagramProfilesMap[applicantNo] = instagramData;
      });
      setInstagramProfiles(instagramProfilesMap);

      // 모든 SELECTED 상태인 지원자의 isSaved가 true인지 확인
      const selectedApplicants = availableApplicants.filter(applicant => applicant.status === 'SELECTED');
      const allSaved = selectedApplicants.length > 0 && selectedApplicants.every(applicant => applicant.isSaved === true);
      setIsCompleted(allSaved);
    } catch (error) {
      console.error('지원자 목록 조회 실패:', error);
      setError('지원자 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleApplicantSelect = (applicantNo) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantNo)) {
        return prev.filter(id => id !== applicantNo);
      } else {
        // 최대 지원자 수 제한
        if (prev.length >= campaign.members) {
          setError(`최대 ${campaign.members}명까지만 선정할 수 있습니다.`);
          return prev;
        }
        setError('');
        return [...prev, applicantNo];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedApplicants.length === 0) {
      setError('선정할 지원자를 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // 현재 SELECTED 상태인 지원자들
      const currentSelectedApplicants = applicants
        .filter(applicant => applicant.status === 'SELECTED')
        .map(applicant => applicant.applicantNo);
      
      // 새로 선택된 지원자들 (SELECTED로 변경)
      const newlySelectedApplicants = selectedApplicants.filter(
        applicantNo => !currentSelectedApplicants.includes(applicantNo)
      );
      
      // 선택 해제된 지원자들 (REJECTED로 변경)
      const deselectedApplicants = currentSelectedApplicants.filter(
        applicantNo => !selectedApplicants.includes(applicantNo)
      );
      
      // 선정되지 않은 모든 지원자들을 REJECTED로 변경
      const rejectedApplicants = applicants
        .filter(applicant => !selectedApplicants.includes(applicant.applicantNo))
        .map(applicant => applicant.applicantNo);
      
      // API 호출들을 병렬로 실행
      const promises = [];
      
      // 새로 선택된 지원자들을 SELECTED로 변경
      promises.push(...newlySelectedApplicants.map(applicantNo => 
        updateApplicant(applicantNo, 'SELECTED', false)
      ));
      
      // 선택 해제된 지원자들과 선정되지 않은 모든 지원자들을 REJECTED로 변경
      promises.push(...rejectedApplicants.map(applicantNo => 
        updateApplicant(applicantNo, 'REJECTED', false)
      ));
      
      await Promise.all(promises);
      
      console.log('지원자 선정 완료:', { 
        adNo: campaign.adNo, 
        newlySelectedApplicants,
        rejectedApplicants 
      });
      
      // 성공 시 모달 닫기
      onClose();
      // 성공 메시지나 페이지 새로고침 등을 여기에 추가할 수 있습니다.
    } catch (error) {
      console.error('지원자 선정 실패:', error);
      setError('지원자 선정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedApplicants([]);
    setError('');
    setApplicants([]);
    setFilteredApplicants([]);
    setUserDataMap({});
    setSearchKeyword('');
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.modalTitle}>지원자 선정</h2>
              <p className={styles.modalSubtitle}>
                캠페인에 참여할 지원자를 체험단 선정일 이전까지 선택해주세요 (최대 {campaign?.members || 0}명)
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Search Bar */}
          {!isLoading && applicants.length > 0 && !isCompleted && (
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14L11.1 11.1"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="반려동물 이름으로 검색"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
                    className={styles.clearButton}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 1L13 13M1 13L13 1"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>지원자 목록을 불러오는 중</p>
            </div>
          ) : isCompleted ? (
            <div className={styles.completedContainer}>
              <div className={styles.completedIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#2563EB"/>
                  <path
                    d="M16 24L22 30L32 18"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.completedTitle}>체험단 선정이 완료되었습니다</h3>
              <p className={styles.completedMessage}>
                체험단 신청이 완료되어 더 이상 수정할 수 없습니다
              </p>
            </div>
          ) : applicants.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p>선정 가능한 지원자가 없습니다.</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className={styles.applicantsList}>
              {filteredApplicants.map((applicant) => (
                <div 
                  key={applicant.applicantNo} 
                  className={`${styles.applicantCard} ${selectedApplicants.includes(applicant.applicantNo) ? styles.selected : ''}`}
                  onClick={() => handleApplicantSelect(applicant.applicantNo)}
                >
                  <div className={styles.applicantInfo}>
                    <div className={styles.petInfo}>
                      <h4>{applicant.pet?.name || '펫 이름 없음'}</h4>
                      <p>{applicant?.content || '추가 작성된 내용 없음'}</p>
                    </div>
                    <div className={styles.ownerInfo}>
                      <p>소유자: {userDataMap[applicant.applicantNo]?.name || '이름 없음'}</p>
                      <p>팔로워: {instagramProfiles[applicant.applicantNo]?.followers_count ? `${Number(instagramProfiles[applicant.applicantNo].followers_count).toLocaleString()} 명` : '미연결'}</p>
                      {applicant.status === 'SELECTED' && (
                        <span className={`${styles.statusText} ${styles.selected}`}>
                          선정됨
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.selectionIndicator}>
                    {selectedApplicants.includes(applicant.applicantNo) && (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M16.6667 5L7.50004 14.1667L3.33337 10"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          {isCompleted ? (
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClose}
            >
              닫기
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleClose}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isLoading || selectedApplicants.length === 0}
              >
                {isLoading ? '선정중' : `선정 (${selectedApplicants.length}/${campaign?.members || 0})`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
