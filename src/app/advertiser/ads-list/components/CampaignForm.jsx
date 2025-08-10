"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../styles/CampaignForm.module.css"
import campaigns from '../data/campaigns';
import ProgressSection from '../register/components/CampaignRegisterForm/ProgressSection';
import ImageUploadSection from '../register/components/FormSections/ImageUploadSection';
import TitleSection from '../register/components/FormSections/TitleSection';
import DetailInfoSection from '../register/components/FormSections/DetailInfoSection';
import MainGoalSection from '../register/components/FormSections/MainGoalSection';
import MissionsSection from '../register/components/FormSections/MissionsSection';
import KeywordsSection from '../register/components/FormSections/KeyWordsSection';
import RequirementsSection from '../register/components/FormSections/RequirementsSection';
import ProductPageSection from '../register/components/FormSections/ProductPageSection';
import ParticipationInfoSection from '../register/components/FormSections/ParticipationInfoSection';

export default function CampaignForm({ mode = "create", campaignId }) {
  
  const router = useRouter();

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

  useEffect(() => {
    if (mode === "edit" && campaignId) {
      const adNo = parseInt(campaignId, 10);
      const foundCampaign = campaigns.find(c => c.ad_no === adNo);
      console.log(campaignId);
      if (foundCampaign) {
        setFormData({
          mainImage: foundCampaign.image || null,
          title: foundCampaign.title || "",
          detailInfo: foundCampaign.content || "",
          mainGoal: foundCampaign.objective || "",
          missions: foundCampaign.mission.length ? foundCampaign.mission : [""],
          keywords: foundCampaign.keyword.length ? foundCampaign.keyword : [""],
          requirements: foundCampaign.requirement.length ? foundCampaign.requirement : [""],
          participationInfo: {
            recruitmentPeriod: {
              start: foundCampaign.announce_start || null,
              end: foundCampaign.announce_end || null
            },
            participationPeriod: {
              start: foundCampaign.campaign_start || null,
              end: foundCampaign.campaign_end || null
            },
            selectionDate: foundCampaign.campaign_select || null,
            recruitmentCount: foundCampaign.totalApplicants || ""
          },
          productPage: foundCampaign.campaign_url || ""
        });
      }
    }
  }, [mode, campaignId]);

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

  const fillAllInfo = (
    formData.participationInfo.recruitmentPeriod.start &&
    formData.participationInfo.recruitmentPeriod.end &&
    formData.participationInfo.participationPeriod.start &&
    formData.participationInfo.participationPeriod.end &&
    formData.participationInfo.selectionDate &&
    formData.participationInfo.recruitmentCount
  );

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
      Boolean(fillAllInfo) // 8: 참여 정보
    ];
  };

  const completedSteps = getCompletedSteps();
  const progress = completedSteps.filter(Boolean).length;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      alert("캠페인이 정상적으로 수정되었습니다.");
      router.push(`/advertiser/ads-list/${campaignId}`);
    } else {
      alert("캠페인이 정상적으로 등록되었습니다.");
      router.push("/advertiser/ads-list")
    }
  };

  const handleCancle = () => {
    if (mode === "edit") {
      router.push(`/advertiser/ads-list/${campaignId}`);
    } else {
      router.push("/advertiser/ads-list")
    }
  };

  return(
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
          <TitleSection formData={formData} handleInputChange={handleInputChange} />
          <DetailInfoSection formData={formData} handleInputChange={handleInputChange} />
          <MainGoalSection formData={formData} handleInputChange={handleInputChange} />
          <MissionsSection formData={formData} setFormData={setFormData} />
          <KeywordsSection formData={formData} setFormData={setFormData} />
          <RequirementsSection formData={formData} setFormData={setFormData} />
          <ProductPageSection formData={formData} handleInputChange={handleInputChange} />
          <ParticipationInfoSection formData={formData} setFormData={setFormData} />
        </form>
      </div>

      <div className={styles.buttonSection}>
        <button
          type="button"
          className={styles.submitButton}
          onClick={() => {
            if (completedSteps.every(Boolean)) {
              handleSubmit();
            } else {
              alert("아직 작성되지 않은 내용이 있습니다. 작성 후 다시 시도해주세요.");
            }
          }}
        >
          {mode === "edit" ? "캠페인 수정" : "캠페인 등록"}
        </button>
        <button type="button" className={styles.cancelButton} onClick={handleCancle}>취소</button>
      </div>
    </div>
  );
}