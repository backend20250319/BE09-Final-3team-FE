"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../styles/CampaignForm.module.css"
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
import { createAd, getAllAdsByAdvertiser, getImageByAdNo, updateAdByAdvertiser, updateImage, uploadImage } from '@/api/advertisementApi';

export default function CampaignForm({ mode = "create", campaignId }) {
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    objective: '',
    mission: [{ content: "" }],
    keyword: [{ content: "" }],
    requirement: [{ content: "" }],
    announceStart: null,
    announceEnd: null,
    campaignSelect: null,
    campaignStart: null,
    campaignEnd: null,
    members: 0,
    adUrl: ''
  });

  const [adImage, setAdImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 날짜 문자열을 Date 객체로 변환 (로컬 시간 기준)
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    
    // YYYY-MM-DD 형식의 문자열을 로컬 시간 기준으로 파싱
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month는 0부터 시작하므로 -1
  };

  const handleSave = async () => {
    try {
      // 날짜를 DB 저장용 문자열로 변환
      const formatDateForDB = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const dataToSave = {
        ...formData,
        announceStart: formatDateForDB(formData.announceStart),
        announceEnd: formatDateForDB(formData.announceEnd),
        campaignSelect: formatDateForDB(formData.campaignSelect),
        campaignStart: formatDateForDB(formData.campaignStart),
        campaignEnd: formatDateForDB(formData.campaignEnd),
      };

      if(mode === "edit"){
        await updateAdByAdvertiser(campaignId, dataToSave);
        if (adImage) {
          try {
            await updateImage(campaignId, adImage, false);
          } catch (error) {
            console.error("Failed to upload Image:", error);
          }
        }
      } else {
        const ad = await createAd(dataToSave);
        const adNo = ad.adNo;
        if (adImage && adNo) {
          await handleImageUpload(adImage, adNo);
        }
      }
    } catch (error) {
      console.error("Failed to create advertisement:", error);
    }
  };

  const handleImageUpload = async (adImage, adNo) => {
    if (!adNo) {
      console.error("adNo is required for image upload.");
      return;
    } 
    if (adImage) {
      try {
        await uploadImage(adImage, adNo);
      } catch (error) {
        console.error("Failed to upload Image:", error);
      }
    }
  };

  const [campaigns, setCampaigns] = useState([]);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAllAdsByAdvertiser();
        setCampaigns(data.ads);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (mode === "edit" && campaignId) {
      const adNo = parseInt(campaignId, 10);
      const foundCampaign = campaigns.find(c => c.adNo === adNo);

      getImageByAdNo(adNo).then(imageData => {
      if (imageData) {
        setPreviewImage(imageData);
        setAdImage(imageData);
      }
    });
      
      if (foundCampaign) {
        setFormData({
          title: foundCampaign.title || "",
          content: foundCampaign.content || "",
          objective: foundCampaign.objective || "",
          mission: foundCampaign.mission?.length ? foundCampaign.mission : [{ content: "" }],
          keyword: foundCampaign.keyword?.length ? foundCampaign.keyword : [{ content: "" }],
          requirement: foundCampaign.requirement?.length ? foundCampaign.requirement : [{ content: "" }],
          announceStart: parseLocalDate(foundCampaign.announceStart),
          announceEnd: parseLocalDate(foundCampaign.announceEnd),
          campaignSelect: parseLocalDate(foundCampaign.campaignSelect),
          campaignStart: parseLocalDate(foundCampaign.campaignStart),
          campaignEnd: parseLocalDate(foundCampaign.campaignEnd),
          members: foundCampaign.members || "",
          adUrl: foundCampaign.adUrl || ""
        });
      }
    }
  }, [mode, campaignId, campaigns.length]);

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
    formData.announceStart &&
    formData.announceEnd &&
    formData.campaignSelect &&
    formData.campaignStart &&
    formData.campaignEnd &&
    formData.members
  );

  const getCompletedSteps = () => {
    return [
      Boolean(adImage), // 0: 이미지
      Boolean(formData.title), // 1: 제목
      Boolean(formData.content), // 2: 상세 정보
      Boolean(formData.objective), // 3: 주요 목표
      formData.mission.some(m => m.content), // 4: 미션
      formData.keyword.some(k => k.content), // 5: 키워드
      formData.requirement.some(r => r.content), // 6: 필수 요건
      Boolean(formData.adUrl), // 7: 링크
      Boolean(fillAllInfo) // 8: 참여 정보
    ];
  };

  const completedSteps = getCompletedSteps();
  const progress = completedSteps.filter(Boolean).length;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    handleSave();
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
          <ImageUploadSection adImage={adImage} setAdImage={setAdImage} previewImage={previewImage} setPreviewImage={setPreviewImage} />
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