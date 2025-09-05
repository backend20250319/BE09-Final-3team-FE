"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CampaignDetail from './components/CampaignDetail';
import { getAd } from '@/api/advertisementApi';

export default function CampaignDetailPage() {
  const params = useParams();
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const adNo = parseInt(params.ad_no, 10);
    const fetchData = async () => {
      try {
        const data = await getAd(adNo);
        setCampaignData(data);
      } catch (error) {
        console.error("Failed to get advertisement:", error);
      }
    };

    fetchData();
  }, [params.ad_no]);

  return campaignData && (
    <CampaignDetail campaignData={campaignData} adNo={parseInt(params.ad_no, 10)} />
  );
}