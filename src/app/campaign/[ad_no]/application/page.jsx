"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import campaigns from "@/app/campaign/data/campaigns";
import CampaignApplication from './components/CampaignApplication';
import ApplicationHeader from './components/ApplicationHeader';

export default function CampaignApplicationPage() {

  const params = useParams();
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const adNo = parseInt(params.ad_no, 10);
    const foundCampaign = campaigns.find(campaign => campaign.ad_no === adNo);
    setCampaignData(foundCampaign || null);
  }, [params.ad_no]);

  return (
    <>
      <ApplicationHeader />
      {campaignData && <CampaignApplication campaignData={campaignData} />}
    </>
  );
}
