"use client";

import React, { useState } from 'react';
import SubHeader from "@/app/components/SubHeader";
import styles from "./styles/CampaignRegisterPage.module.css"
import ProgressSection from './components/CampaignRegisterForm/ProgressSection';
import ImageUploadSection from './components/FormSections/ImageUploadSection';

export default function CampaignRegisterPage() {

  const [formData, setFormData] = useState({
    mainImage: null,
    title: '',
    detailInfo: '',
    mainGoal: '',
    missions: [''],
    keywords: [''],
    requirements: [''],
    participationInfo: {
      recruitmentPeriod: { start: null, end: null },
      participationPeriod: { start: null, end: null },
      selectionDate: null,
      recruitmentCount: ''
    },
    productPage: ''
  });

  const steps = [
    { name: '이미지', icon: '📷' },
    { name: '제목', icon: '✏️' },
    { name: '상세 정보', icon: '📋' },
    { name: '주요 목표', icon: '🎯' },
    { name: '미션', icon: '📝' },
    { name: '키워드', icon: '🏷️' },
    { name: '필수 요건', icon: '⚠️' },
    { name: '링크', icon: '🔗' },
    { name: '참여 정보', icon: '👥' }
  ];

  const stepColors = [
    '#FFE5E5', '#FFF4E5', '#FFFACD', '#F5FFE5', 
    '#E5FFF4', '#E5F4FF', '#E5E5FF', '#F0E5FF', '#F9E5FF'
  ];

  const getCompletedSteps = () => {
    return [
      Boolean(formData.mainImage), // 0: 이미지
      Boolean(formData.title), // 1: 제목
      Boolean(formData.detailInfo), // 2: 상세 정보
      Boolean(formData.mainGoal), // 3: 주요 목표
      formData.missions.some(m => m), // 4: 미션
      formData.keywords.some(k => k), // 5: 키워드
      formData.requirements.some(r => r), // 6: 필수 요건
      Boolean(formData.productPage), // 7: 링크
      Boolean(formData.participationInfo.recruitmentPeriod.start && formData.participationInfo.recruitmentPeriod.end) // 8: 참여 정보
    ];
  };

  const completedSteps = getCompletedSteps();
  const progress = completedSteps.filter(Boolean).length;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main style={{ flex: 1 }}>
      <SubHeader
        title="캠페인 등록"
        subtitle="반려동물 인플루언서와 소통하기 위한 새로운 광고 캠페인을 만들어보세요"
      />
      <div className={styles.container}>
        <div className={styles.formContainer}>          
          <ProgressSection 
            steps={steps} 
            stepColors={stepColors}
            completedSteps={completedSteps}
            progress={progress} 
          />

          <form className={styles.form}>
            <ImageUploadSection formData={formData} setFormData={setFormData} />
            {/* <TitleSection formData={formData} handleInputChange={handleInputChange} />
            <DetailInfoSection formData={formData} handleInputChange={handleInputChange} />
            <MainGoalSection formData={formData} handleInputChange={handleInputChange} />
            <MissionsSection formData={formData} setFormData={setFormData} />
            <KeywordsSection formData={formData} setFormData={setFormData} />
            <RequirementsSection formData={formData} setFormData={setFormData} />
            <ParticipationInfoSection formData={formData} setFormData={setFormData} />
            <ProductPageSection formData={formData} handleInputChange={handleInputChange} /> */}
          </form>
        </div>

        <div className={styles.buttonSection}>
          <button type="button" className={styles.cancelButton}>취소</button>
          <button type="submit" className={styles.submitButton}>캠페인 등록</button>
        </div>
      </div>
    </main>
  );
}
