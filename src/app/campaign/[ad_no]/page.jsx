'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import CampaignDetail from './components/CampaignDetail';
import CampaignHeader from './components/CampaignHeader';
import CampaignSidebar from './components/CampaignSidebar';
import styles from './styles/CampaignPage.module.css'
import campaigns from '../data/campaigns';

export default function AdvertisementPage() {
  const params = useParams();
  const router = useRouter();
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const adNo = parseInt(params.ad_no, 10);
    const foundCampaign = campaigns.find(campaign => campaign.ad_no === adNo);
    setCampaignData(foundCampaign || null);
  }, [params.ad_no]);

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
      {campaignData && (
        <div className={styles.campaignContainer}>
          <CampaignHeader 
            title={campaignData.title}
            brand={campaignData.brand}
            image={campaignData.image}
            brand_url={campaignData.brand_url}
          />
          
          <div className={styles.campaignContent}>
            <div className={styles.campaignMain}>
              <CampaignDetail campaignData={campaignData} />
            </div>
            
            <div className={styles.campaignSidebar}>
              <CampaignSidebar campaignData={campaignData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 