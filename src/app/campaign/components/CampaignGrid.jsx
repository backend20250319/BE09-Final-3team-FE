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

export default function CampaignGrid({searchQuery, sortBy, openModal, currentPage, onPageChange, onTotalPagesChange}) {

  const { activeTab } = useCampaign();

  const [campaigns, setCampaigns] = useState({ recruitingAds: [], endedAds: [] });
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);
  
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAdsGrouped();
        setCampaigns(data);

        const res = await getAppliedAds();
        // applicant.isDeleted가 false인 경우만 필터링
        const appliedData = res.ads
          .filter(item => !item.isDeleted) // applicant.isDeleted가 false인 경우만
          .map(item => item.advertisement);
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
  
  // Pagination 계산
  const totalItems = sortedCampaigns.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCampaigns = sortedCampaigns.slice(startIndex, endIndex);

  // 페이지 변경 시 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // totalPages 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }
  }, [totalPages, onTotalPagesChange]);

  return (
    <section className={styles.campaignGrid}>
      {searchQuery && (
        <div className={styles.searchResults}>
          <p>"{searchQuery}" 검색 결과: {searchFilteredCampaigns.length}건</p>
        </div>
      )}
      <div className={styles.grid}>
        {paginatedCampaigns.length > 0 ? (
          paginatedCampaigns.map((campaign) => (
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