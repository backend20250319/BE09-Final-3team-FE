import React, { useState, useEffect } from "react";
import styles from "../styles/CampaignGrid.module.css";
import CampaignCard from "./CampaignCard";
import { useCampaign } from "../context/CampaignContext";
import { getAllAdsByAdvertiser } from "@/api/advertisementApi";

function sortCampaigns(campaigns, sortBy, activeTab) {
  switch (sortBy) {
    case "recent":
      // 최신순
      return activeTab === "recruiting"
        ? [...campaigns].sort(
            (a, b) => new Date(a.announce_start) - new Date(b.announce_start)
          )
        : [...campaigns].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
    case "popular":
      // 인기순 (신청자 수 내림차순)
      return [...campaigns].sort((a, b) => {
        const getApplicantsNum = (str) =>
          Number((str || "0").split("/")[0].trim()) || 0;
        return getApplicantsNum(b.applicants) - getApplicantsNum(a.applicants);
      });
    case "selectedRecent":
      // 선정일 최신순 (체험단 선정일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.campaign_select) - new Date(a.campaign_select)
      );
    case "selectedOld":
      // 선정일 오래된순 (체험단 선정일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.campaign_select) - new Date(b.campaign_select)
      );
    case "trialEndedRecent":
      // 체험 종료일 최신순 (공고 종료일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.campaign_end) - new Date(a.campaign_end)
      );
    case "trialEndedOld":
      // 체험 종료일 오래된 순 (공고 종료일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.campaign_end) - new Date(b.campaign_end)
      );
    case "createdRecent":
      // 등록일 최신순 (공고 등록일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    case "createdOld":
      // 등록일 오래된 순 (공고 등록일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    case "endedRecent":
      // 종료일 최신순 (공고 종료일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.announce_end) - new Date(b.announce_end)
      );
    case "endedOld":
      // 마감 임박순 & 종료일 오래된 순 (공고 종료일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.announce_end) - new Date(b.announce_end)
      );
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
    if (campaign.brand && campaign.brand.toLowerCase().includes(query)) {
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

export default function CampaignGrid({ searchQuery, sortBy }) {
  const { activeTab } = useCampaign();

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAllAdsByAdvertiser(activeTab.toUpperCase());
        setCampaigns(data.ads || []);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [activeTab]);

  // 검색 필터링 적용
  const filteredCampaigns = filterCampaigns(campaigns, searchQuery);
  
  // 정렬 적용
  const sortedCampaigns = sortCampaigns(filteredCampaigns, sortBy, activeTab);

  return (
    <section className={styles.campaignGrid}>
      {searchQuery && (
        <div className={styles.searchResults}>
          <p>"{searchQuery}" 검색 결과: {filteredCampaigns.length}건</p>
        </div>
      )}
      <div className={styles.grid}>
        {sortedCampaigns.length > 0 ? (
          sortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.adNo} campaign={campaign} />
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
