import React, { useState, useEffect } from "react";
import styles from "../styles/CampaignGrid.module.css";
import CampaignCard from "./CampaignCard";
import { useCampaign } from "../context/CampaignContext";
import { getAdsGrouped, getAppliedAds } from "@/api/campaignApi";

function sortCampaigns(campaigns, sortBy, activeTab) {
  switch (sortBy) {
    case "recent":
      // 최신순
      return activeTab === "recruiting" ? 
        [...campaigns].sort((a, b) => new Date(a.announceStart) - new Date(b.announceStart)) :
        [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) ;
    case "deadline":
      // 마감 임박순 (공고 종료일 오름차순)
      return [...campaigns].sort((a, b) => new Date(a.announceEnd) - new Date(b.announceEnd));
    case "popular":
      // 인기순 (신청자 수 내림차순)
      return [...campaigns].sort((a, b) => {
        const getApplicantsNum = (str) => Number((str || "0").split("/")[0].trim()) || 0;
        return getApplicantsNum(b.applicants) - getApplicantsNum(a.applicants);
      });
    case "endedRecent":
      // 종료일 최신순 (공고 종료일 내림차순)
      return [...campaigns].sort((a, b) => new Date(b.announceEnd) - new Date(a.announceEnd));
    case "endedOld":
      // 종료일 오래된 순 (공고 종료일 오름차순)
      return [...campaigns].sort((a, b) => new Date(a.announceEnd) - new Date(b.announceEnd));
    default:
      return campaigns;
  }
}

export default function CampaignGrid({searchQuery, sortBy, openModal}) {

  const { activeTab } = useCampaign();

  const [campaigns, setCampaigns] = useState({ recruitingAds: [], endedAds: [] });
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAdsGrouped();
        setCampaigns(data);

        const res = await getAppliedAds();
        const appliedData = res.ads.map(item => item.advertisement);
        setAppliedCampaigns(appliedData);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [activeTab]);

  const filteredCampaigns = activeTab === "recruiting"
  ? campaigns.recruitingAds : activeTab === "ended"
  ? campaigns.endedAds : (appliedCampaigns || []);

  const finalFilteredCampaigns = searchQuery
  ? filteredCampaigns.filter(c => c.title.includes(searchQuery))
  : filteredCampaigns;

  const sortedCampaigns = sortCampaigns(finalFilteredCampaigns, sortBy, activeTab);

  return (
    <section className={styles.campaignGrid}>
      <div className={styles.grid}>
        {sortedCampaigns.map((campaign) => (
          <CampaignCard key={campaign.adNo} campaign={campaign} openModal={openModal} />
        ))}
      </div>
    </section>
  );
}