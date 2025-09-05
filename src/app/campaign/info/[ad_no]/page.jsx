'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import CampaignDetail from './components/CampaignDetail';
import CampaignHeader from './components/CampaignHeader';
import CampaignSidebar from './components/CampaignSidebar';
import styles from ".//styles/CampaignPage.module.css"
import { getAd, getAdvertiserFile, getImageByAdNo } from '@/api/campaignApi';

export default function AdvertisementPage() {
  const params = useParams();
  const router = useRouter();
  const [campaignData, setCampaignData] = useState(null);
  const [advImage, setAdvImage] = useState(null);
  const [adImage, setAdImage] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const adNo = parseInt(params.ad_no, 10);
      try {
        const data = await getAd(adNo);
        setCampaignData(data);

        const adImageData = await getImageByAdNo(adNo);
        setAdImage(adImageData);

      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaign();
  }, [params.ad_no]);

  useEffect(() => {
    if (campaignData){
      const getAdvImage = async () => {
        const advImageData = await getAdvertiserFile(campaignData.advertiser.advertiserNo);
        setAdvImage(advImageData[0]);
      };

      getAdvImage();
    }
  }, [campaignData]);

  return (
    <>
      <div className={styles.headerNavigation}>
        <button className={styles.backButton}
          onClick={() => router.push('/campaign')}>
          <Image
            src="/campaign/arrow.png"
            alt="arrow.png"
            width={14}
            height={12}
            className={styles.backIcon}
          />
          체험단 목록으로 이동
        </button>
      </div>
      {campaignData && adImage && advImage && (
        <div className={styles.campaignContainer}>
          <CampaignHeader 
            title={campaignData.title}
            brand={campaignData.advertiser.name}
            image={adImage}
            advImage={advImage}
          />
          
          <div className={styles.campaignContent}>
            <div className={styles.campaignMain}>
              <CampaignDetail campaignData={campaignData} />
            </div>
            
            <div className={styles.campaignSidebar}>
              <CampaignSidebar campaignData={campaignData} advImage={advImage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 