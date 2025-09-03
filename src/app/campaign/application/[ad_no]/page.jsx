"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import CampaignApplication from '../../application/[ad_no]/components/CampaignApplication';
import ApplicationHeader from '../../application/[ad_no]/components/ApplicationHeader';
import { getAd, getAdvertiserFile, getImageByAdNo } from "@/api/campaignApi";

export default function CampaignApplicationPage() {

  const params = useParams();
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
      <ApplicationHeader />
      {campaignData && adImage && advImage && 
        <CampaignApplication campaignData={campaignData} adImage={adImage} advImage={advImage} />}
    </>
  );
}
