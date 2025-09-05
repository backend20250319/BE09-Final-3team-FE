"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../styles/AdditionalSection.module.css"
import { applyCampaign, getApplicants } from '@/api/campaignApi';

export default function AdditionalSection({ selectedPetNo, onSuccess }) {

  const router = useRouter();

  const [additionalContent, setAdditionalContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const params = useParams();
  const adNo = params.ad_no;

  // 선택된 펫이 변경될 때마다 중복 신청 체크
  useEffect(() => {
    const checkDuplicateApplication = async () => {
      if (!selectedPetNo || !adNo) return;
      
      try {
        const res = await getApplicants(adNo);
        console.log("res",res);
        const applicants = res.applicants;
        
        if (applicants && Array.isArray(applicants)) {
          const isDuplicate = applicants.some(applicant => 
            applicant.pet.petNo === selectedPetNo
          );
          console.log("isDuplicate",isDuplicate);
          setIsAlreadyApplied(isDuplicate);
        }
      } catch (error) {
        console.error('중복 신청 체크 실패:', error);
        setIsAlreadyApplied(false);
      }
    };

    checkDuplicateApplication();
  }, [selectedPetNo, adNo]);

    const handleSubmit = async () => {
    if (isAlreadyApplied) {
      alert("해당 반려동물은 이미 캠페인에 지원되었습니다.");
      return;
    }
     
    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      
      const response = await applyCampaign(adNo, selectedPetNo, additionalContent);
      console.log('체험단 신청 성공:', response);
      setAdditionalContent('');
      
      if (onSuccess) {
        onSuccess(response);
          alert('신청서가 정상적으로 제출되었습니다.');
          router.push('/campaign');
      }
    } catch (error) {
      console.error('체험단 신청 실패:', error);
      if (error.response?.status === 404) {
        setSubmitMessage('광고를 찾을 수 없습니다.');
      } else {
        setSubmitMessage('체험단 신청에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Additional Content Section */}
      <div className={styles.additionalSection}>
        <h4 className={styles.additionalTitle}>추가 내용 작성</h4>
        <textarea 
          className={styles.additionalTextarea}
          placeholder={"브랜드에 반려동물이 이 캠페인에 적합한 이유를 알려주세요\n관련 경험 또는 독특한 특징을 공유하세요"}
          value={additionalContent}
          onChange={(e) => setAdditionalContent(e.target.value)}
          disabled={isSubmitting}
        />
        <p className={styles.additionalNote}>* 체험단 선정에 도움이 될 수 있는 추가 정보를 기입해주세요</p>
        
         {isAlreadyApplied && (
          <div className={styles.duplicateWarning}>
            ⚠️ 해당 반려동물은 이미 이 캠페인에 지원되었습니다.
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSubmitting || !additionalContent.trim() || isAlreadyApplied}
        >
          {isSubmitting ? '신청 중' : isAlreadyApplied ? '신청 완료' : '신청서 제출하기'}
        </button>
        
        {/* Message Display */}
        {submitMessage && (
          <div className={`${styles.message} ${submitMessage.includes('성공') ? styles.success : styles.error}`}>
            {submitMessage}
          </div>
        )}
      </div>
    </>
  );
}