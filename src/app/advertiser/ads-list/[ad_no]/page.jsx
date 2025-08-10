"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CampaignDetail from './components/CampaignDetail';
import campaigns from '../data/campaigns';

export default function CampaignDetailPage() {
  const params = useParams();
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const adNo = parseInt(params.ad_no, 10);
    const foundCampaign = campaigns.find(c => c.ad_no === adNo);
    setCampaignData(foundCampaign || null);
  }, [params.ad_no, campaignData]);

  return campaignData ? (
    <CampaignDetail campaignData={campaignData} adNo={parseInt(params.ad_no, 10)} />
  ) : null;
}