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
        [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(b.createdAt)) ;
    case "deadline":
      // 마감 임박순 (공고 종료일 오름차순)
      return [...campaigns].sort((a, b) => new Date(a.announceEnd) - new Date(b.announceEnd));
    case "popular":
      // 인기순 (신청자 수 내림차순)
      return [...campaigns].sort((a, b) => {
        return b.applicants -a.applicants;
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

function filterCampaigns(campaigns, searchQuery) {
  if (!searchQuery.trim()) {
    return campaigns;
  }
  
  const query = searchQuery.toLowerCase().trim();
  
  return campaigns.filter(campaign => {
    // 제목에서 검색
    if (campaign.title && campaign.title.toLowerCase().includes(query)) {
      return true;
    }

    // 브랜드명에서 검색
    if (campaign.advertiser && campaign.advertiser.name && campaign.advertiser.name.toLowerCase().includes(query)) {
      return true;
    }
    
    // 키워드에서 검색
    if (campaign.keyword && Array.isArray(campaign.keyword)) {
      const hasKeyword = campaign.keyword.some(keyword => 
        keyword.content && keyword.content.toLowerCase().includes(query)
      );
      if (hasKeyword) return true;
    }
    
    return false;
  });
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

  // 상세한 검색 필터링 적용
  const searchFilteredCampaigns = filterCampaigns(filteredCampaigns, searchQuery);
  
  // 정렬 적용
  const sortedCampaigns = sortCampaigns(searchFilteredCampaigns, sortBy, activeTab);

  return (
    <section className={styles.campaignGrid}>
      {searchQuery && (
        <div className={styles.searchResults}>
          <p>"{searchQuery}" 검색 결과: {searchFilteredCampaigns.length}건</p>
        </div>
      )}
      <div className={styles.grid}>
        {sortedCampaigns.length > 0 ? (
          sortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.adNo} campaign={campaign} openModal={openModal} />
          ))
        ) : (
          <div className={styles.noResults}>
            {searchQuery ? (
              <p>검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
            ) : (
              <p>등록된 캠페인이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}